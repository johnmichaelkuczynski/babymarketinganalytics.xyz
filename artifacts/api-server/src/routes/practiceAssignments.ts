import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  db,
  assignmentsTable,
  problemsTable,
  topicsTable,
  practiceSessionsTable,
  practiceProblemsTable,
  practiceAttemptsTable,
} from "@workspace/db";
import {
  GeneratePracticeAssignmentResponse,
  GradePracticeAssignmentBody,
  GradePracticeAssignmentResponse,
} from "@workspace/api-zod";
import { chatJson } from "../lib/ai";
import { gradePracticeEssay } from "../lib/grading";

const router: IRouter = Router();

function isMultipleChoicePrompt(prompt: string): boolean {
  return (
    prompt.startsWith("Multiple choice —") &&
    ["A)", "B)", "C)", "D)"].every((option) => prompt.includes(option))
  );
}

function isValidGeneratedProblem(
  problem: { prompt: string; correctAnswer: string },
  shouldBeMultipleChoice: boolean,
): boolean {
  const prompt = problem.prompt.trim();
  if (shouldBeMultipleChoice) {
    return isMultipleChoicePrompt(prompt) && /^[A-D]\s*—\s*\S/.test(problem.correctAnswer.trim());
  }
  return (
    !isMultipleChoicePrompt(prompt) &&
    (prompt.includes("one concise sentence") || prompt.includes("at most two sentences"))
  );
}

function parseIdParam(raw: unknown): number {
  const s = Array.isArray(raw) ? raw[0] : (raw as string);
  return parseInt(s ?? "", 10);
}

// Generate a fresh, never-graded PRACTICE version of a graded assignment.
// Each call produces a brand-new set of problems modeled on the source
// assignment (same topics, same kind, same reasoning-answer format) — so the
// student can drill infinitely many practice homeworks / tests / midterms /
// finals before sitting the real one.
router.post(
  "/assignments/:assignmentId/practice",
  async (req, res): Promise<void> => {
    const assignmentId = parseIdParam(req.params.assignmentId);
    if (!Number.isFinite(assignmentId)) {
      res.status(400).json({ error: "invalid assignmentId" });
      return;
    }

    const [assignment] = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.id, assignmentId));
    if (!assignment) {
      res.status(404).json({ error: "assignment not found" });
      return;
    }

    const sourceProblems = await db
      .select({
        prompt: problemsTable.prompt,
        correctAnswer: problemsTable.correctAnswer,
        topicId: problemsTable.topicId,
        topicTitle: topicsTable.title,
        position: problemsTable.position,
      })
      .from(problemsTable)
      .leftJoin(topicsTable, eq(problemsTable.topicId, topicsTable.id))
      .where(eq(problemsTable.assignmentId, assignmentId))
      .orderBy(asc(problemsTable.position));

    if (sourceProblems.length === 0) {
      res.status(404).json({ error: "assignment has no problems" });
      return;
    }

    // Cap how many we generate per set to keep generation snappy; mirror the
    // real assignment's length up to the cap.
    const templates = sourceProblems.slice(0, 10);

    let generated: Array<{
      prompt: string;
      correctAnswer: string;
      explanation: string;
    }> = [];
    try {
      const out = await chatJson<{
        problems: Array<{
          prompt: string;
          correctAnswer: string;
          explanation: string;
        }>;
      }>(
        `You write a PRACTICE version of an introductory predictive analytics ${assignment.kind} titled "${assignment.title}". Produce EXACTLY ${templates.length} new, self-contained scenario-reasoning problems. Use a deterministic format: items 1, 3, 5, etc. are multiple choice and items 2, 4, 6, etc. are written, yielding roughly 50% multiple choice. Every item covers the same topic and concept as its matching template but has a different scenario and wording; never ask a definition or recitation. For each multiple-choice item, start the prompt exactly "Multiple choice —", give four clearly labeled options A), B), C), D), and make correctAnswer start with the correct option letter followed by " — " and the correct option's substance. For each written item, present a concrete scenario, explicitly require "one concise sentence" (or "at most two sentences"), and give a concise model answer. Do not reference the lecture, text, course, or named reading examples. Include a short explanation. Respond as strict JSON: {"problems": [{"prompt": string, "correctAnswer": string, "explanation": string}, ...]} with exactly ${templates.length} items.`,
        JSON.stringify({
          assignmentKind: assignment.kind,
          assignmentTitle: assignment.title,
          templates: templates.map((t, i) => ({
            number: i + 1,
            topic: t.topicTitle ?? "predictive analytics",
            promptStyleExample: t.prompt,
            modelAnswerExample: t.correctAnswer,
          })),
        }),
      );
      generated = Array.isArray(out?.problems) ? out.problems : [];
    } catch {
      generated = [];
    }

    // Fall back to a self-contained restatement if generation failed/short.
    const finalProblems = templates.map((t, i) => {
      const g = generated[i];
      const topic = t.topicTitle ?? "this topic";
      const shouldBeMultipleChoice = i % 2 === 0;
      if (
        g &&
        typeof g.prompt === "string" &&
        g.prompt.trim() &&
        typeof g.correctAnswer === "string" &&
        g.correctAnswer.trim() &&
        isValidGeneratedProblem(g, shouldBeMultipleChoice)
      ) {
        return {
          topicId: t.topicId,
          prompt: g.prompt.trim(),
          correctAnswer: g.correctAnswer.trim(),
          explanation:
            (g.explanation ?? "").trim() ||
            "Explain your reasoning using the core concept this problem targets.",
        };
      }
      return {
        topicId: t.topicId,
          prompt: shouldBeMultipleChoice
            ? `Multiple choice — A neighborhood shop faces a decision after a surprising pattern in its data about ${topic}. Which response best applies the evidence? A) Treat one observation as certain proof. B) Check the pattern and make a cautious decision that fits the evidence. C) Ignore all data. D) Assume a confident claim guarantees the outcome.`
            : `Practice (${topic}): A neighborhood shop must act after seeing a surprising pattern in its data; in one concise sentence, explain how the idea behind "${topic}" should guide its decision.`,
          correctAnswer: shouldBeMultipleChoice
            ? "B — Check the pattern and make a cautious decision that fits the evidence."
            : t.correctAnswer,
        explanation:
          "Re-read the relevant section, state the main claim in your own words, and ground it with a concrete example.",
      };
    });

    const [session] = await db
      .insert(practiceSessionsTable)
      .values({
        weekNumber: assignment.weekNumber,
        topicId: null,
        assignmentId: assignment.id,
        mode: "assignment",
        tutorEnabled: true,
        focusOnWeaknesses: false,
        difficulty: 2.5,
      })
      .returning();
    if (!session) {
      res.status(500).json({ error: "failed to create practice session" });
      return;
    }

    const inserted = await db
      .insert(practiceProblemsTable)
      .values(
        finalProblems.map((p) => ({
          sessionId: session.id,
          topicId: p.topicId,
          prompt: p.prompt,
          correctAnswer: p.correctAnswer,
          explanation: p.explanation,
          difficulty: 2.5,
        })),
      )
      .returning();

    const topicTitleById = new Map(
      templates.map((t) => [t.topicId, t.topicTitle ?? null]),
    );

    res.json(
      GeneratePracticeAssignmentResponse.parse({
        sessionId: session.id,
        assignmentId: assignment.id,
        title: assignment.title,
        kind: assignment.kind,
        instructions: assignment.instructions ?? null,
        problems: inserted.map((p) => ({
          id: p.id,
          prompt: p.prompt,
          topicId: p.topicId,
          topicTitle: topicTitleById.get(p.topicId) ?? null,
        })),
      }),
    );
  },
);

