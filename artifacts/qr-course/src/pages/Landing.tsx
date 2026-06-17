import { useState } from "react";
import { Link } from "wouter";
import { useSignIn } from "@clerk/react";
import {
  BarChart3,
  BookOpen,
  MessagesSquare,
  Target,
  ClipboardCheck,
  ShieldCheck,
  Search,
} from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

const features = [
  {
    icon: BookOpen,
    title: "Three-Depth Lessons",
    body: "Read any topic Short, Medium, or Long — same ideas, your pace.",
  },
  {
    icon: MessagesSquare,
    title: "Section-Scoped Tutor",
    body: "Ask about the exact passage you're on and get a live, grounded answer.",
  },
  {
    icon: Target,
    title: "Adaptive Practice",
    body: "Questions that get harder on a streak and ease off after a miss.",
  },
  {
    icon: ClipboardCheck,
    title: "AI-Graded Work",
    body: "Homework, a unit test, and a final — each with written feedback.",
  },
  {
    icon: ShieldCheck,
    title: "Built-In Integrity",
    body: "Every submission is screened for AI authorship, with a clear verdict.",
  },
  {
    icon: BarChart3,
    title: "One Unit, 8 Topics",
    body: "From what marketing analytics really is all the way to turning insights into campaigns.",
  },
];

const topics = [
  { n: "1.1", title: "What marketing analytics is" },
  { n: "1.2", title: "Why 'the average customer' doesn't exist" },
  { n: "1.3", title: "The funnel: stranger to buyer" },
  { n: "1.4", title: "What a customer is really worth" },
  { n: "1.5", title: "Churn: spotting who's about to leave" },
  { n: "1.6", title: "A/B testing: letting data settle it" },
  { n: "1.7", title: "Attribution and personalization" },
  { n: "1.8", title: "From insight to campaign" },
];

export default function Landing() {
  const { signIn } = useSignIn();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogle = async () => {
    if (!signIn) return;
    setGoogleError(null);
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: `${basePath}/dashboard`,
        redirectCallbackUrl: `${basePath}/sign-in/sso-callback`,
      });
    } catch {
      setGoogleError(
        "Couldn't start Google sign-in. Make sure Google is enabled in the Auth pane, or use email sign-in.",
      );
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
            <Search className="w-4 h-4" />
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">
            Marketing Analytics
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-secondary transition-colors"
              data-testid="button-sign-in"
            >
              Sign in
            </button>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              data-testid="button-sign-up"
            >
              Get started
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
            <BarChart3 className="w-3.5 h-3.5" />
            A friendly, one-unit intro to marketing analytics
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight mb-5">
            How we know the customer through data. Let's figure it out together.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            A self-paced course that teaches, tutors, drills, and grades you —
            marketing analytics in plain language, no math or coding required.
            Perfect for curious students and grown-ups alike.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleGoogle}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              data-testid="button-cta-start"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white">
                <GoogleIcon />
              </span>
              Sign in with Google to start
            </button>
            <Link href="/sign-in">
              <button
                className="px-6 py-3 rounded-md text-base font-medium border border-border hover:bg-secondary transition-colors"
                data-testid="button-cta-signin"
              >
                I already have an account
              </button>
            </Link>
          </div>
          {googleError && (
            <p
              className="mt-4 text-sm text-destructive"
              data-testid="text-google-error"
            >
              {googleError}
            </p>
          )}
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-6 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-primary">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="text-center font-serif font-semibold text-xl mb-6">
            The Curriculum
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((t) => (
              <div
                key={t.n}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"
              >
                <div className="w-10 h-10 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-sm">
                  {t.n}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Topic {t.n}
                  </div>
                  <div className="font-medium">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        Marketing Analytics — where the curriculum, the tutor, the grader, and the
        integrity check all live in one room.
      </footer>
    </div>
  );
}
