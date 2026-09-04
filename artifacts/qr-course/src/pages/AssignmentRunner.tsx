import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "wouter";
import { 
  useGetAssignment, 
  useStartAssignmentAttempt, 
  useGetAttempt, 
  useSaveAnswer, 
  useSubmitAttempt,
  AttemptResult,
  AnswerSaved,
  KeystrokeTrace
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnswerInput } from "@/components/AnswerInput";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { isAdminMode } from "@/lib/adminMode";

export default function AssignmentRunner() {
  const params = useParams();
  const assignmentId = Number(params.id);
  
  const { data: assignment, isLoading: isLoadingAssignment } = useGetAssignment(assignmentId);
  const startAttempt = useStartAssignmentAttempt();
  const submitAttempt = useSubmitAttempt();
  
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const { data: attempt, refetch: refetchAttempt } = useGetAttempt(attemptId || 0, {
    query: { enabled: !!attemptId, queryKey: ['attempt', attemptId] }
  });
  
  const saveAnswer = useSaveAnswer();

  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [traces, setTraces] = useState<Record<number, KeystrokeTrace>>({});
  const [gradedAnswers, setGradedAnswers] = useState<
    Record<number, AnswerSaved>
  >({});
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);

  useEffect(() => {
    if (assignmentId && !attemptId && !startAttempt.isPending && !result) {
      startAttempt.mutate({ assignmentId }, {
        onSuccess: (data) => {
          setAttemptId(data.id);
          const initialAnswers: Record<number, string> = {};
          data.answers.forEach(a => {
            initialAnswers[a.problemId] = a.answer;
          });
          setAnswers(initialAnswers);
        }
      });
    }
  }, [assignmentId, attemptId, startAttempt, result]);

  const handleAnswerChange = (problemId: number, val: string, trace: KeystrokeTrace) => {
    setAnswers(prev => ({ ...prev, [problemId]: val }));
    setTraces(prev => ({ ...prev, [problemId]: trace }));
    setGradedAnswers(prev => {
      if (!prev[problemId]) return prev;
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
    setAnswerError(null);
  };

  const handleAnswerSubmit = () => {
    if (!attemptId) return;
    const problem = assignment?.problems[currentProblemIdx];
    if (!problem) return;
    const answer = answers[problem.id] ?? "";
    const trace = traces[problem.id] ?? {
      keystrokeCount: answer.length,
      eraseCount: 0,
      bulkInsertCount: 0,
      longestBulkInsertChars: 0,
      rewriteSegments: 0,
      durationMs: 0,
    };
    setAnswerError(null);
    saveAnswer.mutate(
      { attemptId, data: { problemId: problem.id, answer, trace } },
      {
        onSuccess: (data) => {
          if (data.persistedAnswer !== answer || data.savedLength !== answer.length) {
            setAnswerError("The saved answer did not match your full response. Please submit it again.");
            return;
          }
          setGradedAnswers(prev => ({ ...prev, [problem.id]: data }));
        },
        onError: (error) => {
          setAnswerError(error instanceof Error ? error.message : String(error));
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!attemptId) return;
    submitAttempt.mutate({ attemptId, data: { skipDetection: isAdminMode() } }, {
      onSuccess: (data) => {
        setResult(data);
      }
    });
  };

  if (isLoadingAssignment || !assignment) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">{assignment.title} - Results</h1>
              <p className="text-muted-foreground">Score: {result.percent}% ({result.score}/{result.total})</p>
            </div>
            <Link href={`/assignments`}>
              <Button variant="outline">Back to Assignments</Button>
            </Link>
          </div>
          
          <div className="flex flex-col gap-6">
            {result.perProblem.map((pr, idx) => (
              <div key={pr.problemId} className={`p-6 rounded-lg border ${pr.correct ? 'border-chart-2/50 bg-chart-2/5' : 'border-destructive/50 bg-destructive/5'}`}>
                <h3 className="font-medium mb-2">Problem {idx + 1}</h3>
                <div className="mb-4">
                  <span className="text-sm font-semibold">Your Answer:</span>
                  <div className="font-mono mt-1">{pr.userAnswer || "No answer"}</div>
                </div>
                {!pr.correct && pr.correctAnswer && (
                  <div className="mb-4 text-primary">
                    <span className="text-sm font-semibold">Correct Answer:</span>
                    <div className="font-mono mt-1">{pr.correctAnswer}</div>
                  </div>
                )}
                <div>
                  <span className="text-sm font-semibold">Explanation:</span>
                  <div className="mt-1 text-sm"><MarkdownRenderer content={pr.explanation} /></div>
                </div>
                
                {/* AI Flags */}
                {result.detection.find(d => d.problemId === pr.problemId)?.aiFlagged && (
                  <div className="mt-4 p-3 bg-secondary rounded-md text-sm border border-secondary-border">
                    <strong className="text-chart-4">Flagged content accepted — no penalty during initial phase.</strong>
                    <p className="text-muted-foreground mt-1">{result.detection.find(d => d.problemId === pr.problemId)?.rationale}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const currentProblem = assignment.problems[currentProblemIdx];
  const currentAnswer = currentProblem ? answers[currentProblem.id] ?? "" : "";
  const currentGrade = currentProblem ? gradedAnswers[currentProblem.id] : undefined;
  const allAnswersGraded = assignment.problems.every(
    problem => gradedAnswers[problem.id],
  );

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6 pb-24">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground">Problem {currentProblemIdx + 1} of {assignment.problems.length}</p>
          </div>
          {attempt?.deadlineAt && (
            <div className="text-destructive font-mono font-bold px-3 py-1 rounded bg-destructive/10 border border-destructive/20">
              Deadline: {new Date(attempt.deadlineAt).toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-chart-2/40 bg-chart-2/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-foreground">
            <strong>This is the graded {assignment.kind} — the tutor is off and your work is scored.</strong>{" "}
            Want to warm up first? Run an unlimited practice version that gives
            feedback and keeps the tutor with you.
          </div>
          <Link href={`/assignments/${assignmentId}/practice`}>
            <Button variant="outline" className="shrink-0">
              ✨ Practice this first
            </Button>
          </Link>
        </div>

        {currentProblem ? (
          <div className="flex flex-col gap-8">
            <div className="prose prose-slate dark:prose-invert max-w-none text-lg">
              <MarkdownRenderer content={currentProblem.prompt} />
            </div>
            
            <div className="flex flex-col gap-4">
              <AnswerInput 
                value={currentAnswer}
                onChange={(val, trace) => handleAnswerChange(currentProblem.id, val, trace)}
                disabled={saveAnswer.isPending}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim() || saveAnswer.isPending || !!currentGrade}
                >
                  {saveAnswer.isPending
                    ? "Saving and grading…"
                    : currentGrade
                      ? "Answer saved and graded"
                      : "Submit this answer"}
                </Button>
                {currentGrade && (
                  <span className="text-sm text-green-700">
                    Full response verified: {currentGrade.savedLength} characters saved.
                  </span>
                )}
              </div>
              {answerError && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                  {answerError}
                </div>
              )}
              {currentGrade && (
                <div
                  className={`rounded-md border p-4 ${
                    currentGrade.correct
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-amber-300 bg-amber-50"
                  }`}
                >
                  <div className="font-semibold">
                    Grade: {currentGrade.gradePercent}%
                  </div>
                  <div className="mt-1 text-sm">
                    <MarkdownRenderer content={currentGrade.explanation} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setCurrentProblemIdx(p => Math.max(0, p - 1))}
                disabled={currentProblemIdx === 0}
              >
                Previous
              </Button>
              
              {currentProblemIdx < assignment.problems.length - 1 ? (
                <Button 
                  onClick={() => setCurrentProblemIdx(p => Math.min(assignment.problems.length - 1, p + 1))}
                  disabled={!currentGrade}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-chart-2 hover:bg-chart-2/90 text-white"
                  disabled={submitAttempt.isPending || !allAnswersGraded}
                >
                  {submitAttempt.isPending
                    ? "Submitting..."
                    : allAnswersGraded
                      ? "Submit Assignment"
                      : "Submit and grade this answer first"}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div>Problem not found.</div>
        )}
      </div>
    </Layout>
  );
}
