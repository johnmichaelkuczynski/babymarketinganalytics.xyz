// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Predictive Analytics subject-specific reasoning.
//     Realistic short cases about the course material; the best-supported answer
//     is keyed first.
//   - general  — General Reasoning. Genuine reasoning items spanning analysis,
//     inference, evaluation, deduction, and induction (NOT a "docility"/agree-
//     with-authority test).
//
// Each (instrument, phase) is offered in THREE selectable answer formats that
// share the same kind of questions:
//   - mcq     — pick the single best option.
//   - hybrid  — pick the best option AND (optionally) write a short note.
//   - written — no options shown; write a short answer in your own words.
//
// These diagnostics are UNGRADED practice: takeable anytime, unlimited times,
// and they never affect the course grade. Every time a test is started, fresh
// questions are generated (see reasoning.ts) so questions never repeat. The
// items below are the structural BLUEPRINT (style + fallback) for that
// generation, grounded per phase by GEN_SPECS.
//
// All items are ORIGINAL. For every item the correct option is written FIRST;
// at seed time options are rotated so the correct answer lands at a varied
// index (see seedDiagnostics.ts). `modelAnswer` is the ideal short written
// response used to grade the written/hybrid formats.
// ---------------------------------------------------------------------------

export type SkillArea =
  | "analysis"
  | "inference"
  | "evaluation"
  | "deduction"
  | "induction";

export type Instrument = "subject" | "general";

export type Phase = "before" | "third" | "twothirds" | "after";

export type DiagFormat = "mcq" | "hybrid" | "written";

// A single unified diagnostic item. The correct option is listed FIRST and is
// rotated to a random index at seed time. `modelAnswer` is the reference answer
// for grading the written/hybrid formats.
export type DiagItem = {
  prompt: string;
  options: string[];
  modelAnswer: string;
  skillArea?: SkillArea;
};

export type DiagnosticSeed = {
  instrument: Instrument;
  phase: Phase;
  format: DiagFormat;
  title: string;
  subtitle: string;
  instructions: string;
  items: DiagItem[];
};

// ===========================================================================
// Phase metadata
// ===========================================================================

export const PHASE_ORDER: Phase[] = ["before", "third", "twothirds", "after"];

export const PHASE_LABEL: Record<Phase, string> = {
  before: "Before the course",
  third: "One-third of the way through",
  twothirds: "Two-thirds of the way through",
  after: "After the course",
};

// ===========================================================================
// Per-(instrument, phase) generation specs
// Used by reasoning.ts to generate fresh, never-repeating questions grounded in
// the right scope for the chosen time-point. `topicFocus` describes WHAT to ask
// about; `level` nudges difficulty for the time-point.
// ===========================================================================

export type GenSpec = { topicFocus: string; level: string };

const SUBJECT_SPECS: Record<Phase, GenSpec> = {
  before: {
    level:
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms.",
    topicFocus:
      "What predictive analytics is and how it thinks about the future: that you use patterns in past data to estimate what's *likely* to happen next, that a prediction is an estimate or set of odds rather than a guarantee, and that everyone already predicts informally — doing it with data is more honest than trusting gut feeling. The past is a guide, not a promise.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what predictive analytics is (the past is a guide, not a guarantee); the shape of data over time (trend, seasonality, and noise, and not mistaking random noise for a real signal); and regression (finding the underlying relationship or 'line of best fit' to estimate one thing from another, and the danger of pushing that line far beyond the data you've seen).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: what predictive analytics is, the shape of data over time, and regression, PLUS correlation vs. causation (two things moving together doesn't prove one causes the other, since a hidden third factor often drives both), forecasting methods (from a simple moving average to machine learning, where fancier is not automatically better), and measuring forecast error (a forecast only means something if you check it against reality and score how wrong it was).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: what predictive analytics is, the shape of data over time, regression, correlation vs. causation, forecasting methods, and measuring forecast error, PLUS why forecasts fail (irreducible uncertainty, black swans, and overfitting a model to the quirks of old data) and from prediction to decision (a prediction is only useful if it changes a decision, and you weigh the cost of being wrong in each direction and size the bet to your confidence).",
  },
};

