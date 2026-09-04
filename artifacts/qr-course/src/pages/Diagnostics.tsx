import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CheckCircle2, XCircle, Loader2, PlayCircle, Activity, ShieldCheck, FileCheck2 } from "lucide-react";

type Step = {
  name: string;
  ok: boolean;
  ms: number;
  detail?: string;
  error?: string;
};
type RunResult = {
  ok: boolean;
  generatedAt: string;
  steps: Step[];
};

type LiveProofItem = {
  index: number;
  problemId: number;
  prompt: string;
  answer: string;
  requestedLength: string;
  savedLength?: number;
  correct?: boolean;
  gradePercent?: number;
  explanation?: string;
  persistedExactly?: boolean;
};

type LiveProofEvent =
  | { type: "started"; total: number; generatedAt: string }
  | {
      type: "answer";
      index: number;
      problemId: number;
      prompt: string;
      answer: string;
      requestedLength: string;
    }
  | {
      type: "verified";
      index: number;
      problemId: number;
      answer: string;
      savedLength: number;
      correct: boolean;
      gradePercent: number;
      explanation: string;
      persistedExactly: boolean;
    }
  | { type: "failed"; index?: number; error: string }
  | { type: "complete"; ok: boolean; verified: number; total: number };

const API = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`.replace(
  /^\/api/,
  "/api",
);

function apiUrl(path: string): string {
  // The api-server is mounted at /api at the proxy level, not under the artifact path.
  return `/api${path}`;
}

function StepRow({ s }: { s: Step }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      {s.ok ? (
        <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{s.name}</div>
        {s.detail && (
          <div className="text-xs text-muted-foreground mt-0.5 break-words">{s.detail}</div>
        )}
        {s.error && (
          <div className="text-xs text-red-700 mt-0.5 break-words font-mono">{s.error}</div>
        )}
      </div>
      <div className="text-xs text-muted-foreground tabular-nums shrink-0">{s.ms} ms</div>
    </div>
  );
}

function ResultCard({ title, result }: { title: string; result: RunResult | null }) {
  if (!result) return null;
  const passed = result.steps.filter((s) => s.ok).length;
  const total = result.steps.length;
  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="font-serif text-lg">{title}</div>
        <div
          className={`text-sm font-medium ${
            result.ok ? "text-green-700" : "text-red-700"
          }`}
        >
          {passed}/{total} passed
        </div>
      </div>
      <div className="px-5 py-2">
        {result.steps.map((s, i) => (
          <StepRow key={i} s={s} />
        ))}
      </div>
    </div>
  );
}

export default function Diagnostics() {
  const [proofBusy, setProofBusy] = useState(false);
  const [proofItems, setProofItems] = useState<LiveProofItem[]>([]);
  const [proofSummary, setProofSummary] = useState<{
    ok: boolean;
    verified: number;
    total: number;
  } | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [sysBusy, setSysBusy] = useState(false);
  const [synthBusy, setSynthBusy] = useState(false);
  const [qcBusy, setQcBusy] = useState(false);
  const [sysResult, setSysResult] = useState<RunResult | null>(null);
  const [synthResult, setSynthResult] = useState<RunResult | null>(null);
  const [qcResult, setQcResult] = useState<RunResult | null>(null);
  const [sysError, setSysError] = useState<string | null>(null);
  const [synthError, setSynthError] = useState<string | null>(null);
  const [qcError, setQcError] = useState<string | null>(null);

  async function runLiveProof() {
    setProofBusy(true);
    setProofItems([]);
    setProofSummary(null);
    setProofError(null);
    try {
      const response = await fetch(apiUrl("/diagnostics/live-grading-proof"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffered = "";
      const processLine = (line: string) => {
        if (!line.trim()) return;
        const event = JSON.parse(line) as LiveProofEvent;
        if (event.type === "answer") {
          setProofItems((items) => [
            ...items.filter((item) => item.index !== event.index),
            {
              index: event.index,
              problemId: event.problemId,
              prompt: event.prompt,
              answer: event.answer,
              requestedLength: event.requestedLength,
            },
          ].sort((a, b) => a.index - b.index));
        } else if (event.type === "verified") {
          setProofItems((items) =>
            items.map((item) =>
              item.index === event.index
                ? {
                    ...item,
                    answer: event.answer,
                    savedLength: event.savedLength,
                    correct: event.correct,
                    gradePercent: event.gradePercent,
                    explanation: event.explanation,
                    persistedExactly: event.persistedExactly,
                  }
                : item,
            ),
          );
        } else if (event.type === "failed") {
          setProofError(event.error);
        } else if (event.type === "complete") {
          setProofSummary(event);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        buffered += decoder.decode(value, { stream: !done });
        const lines = buffered.split("\n");
        buffered = lines.pop() ?? "";
        lines.forEach(processLine);
        if (done) break;
      }
      processLine(buffered);
    } catch (error) {
      setProofError(error instanceof Error ? error.message : String(error));
    } finally {
      setProofBusy(false);
    }
  }

  async function runSystem() {
    setSysBusy(true);
    setSysError(null);
    setSysResult(null);
    try {
      const r = await fetch(apiUrl("/diagnostics/system"));
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSysResult(await r.json());
    } catch (e) {
      setSysError(e instanceof Error ? e.message : String(e));
    } finally {
      setSysBusy(false);
    }
  }

  async function runSynthetic() {
    setSynthBusy(true);
    setSynthError(null);
    setSynthResult(null);
    try {
      const r = await fetch(apiUrl("/diagnostics/synthetic-run"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSynthResult(await r.json());
    } catch (e) {
      setSynthError(e instanceof Error ? e.message : String(e));
    } finally {
      setSynthBusy(false);
    }
  }

  async function runQualityControl() {
    setQcBusy(true);
    setQcError(null);
    setQcResult(null);
    try {
      const r = await fetch(apiUrl("/diagnostics/quality-control"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setQcResult(await r.json());
    } catch (e) {
      setQcError(e instanceof Error ? e.message : String(e));
    } finally {
      setQcBusy(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Diagnostics</h1>
          <p className="text-muted-foreground">
            Four self-tests to verify the course app is healthy end-to-end.
          </p>
        </div>

        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl flex items-center gap-2">
                <FileCheck2 className="w-5 h-5" /> Live answer and grading proof
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Writes fresh answers of three different lengths to real course questions and
                displays each complete response immediately. Every answer is saved, graded by
                the production semantic grader, reread from the database, and verified
                character-for-character.
              </p>
            </div>
            <button
              onClick={runLiveProof}
              disabled={proofBusy}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60"
            >
              {proofBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              {proofBusy ? "Writing and grading…" : "Run live grading proof"}
            </button>
          </div>
          {proofError && (
            <div className="text-sm text-red-700 font-mono">{proofError}</div>
          )}
          {proofItems.length > 0 && (
            <div className="space-y-4">
              {proofItems.map((item) => (
                <div key={`${item.problemId}-${item.index}`} className="rounded-lg border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold">
                      Proof {item.index + 1} · {item.requestedLength}
                    </div>
                    {item.persistedExactly === undefined ? (
                      <span className="text-sm text-amber-700 inline-flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" /> Grading now
                      </span>
                    ) : (
                      <span className="text-sm text-green-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Saved and verified
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">{item.prompt}</div>
                  <div className="mt-3 whitespace-pre-wrap rounded-md border bg-background p-4 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                  {item.persistedExactly !== undefined && (
                    <div className="mt-3 text-sm space-y-1">
                      <div>
                        <strong>{item.savedLength} characters</strong> reread exactly from the database.
                      </div>
                      <div>
                        Grade: <strong>{item.gradePercent}%</strong>
                      </div>
                      {item.explanation && <div>{item.explanation}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {proofSummary && (
            <div className={`rounded-md border p-4 text-sm font-medium ${
              proofSummary.ok
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}>
              {proofSummary.ok
                ? `${proofSummary.verified}/${proofSummary.total} complete answers were graded, saved, and verified without truncation.`
                : `${proofSummary.verified}/${proofSummary.total} answers passed full persistence and grading verification.`}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl flex items-center gap-2">
                <Activity className="w-5 h-5" /> Diagnostic 1 — System check
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Verifies database connectivity, content seed, OpenAI integration (chat + JSON
                mode), detection pipeline, and the grader. Takes a few seconds.
              </p>
            </div>
            <button
              onClick={runSystem}
              disabled={sysBusy}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60"
            >
              {sysBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              {sysBusy ? "Running…" : "Run system check"}
            </button>
          </div>
          {sysError && (
            <div className="text-sm text-red-700 font-mono">{sysError}</div>
          )}
          <ResultCard title="System check results" result={sysResult} />
        </section>

        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl flex items-center gap-2">
                <Activity className="w-5 h-5" /> Diagnostic 2 — Synthetic student
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Walks a synthetic student through the whole course: reads every lecture,
                starts and submits every assignment (homework, tests, midterm, final), runs
                adaptive practice, asks the AI tutor, and triggers AI + diachronic detection.
                This exercises every endpoint a real student would touch and can take
                several minutes (each grade and generation is an LLM call). The AI detector
                will fire on the synthetic answers — that is the intended behavior.
              </p>
            </div>
            <button
              onClick={runSynthetic}
              disabled={synthBusy}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60"
            >
              {synthBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              {synthBusy ? "Running…" : "Run synthetic student"}
            </button>
          </div>
          {synthError && (
            <div className="text-sm text-red-700 font-mono">{synthError}</div>
          )}
          <ResultCard title="Synthetic student results" result={synthResult} />
        </section>

        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Diagnostic 3 — Answer-key quality control
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Uses OpenAI to independently re-derive the answer to a sample of course
                problems across every unit and verify that each seeded answer key is a
                legitimate, correct, and unambiguous answer to its prompt. Any key the model
                judges wrong, off-topic, or ambiguous is flagged before a student is ever
                graded against it. Each review is an LLM call, so this can take a minute.
              </p>
            </div>
            <button
              onClick={runQualityControl}
              disabled={qcBusy}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60"
            >
              {qcBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              {qcBusy ? "Running…" : "Run quality control"}
            </button>
          </div>
          {qcError && (
            <div className="text-sm text-red-700 font-mono">{qcError}</div>
          )}
          <ResultCard title="Answer-key quality-control results" result={qcResult} />
        </section>
      </div>
    </Layout>
  );
}
