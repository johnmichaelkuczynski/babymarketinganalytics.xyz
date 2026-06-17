// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Marketing Analytics subject-specific reasoning.
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
      "What marketing analytics is and how it thinks about customers: that you use data about what real customers actually do — what they buy, click, and ignore — to understand them and decide what will make them buy, rather than relying on a hunch about 'what the market wants'; that everyone already markets informally; and that measured evidence about real behavior is more honest than confident opinions. Don't guess what customers want — measure what they do.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what marketing analytics is (measure what customers do, don't guess); segmentation (there is no 'average customer'; split customers into meaningful groups that respond to different messages); and the funnel (the journey from stranger to buyer, the conversion rate at each stage, and finding the leak — the stage losing the most people — instead of just adding more at the top).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: what marketing analytics is, segmentation, and the funnel, PLUS customer lifetime value (a customer is worth their whole relationship, not one sale, which sets how much you can spend to win and keep them), churn (customers leave quietly but their behavior changes first, so you can spot who's at risk and act in time), and A/B testing (settle arguments by showing two versions to randomly split groups and measuring which wins, changing only one thing at a time).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: what marketing analytics is, segmentation, the funnel, customer lifetime value, churn, and A/B testing, PLUS attribution and personalization (which efforts deserve credit for a sale — avoiding the last-click trap — and tailoring to individuals while watching the 'creepiness line') and from insight to campaign (an insight is only useful if it changes a campaign, and you measure whether the campaign actually worked and act with humility by testing and iterating).",
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
      ? "Answer each question about marketing analytics — these reward careful reasoning about realistic customer and marketing situations, not memorized facts"
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
// SUBJECT — Marketing Analytics blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A shop owner is asked why she bothers tracking what customers buy when she's run the store for years and 'just knows' what they want. She would most likely explain that marketing analytics is:",
    options: [
      "using data about what customers actually do to understand them — more honest than relying on gut feeling alone",
      "a guarantee that you'll always know exactly what every customer wants",
      "whatever the owner happens to hope her customers want",
      "the same thing as guessing, just with fancier words",
    ],
    modelAnswer:
      "Marketing analytics uses data about what real customers actually do — what they buy, click, and ignore — to understand them, which is more reliable and honest than relying only on a hunch that memory can distort.",
  },
  {
    prompt:
      "A headline claims 'a confident expert opinion about customers is basically as good as data.' How would someone who understands marketing analytics most likely treat this claim?",
    options: [
      "As an oversimplification, since opinions are often wrong and measured evidence about real behavior is more reliable",
      "As obviously true and needing no evidence",
      "As something that can never be checked at all",
      "As true only when the opinion is about pricing",
    ],
    modelAnswer:
      "It is an oversimplification; in marketing everyone has a confident opinion and opinions are often wrong, so measuring what customers actually do is more trustworthy than even an expert's hunch.",
  },
  {
    prompt:
      "Which question is most central to what marketing analytics actually studies?",
    options: [
      "Who the customer really is and what actually makes them buy, based on what they do",
      "Which company has the friendliest-looking logo",
      "How to design the fanciest office lobby",
      "Which marketer has the most confident voice",
    ],
    modelAnswer:
      "Marketing analytics studies who the customer is and what actually makes them buy, using data about real behavior rather than gut feeling — measuring what customers do instead of guessing what they want.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A streaming service reports that its 'average customer is 35 and watches 4 hours a week,' and plans to design everything for that one person. The main weakness of this plan is:",
    options: [
      "the 'average customer' is usually a myth almost nobody matches, so designing for them can please no one",
      "35-year-olds never watch streaming services at all",
      "averages can never be calculated from customer data",
      "the service should simply copy whatever a competitor does",
    ],
    modelAnswer:
      "If customers are really a mix of very different groups, the 'average' blends them into a middle person who doesn't exist; segmentation into meaningful groups that get different messages serves real customers better than designing for a fictional average.",
    skillArea: "analysis",
  },
  {
    prompt:
      "An online store gets lots of visitors and lots of items added to carts, but very few completed purchases. To fix this, the most useful first step is:",
    options: [
      "find the leak in the funnel — here checkout — and fix that stage, rather than just buying more ads",
      "buy far more ads to pour even more visitors into the top",
      "assume nothing can be done since some drop-off is normal",
      "rename the products to sound more exciting",
    ],
    modelAnswer:
      "The funnel is leaking near the bottom — people reach the cart but abandon at checkout — so the fix is that stage (e.g. surprise costs or forced sign-up), not more top-of-funnel ads, which just pour more people into the same broken step.",
    skillArea: "inference",
  },
  {
    prompt:
      "A marketer wants to write a single email that excites loyal regulars, occasional buyers, and people who haven't purchased in a year, all at once. Why would this be hard to pull off?",
    options: [
      "Different segments respond to different messages, so one message for everyone tends to fit no one well",
      "Email is never an effective way to reach any customer",
      "Loyal customers and lapsed customers are actually identical",
      "Only the number of recipients matters, not what the email says",
    ],
    modelAnswer:
      "Those are distinct segments with different needs — regulars, occasional buyers, and lapsed customers — so a single blended message lands with none of them; segmenting lets you send each group a message that actually fits.",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "A coffee shop refuses to spend more than the $1 profit on one cup to attract a new customer. Using lifetime value, the better way to read this is:",
    options: [
      "A regular is worth their whole relationship — hundreds of dollars over years — so judging them by one cup badly undervalues them",
      "Spending anything to attract customers is always a waste",
      "A single cup's profit is exactly what a customer is worth",
      "The shop should spend as much as it likes with no limit",
    ],
    modelAnswer:
      "Customer lifetime value is the total over the whole relationship, not one sale; a twice-a-week regular is worth far more than $1, so the shop can afford to spend much more than $1 to win a customer who keeps coming back.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A subscription app celebrates record new sign-ups, but its total user count is flat. What's the most sensible thing to suspect?",
    options: [
      "Churn — users are leaving about as fast as new ones arrive, so the bucket never fills",
      "The new sign-ups must all be fake",
      "Flat user counts always mean marketing is working perfectly",
      "Nothing can be learned from sign-up and cancellation numbers",
    ],
    modelAnswer:
      "Flat totals despite record sign-ups point to churn: customers are leaving the back door as fast as new ones come in, like a leaky bucket, and the app should watch behavior for at-risk users and act to keep them.",
    skillArea: "inference",
  },
  {
    prompt:
      "A team can't agree whether a red or green button gets more clicks, so they show red only to loyal regulars and green only to first-time visitors, then declare a winner. What's the most sensible caution?",
    options: [
      "The groups differ, so you can't tell whether the color or the customer type caused the result — split customers at random",
      "Whichever button the manager prefers is the real winner",
      "Button color can never possibly affect clicks",
      "The test is fine because both buttons were shown to someone",
    ],
    modelAnswer:
      "A fair A/B test splits customers at random so the groups are alike except for the one change; splitting by customer type confounds the color with who saw it, so any difference can't be credited to the button — change only one thing and assign at random.",
    skillArea: "analysis",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A company sees customers almost always click a search ad right before buying, so it moves its whole budget to search ads and cuts everything else. Drawing on the unit, the most likely problem is:",
    options: [
      "The last-click trap — earlier touches that first created awareness may have done the real work, so cutting them can starve the journey",
      "Search ads are always useless and should never be funded",
      "Whatever the customer clicks last clearly deserves all the credit",
      "Attribution can never be analyzed at all",
    ],
    modelAnswer:
      "This over-credits the last click; the social post or email that first made the customer aware may have done the real work, so cutting those earlier touches can leave the search ads with far fewer people to convert and overall sales falling.",
    skillArea: "inference",
  },
  {
    prompt:
      "A store discovers it can predict private things about customers from their purchases and starts targeting them on it, and some customers feel watched and unsettled. How should that result be understood?",
    options: [
      "As the 'creepiness line' — personalization can be powerful but tips into harmful when it feels invasive, so marketers must ask not just 'can we?' but 'should we?'",
      "As proof that personalization is always wrong and useless",
      "As irrelevant, since anything you can measure you may freely use",
      "As a sign the customers simply misunderstood the offers",
    ],
    modelAnswer:
      "Personalization is powerful but crosses a line when targeting reveals more than customers shared and makes them feel watched; the responsible question is not just whether you can target precisely but whether you should, and whether the customer would feel served or spied on.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A data team finds that one customer group is drifting toward leaving, writes it in a slide, and moves on. From insight to campaign, the strongest point is that:",
    options: [
      "An insight is only useful if it changes a campaign — they should act on it and then measure whether it worked",
      "Writing the insight in a slide is itself all that's needed",
      "Insights about churn never justify doing anything",
      "The team should always launch the biggest possible campaign instantly",
    ],
    modelAnswer:
      "An insight sitting in a slide changes nothing; this finding matters only if it drives a targeted win-back campaign for that at-risk group, and then they should close the loop by measuring whether it actually kept more customers, ideally against a comparison group.",
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
      baseTitle: `Marketing Analytics Check — ${PHASE_LABEL[phase]}`,
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