const GENERAL_SPECS: Record<Phase, GenSpec> = {
  before: {
    level: "Everyday, accessible reasoning. One step of inference per item.",
    topicFocus:
      "General reasoning on everyday, neutral topics: identifying assumptions and conclusions, what evidence does and does not support, judging the strength of sources, valid vs. invalid deduction, and the strength of generalizations.",
  },
  third: {
    level: "Everyday reasoning, slightly more demanding than the baseline.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  twothirds: {
    level: "Moderately demanding reasoning, sometimes two steps.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  after: {
    level: "More demanding, multi-step reasoning where appropriate.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
};

export function genSpecFor(instrument: Instrument, phase: Phase): GenSpec {
  return instrument === "subject"
    ? SUBJECT_SPECS[phase]
    : GENERAL_SPECS[phase];
}

// ===========================================================================
// Format-specific instructions
// ===========================================================================

const FORMAT_LABEL: Record<DiagFormat, string> = {
  mcq: "Multiple Choice",
  hybrid: "Hybrid",
  written: "Written",
};

function instructionsFor(instrument: Instrument, format: DiagFormat): string {
  const subject =
    instrument === "subject"
      ? "Answer each question about predictive analytics — these reward careful reasoning about realistic forecasting situations, not memorized facts"
      : "Answer each reasoning question — these measure how you think, not what you recall";
  const body =
    format === "mcq"
      ? `${subject} by selecting the single best option.`
      : format === "hybrid"
        ? `${subject} by selecting the best option. You can add a quick note on your reasoning if you like — it's optional and a few words is plenty.`
        : `${subject}. No answer options are shown — just jot a brief answer in your own words. One or two sentences is plenty; there's no need to write a lot.`;
  return `${body} This is ungraded practice — take it anytime, as many times as you like; it never affects your course grade. Submitting shows your results with written feedback.`;
}

// ===========================================================================
// SUBJECT — Predictive Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a forecaster how she can possibly say what next month's sales will look like when nobody can know the future. She would most likely explain that a prediction is:",
    options: [
      "an estimate of what's likely, read from patterns in past data — not a guarantee",
      "a certainty, because the numbers always come true",
      "whatever the boss happens to hope will happen",
      "the same thing as a lucky guess about anything at all",
    ],
    modelAnswer:
      "Predictive analytics uses patterns in past data to estimate what's likely to happen next; a prediction is an estimate or set of odds, not a promise that something will happen.",
  },
  {
    prompt:
      "A headline claims 'a confident prediction backed by data is basically a guarantee of what will happen.' How would a forecaster most likely treat this claim?",
    options: [
      "As an oversimplification, since the past is a guide, not a promise, and predictions can be wrong",
      "As obviously true and needing no evidence",
      "As something that can never be checked at all",
      "As true only when the prediction is about money",
    ],
    modelAnswer:
      "It is an oversimplification; even a confident, data-backed prediction is only an estimate of what's likely, so the past guides us but never guarantees the outcome.",
  },
  {
    prompt:
      "Which question is most central to what predictive analytics actually studies?",
    options: [
      "What patterns in past data tell us is likely to happen next, and how sure we can be",
      "Which company has the friendliest-looking logo",
      "How to design the fanciest office lobby",
      "Which forecaster has the most confident voice",
    ],
    modelAnswer:
      "Predictive analytics studies what past patterns suggest is likely to happen next and how confident we can be — using data rather than gut feeling, while remembering a prediction is an estimate, not a certainty.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "An ice-cream shop had one unusually busy Tuesday and the owner wants to hire extra staff for every Tuesday from now on. Deciding whether that's wise depends most on:",
    options: [
      "telling a real pattern from random noise, since one good day may just be a lucky wiggle, not a trend",
      "guessing based on the owner's personal mood that morning",
      "the alphabetical order of the flavors on the menu",
      "how confident the owner sounds when announcing the plan",
    ],
    modelAnswer:
      "A single busy day could just be random noise rather than a repeating pattern; you'd look for a real trend or weekly seasonality across many Tuesdays before treating one good day as a signal.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A shop notices that on hotter days it tends to sell more cold drinks, and wants to estimate tomorrow's drink sales from the forecast temperature. The tool best suited to that is:",
    options: [
      "regression — finding the underlying relationship between temperature and sales so one can be estimated from the other",
      "pure luck, since the two could not possibly be related",
      "counting how many letters are in the word 'lemonade'",
      "whichever number the manager likes best",
    ],
    modelAnswer:
      "Regression finds the underlying relationship (a line of best fit) between temperature and sales, so the shop can estimate one from the other instead of guessing.",
    skillArea: "inference",
  },
  {
    prompt:
      "A team built a line relating study hours to test scores using students who studied 1 to 3 hours, then used it to claim that studying 40 hours straight would produce a near-perfect score. Why would a forecaster push back?",
    options: [
      "Because pushing the line far beyond the data you've actually seen (extrapolation) is unreliable",
      "Because lines can never describe a relationship at all",
      "Because study hours have nothing to do with scores ever",
      "Because only very large groups of students can be measured",
    ],
    modelAnswer:
      "The relationship was only learned over 1–3 hours; stretching the line out to 40 hours is extrapolating far beyond the data, where the pattern may not hold, so the claim isn't trustworthy.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A town finds that the more firefighters it sends to a blaze, the more damage the fire causes, and a councilor concludes that firefighters cause the damage. What's the better way to read this?",
    options: [
      "A hidden third factor — the size of the fire — drives both, so correlation here isn't causation",
      "Sending firefighters clearly causes the extra damage",
      "The two numbers moving together proves one causes the other",
      "The damage figures must simply be made up",
    ],
    modelAnswer:
      "Bigger fires both cause more damage and require more firefighters, so the link is driven by a hidden third factor; two things rising together doesn't mean one causes the other.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A manager replaces a simple moving average that staff understand with a complex machine-learning model nobody on the team can explain or check. What's the most sensible caution?",
    options: [
      "Fancier isn't automatically better; a method you can understand and check often beats a black box you can't",
      "The most complex method is always the most accurate one",
      "Simple methods like a moving average are never worth using",
      "The choice of method can never affect the forecast",
    ],
    modelAnswer:
      "A model is only as good as its assumptions, and a complex black box you can't inspect can hide mistakes; a simpler method you understand and can check is often the wiser choice.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A forecaster keeps publishing confident predictions but never goes back to compare them with what actually happened. Why is that a problem?",
    options: [
      "A forecast only means something if you measure its error against reality; one nobody scores is worthless",
      "Checking a forecast against reality is a waste of time",
      "A confident forecast must be accurate because it sounds sure",
      "Forecasts can never be compared to what really happened",
    ],
    modelAnswer:
      "Accuracy is earned by being checked: error is the gap between what you predicted and what happened, and a forecast nobody ever backtests against reality is worthless no matter how confident it sounds.",
    skillArea: "inference",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A model predicted last year's sales almost perfectly but flopped badly this year. Drawing on the unit, the most likely explanation is:",
    options: [
      "Overfitting — it memorized the quirks and noise of old data instead of the real pattern, so it broke on new data",
      "The model was simply too simple to be useful",
      "Forecasts are pointless, so this proves they should never be made",
      "Last year's data must have been entirely fake",
    ],
    modelAnswer:
      "A model that nails the past but fails on new data has usually overfit — it learned the random noise and quirks of old data rather than the true pattern, so the more it was tuned to the past, the worse it did on the future.",
    skillArea: "inference",
  },
  {
    prompt:
      "A planner had a sensible forecast, yet a rare, unforeseeable event the past had never shown wrecked it. How should that one result be understood?",
    options: [
      "As a black swan — some uncertainty is irreducible, so a good forecast can still be undone by the unforeseeable",
      "As proof the forecaster is incompetent",
      "As a guarantee that all forecasting is useless",
      "As a fixed fact the planner should have simply known",
    ],
    modelAnswer:
      "Black swans are rare, huge events the past never showed, and some uncertainty can't be removed; one being blindsided by such an event doesn't make the original forecast unreasonable, it shows why forecasts are held with humility.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "Two forecasts are equally likely to be right, but acting wrongly on one would be cheap to fix while acting wrongly on the other would be ruinous. From prediction to decision, the strongest point is that:",
    options: [
      "A prediction is only useful when it changes a decision, and you weigh the cost of being wrong in each direction",
      "You should always act on whichever forecast sounds most confident",
      "The two situations should be treated identically since the odds match",
      "Predictions should never influence any decision at all",
    ],
    modelAnswer:
      "A prediction matters only if it changes what you do, and equal odds don't mean equal stakes; you size the bet to your confidence and to the cost of being wrong in each direction, acting with humility where a mistake would be ruinous.",
    skillArea: "evaluation",
  },
];