// Grade every answer in a practice-assignment set and return rich coaching
// feedback per problem. Practice is never penalized — the score is purely
// informational so the student can see if they're ready for the real thing.
router.post(
  "/practice/assignment-sessions/:sessionId/grade",
  async (req, res): Promise<void> => {
    const sessionId = parseIdParam(req.params.sessionId);
    if (!Number.isFinite(sessionId)) {
      res.status(400).json({ error: "invalid sessionId" });
      return;
    }
    const parsed = GradePracticeAssignmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [session] = await db
      .select()
      .from(practiceSessionsTable)
      .where(eq(practiceSessionsTable.id, sessionId));
    if (!session) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (session.mode !== "assignment") {
      res
        .status(400)
        .json({ error: "session is not an assignment practice session" });
      return;
    }

    const problems = await db
      .select()
      .from(practiceProblemsTable)
      .where(eq(practiceProblemsTable.sessionId, sessionId))
      .orderBy(asc(practiceProblemsTable.id));

    const answerByProblem = new Map(
      parsed.data.answers.map((a) => [a.problemId, a]),
    );

    const submittedProblems = problems.filter((problem) =>
      answerByProblem.has(problem.id),
    );
    if (submittedProblems.length === 0) {
      res.status(400).json({ error: "submit at least one answer for grading" });
      return;
    }

    const results = await Promise.all(
      submittedProblems.map(async (problem) => {
        const submitted = answerByProblem.get(problem.id);
        const answer = submitted?.answer ?? "";
        const graded = await gradePracticeEssay({
          prompt: problem.prompt,
          correctAnswer: problem.correctAnswer,
          userAnswer: answer,
        });

        await db.insert(practiceAttemptsTable).values({
          sessionId,
          problemId: problem.id,
          topicId: problem.topicId,
          answer,
          correct: graded.correct,
          difficulty: problem.difficulty,
          trace: submitted?.trace ?? null,
        });

        return {
          problemId: problem.id,
          prompt: problem.prompt,
          correct: graded.correct,
          userAnswer: answer,
          correctAnswer: problem.correctAnswer,
          feedback: graded.feedback,
        };
      }),
    );

    const total = results.length;
    const score = results.filter((r) => r.correct).length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    res.json(
      GradePracticeAssignmentResponse.parse({
        score,
        total,
        percent,
        results,
      }),
    );
  },
);

export default router;