// ===========================================================================
// GENERAL — reasoning blueprint (analysis / inference / evaluation /
// deduction / induction). Shared across phases; difficulty is nudged per phase
// at generation time (see GEN_SPECS.level).
// ===========================================================================

const GENERAL_BLUEPRINT: DiagItem[] = [
  {
    prompt:
      "Consider: 'All students who studied passed the exam. Maria studied. So Maria passed.' Which unstated assumption does the argument rely on?",
    options: [
      "Maria is among the students the first statement describes.",
      "Studying is the only way to pass the exam.",
      "Maria always studies for her exams.",
      "The exam was unusually difficult.",
    ],
    modelAnswer:
      "It assumes Maria is one of the students covered by 'all students who studied' — that her studying puts her in the group described.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A survey finds 70% of people who exercise daily report good sleep, versus 30% of those who never exercise. Which conclusion is best supported?",
    options: [
      "People who exercise daily are more likely to report good sleep than those who never exercise.",
      "Exercise guarantees good sleep for everyone.",
      "Poor sleep is what causes people to stop exercising.",
      "Anyone who wants good sleep must exercise daily.",
    ],
    modelAnswer:
      "Only that daily exercisers are more likely to report good sleep — an association, not a guarantee or a proven cause.",
    skillArea: "inference",
  },
  {
    prompt: "Which source would most strengthen the claim 'this medication is safe'?",
    options: [
      "A large, peer-reviewed clinical trial.",
      "A testimonial from one satisfied customer.",
      "An advertisement produced by the manufacturer.",
      "A popular wellness blog post.",
    ],
    modelAnswer:
      "A large, peer-reviewed clinical trial — independent, systematic evidence is far stronger than a testimonial, an ad, or a blog.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "'If it rained, the streets are wet. The streets are not wet.' What necessarily follows?",
    options: [
      "It did not rain.",
      "It rained.",
      "The streets are dry for some other reason.",
      "Nothing at all follows.",
    ],
    modelAnswer:
      "It did not rain — if rain would have made the streets wet and they are not wet, then it cannot have rained.",
    skillArea: "deduction",
  },
  {
    prompt:
      "Plants given a new fertilizer grew taller than otherwise identical plants without it, all else held equal. The best-supported conclusion is:",
    options: [
      "The fertilizer probably caused the extra growth.",
      "Taller plants attract more fertilizer.",
      "Fertilizer is required for any plant growth at all.",
      "The result was pure coincidence.",
    ],
    modelAnswer:
      "Because everything else was held equal, the fertilizer probably caused the extra growth.",
    skillArea: "induction",
  },
  {
    prompt:
      "A report notes that ice-cream sales and drowning deaths rise in the same months. A careful reader should infer that:",
    options: [
      "Both may be linked to a third factor, such as hot weather.",
      "Eating ice cream causes drowning.",
      "Drowning incidents cause ice-cream sales.",
      "The data must simply be mistaken.",
    ],
    modelAnswer:
      "That both probably rise because of a shared third factor such as hot weather — correlation doesn't mean one causes the other.",
    skillArea: "inference",
  },
];

// ===========================================================================
// Seed expansion — each (instrument, phase) in all three formats
// ===========================================================================

type BaseContent = {
  instrument: Instrument;
  phase: Phase;
  baseTitle: string;
  items: DiagItem[];
};

const BASE_CONTENT: BaseContent[] = PHASE_ORDER.flatMap((phase) => {
  const subjectItems: Record<Phase, DiagItem[]> = {
    before: SUBJECT_BEFORE,
    third: SUBJECT_THIRD,
    twothirds: SUBJECT_TWOTHIRDS,
    after: SUBJECT_AFTER,
  };
  return [
    {
      instrument: "subject" as const,
      phase,
      baseTitle: `Predictive Analytics Check — ${PHASE_LABEL[phase]}`,
      items: subjectItems[phase],
    },
    {
      instrument: "general" as const,
      phase,
      baseTitle: `General Reasoning Check — ${PHASE_LABEL[phase]}`,
      items: GENERAL_BLUEPRINT,
    },
  ];
});

const FORMATS: DiagFormat[] = ["mcq", "hybrid", "written"];

export const DIAGNOSTIC_SEED: DiagnosticSeed[] = BASE_CONTENT.flatMap((base) =>
  FORMATS.map((format) => ({
    instrument: base.instrument,
    phase: base.phase,
    format,
    title: `${base.baseTitle} · ${FORMAT_LABEL[format]}`,
    subtitle: PHASE_LABEL[base.phase],
    instructions: instructionsFor(base.instrument, format),
    items: base.items,
  })),
);
