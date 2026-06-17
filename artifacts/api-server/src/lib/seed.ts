import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql, and, like, notInArray } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-17-predictive-analytics-for-children-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Predictive Analytics for Everyone
  {
    slug: "what-predictive-analytics-is",
    title: "What predictive analytics is",
    weekNumber: 1,
    blurb: "Predictive analytics is using patterns in the past to estimate what's likely to happen next — and most of what gut instinct tells you about the future is a myth.",
    lectureTitle: "1.1 What predictive analytics is (using the past to see the future)",
    body: `# What predictive analytics is

Almost everyone tries to guess the future every single day — which line at the store will move faster, whether it's going to rain, how a friend will react to some news. Those guesses come from gut feeling, and gut feeling is powerful but often wrong. **Predictive analytics** is the careful version of that everyday habit: using patterns in past data to estimate what is *likely* to happen next, not by how it feels, but by what the evidence actually shows.

## Using the past to see the future

Every prediction works the same simple way: you look at what has happened before and use it to estimate what comes next. Predictive analytics is the skill of doing that honestly instead of guessing. It turns a pile of past records — sales, weather, traffic, scores — into a careful estimate of what's coming, so you can prepare instead of being surprised. The goal isn't to know the future for certain; it's to be a little less wrong than a gut feeling would be.

## Everyone already predicts

Here's something easy to miss: you already predict all the time. When you grab an umbrella because the sky looks grey, you've made a forecast from past experience. When a shop owner orders extra ice cream before a hot weekend, that's a prediction too. Predictive analytics doesn't invent something brand new — it just makes that ordinary skill more honest by leaning on real records instead of a hunch. Doing it with data is usually fairer and more reliable than trusting whoever feels most confident.

## A prediction is an estimate, not a guarantee

This is the most important idea in the whole course: a prediction is a set of **odds**, not a promise. When a forecast says there's an 80% chance of rain, it is not lying if the day turns out dry — it was always an estimate of what was *likely*, never a guarantee. Good predictors say how *sure* they are, and they expect to be wrong sometimes. The past is a guide to the future, but it is never a promise that tomorrow will copy yesterday.

## The myths about prediction

People believe confident myths about the future: that a winning streak will keep going, that whatever just happened will keep happening, that an expert who sounds certain must be right, that the future is either perfectly knowable or completely random. None of these hold up. A streak can end the moment you bet on it, a confident voice can be confidently wrong, and most of the future sits in between "certain" and "anyone's guess." A big part of this course is **un-learning** those myths and replacing them with honest, careful estimates.

## Why this matters

Getting this right isn't just for scientists with big computers. The same ideas decide whether a family packs for a storm, whether a small shop orders the right amount of food, and whether a hospital has enough staff on a busy night. When people run on myth instead of measurement, real harm follows — wasted money, missed dangers, bad surprises. Making honest predictions is a kind of fairness to everyone who depends on the plan.

## In the real world

The most familiar predictive analytics on earth is the **weather forecast.** Forecasters take huge amounts of past and present data — temperature, wind, pressure — and use it to estimate what the sky will likely do, then tell you the odds: a "70% chance of rain" means that on days that look like this one, it rained about seven times out of ten. Crucially, the forecast is an estimate, not a promise, which is why it can be useful and still be wrong on any single day. That everyday miracle — turning past patterns into honest odds about the future — is exactly what this whole course is about.`,
  },
  {
    slug: "shape-of-data-over-time",
    title: "The shape of data over time",
    weekNumber: 1,
    blurb: "A stream of data over time has three layers — a long-run trend, repeating seasonal patterns, and random noise — and mistaking the noise for a real signal fools almost everyone.",
    lectureTitle: "1.2 The shape of data over time (trend, seasonality, and noise)",
    body: `# The shape of data over time

When you look at a chart of something measured over and over — daily sales, monthly temperatures, weekly visitors — it can look like a jumpy, confusing scribble. One of the most useful ideas in predictive analytics is that almost every such chart is really **three things stacked together**, and once you learn to pull them apart, the future gets much easier to estimate. Those three layers are trend, seasonality, and noise.

## Data tells a story over time

A single number tells you almost nothing; a number measured again and again *over time* tells a story. Did it climb, fall, or hold steady? Does it spike every weekend? Is it just bouncing around for no reason? Reading data over time is the heart of forecasting, because the future is mostly a continuation of the patterns already hiding in the past. The skill is learning which wiggles are meaningful and which are just random.

## Trend: the long-run direction

The **trend** is the slow, overall direction once you ignore the day-to-day bumps — is the line generally heading up, down, or staying flat over months and years? A town's population creeping upward, a phone's battery slowly getting worse, a sport's records inching higher: those are trends. Spotting the trend matters because it's the part of the future you can most reliably lean on. But beware — a short stretch can *look* like a trend when it's really just a lucky run.

## Seasonality: patterns that repeat

**Seasonality** is any pattern that repeats on a regular cycle. Ice cream sells more every summer, stores get busy every December, a café fills up every weekday lunch, traffic jams happen every rush hour. These patterns repeat predictably, so they're a forecaster's best friend: once you know the cycle, you can prepare for it. Confusing a seasonal bump for a permanent change — "sales jumped in December, we're booming!" — is a classic and costly mistake.

## Noise: the random wiggle

**Noise** is the leftover jiggle that nothing can explain — pure randomness. One slightly busier Tuesday, a single rainy day, a customer who happened to wander in. Noise has no pattern and no meaning, which is exactly why it's dangerous: our brains love to invent stories for it. The single most important discipline here is refusing to treat noise as a signal. A good week might be a real improvement, or it might just be noise wearing a costume.

## Why telling them apart matters

The whole game of forecasting is separating the real pattern (trend plus seasonality) from the meaningless wiggle (noise). Mistake noise for a trend and you'll celebrate a fluke and over-order; mistake a real trend for noise and you'll get caught flat-footed by a change you should have seen coming. Almost every forecasting blunder traces back to confusing these three layers — so before predicting anything, a careful person asks: *is this a trend, a season, or just noise?*

## In the real world

Retailers live and die by **seasonality.** Many stores make a huge share of their entire year's sales in the few weeks around the December holidays — so much that the day after American Thanksgiving is nicknamed "Black Friday" because it's said to push stores into the black (into profit) for the year. A shop that mistook that predictable December spike for a permanent new trend would order far too much in January and get burned. Reading the data's real shape — knowing the holiday rush is seasonality, not a forever-trend — is what keeps the shelves stocked correctly all year long.`,
  },
  {
    slug: "regression",
    title: "Regression: the workhorse of prediction",
    weekNumber: 1,
    blurb: "Regression finds the underlying relationship between two things so you can estimate one from the other — it's everywhere, but pushing it past the data you've seen is dangerous.",
    lectureTitle: "1.3 Regression (the workhorse of prediction)",
    body: `# Regression: the workhorse of prediction

If predictive analytics had a single most-used tool, it would be this one. **Regression** is the careful art of finding the relationship between two things — like temperature and ice cream sales — so that, knowing one, you can estimate the other. It sounds fancy, but the idea is simple and it's hiding behind an enormous number of the predictions made in the world every day, which is why it's called the workhorse.

## Finding the relationship between things

Regression starts with a question: when one thing changes, what tends to happen to another? When it's hotter, do more cold drinks sell? When a house is bigger, does it usually cost more? Regression looks at lots of past examples and measures how the two move together, so you can turn "I think they're related" into a usable estimate. It's how you go from "warm days seem busier" to "on a day this warm, we'll probably sell about this much."

## The line of best fit

Picture every past day as a dot on a chart — temperature across the bottom, sales up the side. The dots won't form a perfect line; they'll scatter. Regression draws the single straight line that comes **closest to all the dots at once** — the "line of best fit." That line is your prediction machine: pick tomorrow's expected temperature, slide up to the line, and read off the estimated sales. The line doesn't hit every dot, and it isn't supposed to — it captures the general relationship while ignoring the noise.

## Why it's the workhorse

Regression is everywhere because it's simple, cheap, and easy to explain. It estimates how much a bigger engine changes a car's price, how study time relates to test scores, how rainfall relates to crop size. Anyone can look at the line and roughly understand what it's saying, which matters: a prediction you can explain is one you can question and trust. Fancier methods exist, but this honest workhorse handles a huge share of real predictions perfectly well.

## The extrapolation trap

Here's where regression bites back. The line is only trustworthy *inside the range of data you've actually seen.* Stretching it far beyond that — called **extrapolation** — is dangerous, because there's no guarantee the relationship keeps holding. Watering a plant more makes it grow, but you can't conclude that a flood will make it grow enormously; past a point, the relationship flips. A line built from mild summer days tells you nothing reliable about a record-breaking heatwave. Trusting the line where you have no evidence is one of the most common ways predictions go badly wrong.

## In the real world

The word "regression" itself comes from a real discovery. More than a century ago, a scientist named Francis Galton compared the heights of parents and their grown children and found a clear relationship — taller parents tended to have taller children — that he could draw as a line. But he noticed something surprising: very tall parents usually had children a bit *shorter* than themselves, closer to the average. He called this "regression toward the average," and the prediction method kept the name. That early study — using a relationship in past data to estimate one thing from another — is the same workhorse powering countless predictions today.`,
  },
  {
    slug: "correlation-vs-causation",
    title: "Correlation vs. causation",
    weekNumber: 1,
    blurb: "Two things moving together doesn't prove one causes the other — a hidden third factor often drives both, and this trap fools almost everyone.",
    lectureTitle: "1.4 Correlation vs. causation (the trap that fools everyone)",
    body: `# Correlation vs. causation

This single idea is responsible for more bad predictions and silly conclusions than almost anything else in the field. When two things tend to move together, it's tempting to decide that one must be causing the other. But "moving together" (**correlation**) is not the same as "one makes the other happen" (**causation**), and confusing the two is a trap that fools experts, businesses, and everyday people alike.

## Moving together isn't the same as causing

**Correlation** just means two things tend to rise and fall together, or move in opposite directions. That's a real, useful pattern — it can help you predict. But it says nothing about *why.* Maybe the first thing causes the second, maybe the second causes the first, maybe something else causes both, or maybe it's pure coincidence. Spotting that two things move together is the easy part; figuring out whether one actually drives the other is the hard, important part.

## The hidden third factor

The most common reason two things move together without causing each other is a sneaky **third factor** driving both. The classic example: as ice cream sales go up, so do drownings. Does ice cream cause drowning? Of course not — **hot weather** is the hidden cause. Heat makes people buy more ice cream *and* swim more, so both rise together while neither causes the other. Whenever you see a surprising correlation, the first thing a careful person hunts for is the lurking third factor that explains the whole thing.

## Why this trap fools everyone

This mistake is so common because our brains are story-making machines: we see two things connected and instantly invent a cause. Headlines do it constantly — "people who do X live longer!" — when X might just be something healthy people already tend to do. Acting on a correlation as if it were a cause leads to wasted effort and worthless plans: you change the thing that was never the cause and nothing improves. The discipline is to *resist the satisfying story* until you have real evidence of cause.

## How to test for real causation

So how do you tell? The gold standard is a fair test: change *only* the suspected cause, keep everything else the same, and see if the effect follows — that's why careful experiments split things into groups and compare. If you can't run a test, you at least ask hard questions: could a third factor explain this? Does the cause come *before* the effect? Does the link survive when you account for the obvious other explanations? Until a correlation passes that kind of scrutiny, treat it as a clue, not a conclusion.

## In the real world

A genuinely famous example involves shark attacks and ice cream. In summer, both shark attacks and ice cream sales rise together — a real correlation strong enough that you could almost predict one from the other. But ice cream obviously doesn't summon sharks; the hidden third factor is **hot weather**, which sends more people to the beach (more swimmers near sharks) and more people to the ice cream stand at the same time. Researchers and statistics teachers use this case constantly precisely because it makes the trap so obvious — and reminds everyone that even a strong, reliable correlation can hide the fact that neither thing causes the other.`,
  },
  {
    slug: "forecasting-methods",
    title: "Forecasting methods",
    weekNumber: 1,
    blurb: "Forecasting ranges from a simple moving average to complex machine learning — but fancier isn't automatically better, and a model is only as good as its assumptions.",
    lectureTitle: "1.5 Forecasting methods (from moving averages to machine learning)",
    body: `# Forecasting methods

Once you accept that the future can be estimated from the past, the next question is *how* — what method should you actually use? There's a whole ladder of forecasting methods, from dead-simple tricks you could do on paper to dazzling computer systems. A surprising and important lesson runs through all of them: the fanciest method is not automatically the best one, and the simple methods are often shockingly hard to beat.

## From simple to complex

Forecasting methods sit on a spectrum. At the easy end are simple rules anyone can understand and check by hand. At the hard end are complex computer models that crunch mountains of data in ways no person could follow step by step. Both ends can make good predictions, and both can fail. The skill isn't always reaching for the most powerful tool — it's choosing the method that fits the problem, the data you have, and how much you need to be able to explain it.

## The moving average: smoothing the noise

The friendliest forecasting tool is the **moving average.** Instead of reacting to every jumpy data point, you average the last several values to smooth out the random noise and reveal the underlying pattern. To guess this week's sales, you might just average the last few weeks. It's simple, easy to explain, and it stops you from overreacting to a single weird day. It won't catch sudden changes quickly, but for steady situations it's a humble, reliable workhorse that's genuinely hard to beat.

## Machine learning: the fancy end

At the powerful end is **machine learning** — computer systems that hunt through huge piles of past data and find patterns far too complicated for a person to spot. These can be remarkably accurate, picking up subtle relationships a simple average would miss. But they have a cost: they're often a "black box" you can't easily look inside, so when they're wrong it can be very hard to understand *why.* Power and mystery come together, and that trade-off matters more than beginners expect.

## Fancier isn't automatically better

Here's the lesson that surprises people: a simple method you fully understand often beats a complicated one you can't check. A black box can quietly latch onto a meaningless quirk in the old data and fail badly on new data, and you might never notice until it's too late. A method you can explain is a method you can question, sanity-check, and fix. So the right question isn't "what's the most advanced model?" but "what's the simplest method that does the job well enough that I can still trust and understand it?"

## A model is only as good as its assumptions

Every forecasting method, simple or fancy, rests on a hidden bet: that the future will resemble the past in the ways the method assumes. A model built assuming next year looks like last year will break the moment the world genuinely changes. That's why no model should be trusted blindly — you have to know what it's assuming and ask whether those assumptions still hold. When people say "garbage in, garbage out," this is what they mean: feed a model bad data or bad assumptions, and even the smartest method gives confident nonsense.

## In the real world

Forecasting experts run big public contests where many teams compete to predict the same real data, and the results keep delivering the same humbling surprise: **simple methods often beat the complicated ones.** In famous forecasting competitions, plain approaches like moving averages have repeatedly matched or outperformed far more elaborate, expensive models. The lesson the whole field took from this is exactly this section's point — fancier is not automatically better, a model is only as good as its assumptions, and a simple method you can understand and check is often the wiser choice.`,
  },
  {
    slug: "measuring-forecast-error",
    title: "How good is the forecast?",
    weekNumber: 1,
    blurb: "A forecast is only meaningful if you measure how wrong it was — accuracy is earned by checking predictions against reality, not by sounding confident.",
    lectureTitle: "1.6 How good is the forecast? (measuring error and accuracy)",
    body: `# How good is the forecast?

It's easy to make predictions. The hard, honest part — and the part most people skip — is checking afterward whether the prediction was any good. A forecast that nobody ever scores against reality is worthless, no matter how confident it sounded. This section is about **error**: the gap between what you predicted and what actually happened, and why measuring it is what separates real forecasting from fortune-telling.

## A forecast nobody scores is worthless

There's a comfortable trick people play: make confident predictions, and quietly forget the ones that were wrong. A weather guesser, a stock tipster, or a friend who "called it" can seem brilliant if you only remember the hits. But a prediction you never check is just a story. The whole value of a forecast comes from being held to account afterward — without scoring, you can never tell a genuine skill from a lucky guess or a confident bluff.

## Error: the gap between predicted and actual

**Error** is simply the difference between what you forecast and what really happened. Predicted 100 customers and 120 showed up? That's an error of 20. Measuring error turns a vague feeling of "pretty close" into something concrete you can track and improve. The goal isn't zero error — that's impossible, because noise and uncertainty are real — but smaller, honest error over time. You can't get better at predicting if you never measure how wrong you were.

## Backtesting: checking against reality

A powerful way to test a forecasting method is **backtesting**: take old data, pretend you didn't know the future, make the prediction, then compare it to what actually happened. It's like grading yourself on a test where the answers already exist. Backtesting reveals whether a method really works *before* you bet on it with real stakes. A method that can't predict the past it hasn't peeked at has no business predicting the future.

## Why confident isn't the same as accurate

The most dangerous forecaster is the one who is confident but never checked. Confidence is a feeling; accuracy is a measured track record. They often come apart — the loudest, surest voice is frequently no more accurate than a coin flip, while a careful, humble forecaster who keeps score quietly does better. So when judging any prediction, ignore how sure it sounds and ask the only question that matters: *what's their track record when we actually measured?* Accuracy is earned by being checked, not by being confident.

## In the real world

A researcher named Philip Tetlock spent years doing something most pundits dread: he wrote down thousands of expert predictions about politics and the economy, then waited to **score them against what really happened.** The uncomfortable finding was that many confident, famous experts were barely better than random guessing — and the loudest, most certain voices were often the *least* accurate. But he also found a smaller group of careful, humble forecasters who kept score and genuinely beat the rest. The whole study makes this section's point unforgettable: a forecast means nothing until it's measured, and confidence is no substitute for a checked track record.`,
  },
  {
    slug: "why-forecasts-fail",
    title: "Why forecasts fail",
    weekNumber: 1,
    blurb: "Forecasts fail for real reasons — irreducible uncertainty, rare unforeseeable black swans, and overfitting that memorizes the past and breaks on the future.",
    lectureTitle: "1.7 Why forecasts fail (uncertainty, black swans, and overfitting)",
    body: `# Why forecasts fail

By now you can make a forecast and measure how good it is. But honesty demands the other half of the story: even good forecasts fail, and they fail for understandable reasons. Knowing *why* predictions break is what keeps you humble and stops you from trusting any forecast too much. Three big culprits show up again and again: uncertainty you can't remove, rare shocks nobody saw coming, and a sneaky mistake called overfitting.

## Some uncertainty can't be removed

The first reason is the simplest: parts of the future are just genuinely uncertain, and no amount of data will fix that. A coin flip, the exact moment a customer walks in, which way a close game goes — some things carry real randomness baked in. A good forecast doesn't pretend this away; it gives a range or a probability instead of a single confident number. Expecting any prediction to be exactly right is asking for the impossible, because some uncertainty is **irreducible** — it's a feature of the world, not a flaw in your method.

## Black swans: the events the past never showed

The scariest failures come from **black swans** — rare, enormous events that the past gave no warning about. If something has never happened in your data, no pattern-finder can predict it: a sudden crash, a once-in-a-century storm, a brand-new invention that changes everything. Because predictive analytics learns from the past, it is essentially blind to events the past never contained. The danger isn't just that black swans happen; it's that they're often the events that matter most, and the ones our tidy forecasts most confidently ignore.

## Overfitting: memorizing the past

The third culprit is the subtlest and the most important to understand: **overfitting.** This happens when a model tries *too* hard to match the old data — it memorizes every little wiggle and quirk and bit of random noise, instead of learning the real underlying pattern. Such a model looks amazing on the past it studied, scoring nearly perfectly, then falls apart on new data because it learned the noise, not the signal. It's like a student who memorizes the exact answers to last year's test and then fails this year's, because they never actually learned the subject.

## The more you tune to the past

There's a painful irony here: the harder you tune a model to fit history perfectly, the worse it often does on the future. Past a certain point, every extra bit of fitting is just chasing noise, and chasing noise makes you *less* able to predict what's next. This is why simpler models frequently beat complicated ones — they're less able to overfit. The lesson is to be suspicious of any forecast that fit the past *too* beautifully; near-perfect hindsight is often a warning sign, not a triumph.

## In the real world

The clearest black swan in recent memory is the **2008 housing and banking crash.** For years, complex models predicted that home prices and the banking system were safe, in part because their data showed prices almost always going up — the kind of disaster that was about to happen had essentially never appeared in the records they learned from. The models were also badly overfit to a calm past, so when the rare, huge event arrived, the confident forecasts collapsed all at once. It's a sobering reminder of this whole section: uncertainty is real, the past can't warn you about what it never contained, and a model that fit history too neatly can fail spectacularly on the future.`,
  },
  {
    slug: "prediction-to-decision",
    title: "From prediction to decision (capstone)",
    weekNumber: 1,
    blurb: "A prediction is only useful if it changes a decision — and you must weigh the cost of being wrong in each direction and act with humility.",
    lectureTitle: "1.8 From prediction to decision (Capstone)",
    body: `# From prediction to decision (capstone)

We end on the hardest and most important skill in the whole field: turning a prediction into an actual **decision.** A forecast sitting in a report changes nothing. A family deciding whether to evacuate, a shop deciding how much to order, a doctor deciding whether to run a test — all of them have to move from *estimating* what's likely to *acting* on it. Everything in this course comes together here, including its deepest limits.

## A prediction is only useful if it changes a decision

Here's the blunt truth: if a prediction wouldn't change what you do, it's just trivia. The point of forecasting the weather is to decide whether to bring an umbrella; the point of predicting demand is to decide how much to make. Before investing effort in any prediction, the sharpest question is, *what decision will this change?* A forecast that leads to the same action no matter what it says is a waste of time — useful predictions are the ones that actually tip a real choice one way or the other.

## Weighing the cost of being wrong both ways

A prediction can fail in two opposite directions, and the costs are rarely equal. Predict no storm and one hits — that might be a disaster. Predict a storm and none comes — that's wasted preparation, but usually far cheaper. A smart decision-maker doesn't just ask "what's most likely?"; they ask "what does each kind of mistake *cost* me?" Sometimes you act against the most likely outcome on purpose, because being wrong the other way would be catastrophic. Buying insurance against an unlikely fire is exactly this logic: the unlikely outcome is the unaffordable one.

## Act with humility: size the bet to your confidence

Because every prediction is an estimate, you should act in proportion to how *sure* you are. A confident, well-checked forecast can justify a bold move; a shaky one calls for a small, cautious step you can reverse. This is "sizing the bet to your confidence" — never staking everything on a single uncertain guess. Humble decision-makers leave themselves room to be wrong: they hedge, they keep options open, and they avoid the overconfident leap that a single tidy forecast can tempt them into.

## Tying the course together

Look back and one thread runs through all eight topics: **the past is a guide, not a guarantee.** A prediction is only odds, not a promise; data over time hides random noise that fools us; a relationship like regression breaks when pushed too far; correlation isn't causation; the fanciest method isn't always best; a forecast means nothing until it's scored; uncertainty, black swans, and overfitting make failure normal. Predictive analytics replaces overconfident gut feeling with careful, honest, humble estimation — harder than a tidy story, but the only kind that survives contact with reality.

## The biggest questions stay open

And plenty stays unsettled. How much should we trust a prediction we can't fully explain? When does relying on forecasts make us blind to the rare events that matter most? How do we keep our models from quietly steering us toward decisions that look smart on paper but ignore human judgment? Predictive analytics gives us better questions and more honest odds — not certainty. The most useful habit to carry out of this course is simple: whenever a forecast tells a clean, confident story about the future, ask, "Is that real, or am I trusting the past to be a promise?"

## In the real world

When a hurricane approaches, forecasters publish a "cone of uncertainty" — not a single line, but a range of where the storm might go, because the future is genuinely uncertain. Officials then have to turn that probability into a hard decision: order an evacuation or not. Both mistakes are costly — evacuate needlessly and you waste enormous money and trust; fail to evacuate and people can die — and the costs aren't equal, so leaders often act against the single most likely path because being wrong the deadly way is unthinkable. That marriage of an honest, humble prediction and a courageous human decision, made while weighing the cost of each error, is exactly where this whole course has been heading.`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  {
    kind: "homework",
    title: "Homework 1.1 — Patterns, trends, regression, and correlation",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-predictive-analytics-is",
        prompt:
          "A friend says, 'The forecast said 80% chance of rain and it stayed dry all day — so the forecast was just wrong and predictions are useless.' Use what predictive analytics actually is to explain why your friend is misunderstanding what a prediction means. (3–5 sentences.)",
        correctAnswer:
          "A prediction is an estimate of what's likely — a set of odds — not a guarantee about a single day. An 80% chance of rain means that on days that look like this one, it rains about eight times out of ten, so a dry day is exactly one of the two-in-ten times the forecast already accounted for. That doesn't make the forecast useless; it was honestly reporting the odds based on patterns in past data, and being wrong on one day is built into what 'likely' means. My friend is treating an estimate as if it were a promise, which is the very myth predictive analytics is meant to replace with honest odds.",
        explanation:
          "Full credit: explains a prediction is an estimate/odds not a guarantee, interprets the 80% correctly (a dry day is within the expected 20%), and notes that being wrong on a single day doesn't make a probabilistic forecast useless.",
      },
      {
        topicSlug: "shape-of-data-over-time",
        prompt:
          "An online store sees a big jump in sales every December and the owner excitedly says, 'We've found a permanent new growth trend — let's order huge amounts for January!' Using the idea of trend, seasonality, and noise, explain what the owner is getting wrong. (3–5 sentences.)",
        correctAnswer:
          "Data over time usually has three layers: a long-run trend, repeating seasonal patterns, and random noise, and the owner is confusing seasonality with a trend. A jump that happens every December is almost certainly the holiday season — a pattern that repeats on a cycle — not a permanent change in the store's overall direction. Treating that predictable seasonal spike as a new trend would lead to massively over-ordering for January, when the seasonal bump has already passed. The careful move is to compare December to previous Decembers, separate the repeating seasonal pattern from the real underlying trend, and not mistake a known cycle for forever-growth.",
        explanation:
          "Full credit: names the three layers (trend/seasonality/noise), identifies the December jump as seasonality not a trend, and explains why mistaking it for a permanent trend leads to over-ordering; may note comparing to prior years.",
        hint: "Is a spike that happens at the same time every year a permanent change of direction, or a pattern that repeats on a cycle?",
      },
      {
        topicSlug: "regression",
        prompt:
          "A lemonade stand finds that warmer days bring more sales, and on mild summer days a simple line predicts sales nicely. The owner says, 'So on the hottest day ever recorded, this line says we'll sell a gigantic amount — let's make ten times our usual batch.' Using regression, explain two things this reasoning gets wrong. (3–5 sentences.)",
        correctAnswer:
          "Regression finds the relationship (a line of best fit) between two things, like temperature and sales, so you can estimate one from the other — but that line is only trustworthy inside the range of data you've actually seen. First, a record-breaking temperature is far outside the mild days the line was built from, so stretching it that far (extrapolation) is unreliable; the relationship may not hold or could even flip, since brutal heat might keep customers inside instead. Second, the line captures a general relationship, not a guarantee, so it shouldn't be used to justify a drastic ten-times bet. The owner should treat the prediction cautiously, gather data closer to that extreme, and not assume the line keeps going straight forever.",
        explanation:
          "Full credit: explains regression/line of best fit, identifies extrapolation (using the line far beyond observed data) as the danger, and notes the relationship may not hold at extremes; may add that the line is a general estimate not a guarantee.",
      },
      {
        topicSlug: "correlation-vs-causation",
        prompt:
          "A blogger notices that towns with more ice cream shops also have more drownings each year, and concludes, 'Ice cream is dangerous — it must be causing people to drown.' Explain the mistake using correlation versus causation. (3–5 sentences.)",
        correctAnswer:
          "The blogger has confused correlation (two things moving together) with causation (one actually causing the other). Ice cream sales and drownings do rise together, but neither causes the other — there's a hidden third factor, hot weather, that drives both: heat makes people buy more ice cream and also makes more people swim, where drownings happen. So the real cause is the lurking variable, not the ice cream, and banning ice cream would do nothing to reduce drownings. Whenever two things move together, the careful step is to hunt for a third factor that could explain both before claiming one causes the other.",
        explanation:
          "Full credit: distinguishes correlation from causation, identifies the hidden third factor (hot weather) driving both, and explains that acting on the false cause (banning ice cream) wouldn't help; may state the general lesson to look for lurking variables.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Forecasting, error, failure, and decisions",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "forecasting-methods",
        prompt:
          "A company replaces its simple, easy-to-understand forecasting method with an expensive new computer model that nobody on the team can explain, just because it's more advanced. Explain why 'fancier' isn't automatically better here. (3–5 sentences.)",
        correctAnswer:
          "Forecasting methods range from simple ones you can check by hand to complex machine-learning models, and fancier is not automatically more reliable. A model nobody can explain is a 'black box,' so when it makes a strange prediction the team can't tell whether it found a real pattern or latched onto meaningless noise. A simple method you understand can be questioned, sanity-checked, and fixed, which often makes it more trustworthy than a powerful one you can't see inside. Every model is also only as good as its assumptions, so the right question isn't 'what's most advanced?' but 'what's the simplest method that does the job well and that we can still understand and trust?'",
        explanation:
          "Full credit: explains fancier isn't automatically better, that an unexplainable black box can't be sanity-checked, that a simple understandable method can be questioned/trusted, and/or that a model is only as good as its assumptions.",
        hint: "Think about what happens when the fancy model makes a weird prediction and no one can look inside to see why.",
      },
      {
        topicSlug: "measuring-forecast-error",
        prompt:
          "A TV pundit reminds everyone of the three predictions he got right last year and insists he's a brilliant forecaster, but he never mentions the predictions he got wrong. Explain why this isn't good evidence he's accurate, using the idea of measuring forecast error. (3–5 sentences.)",
        correctAnswer:
          "A forecast only means something if it's scored against what actually happened, and the pundit is only counting his hits while quietly forgetting his misses. Without measuring his error across all his predictions, there's no way to tell genuine skill from luck or from confident bluffing — anyone looks brilliant if you only remember the times they were right. Real accuracy is a measured track record, not a feeling of confidence, so we'd need to see how often he was wrong, not just a hand-picked few he got right. Until his predictions are honestly scored as a whole, his confidence is no evidence at all that he's actually accurate.",
        explanation:
          "Full credit: explains a forecast must be scored against reality, that cherry-picking hits hides error and can't separate skill from luck, and that accuracy is a measured track record rather than confidence.",
      },
      {
        topicSlug: "why-forecasts-fail",
        prompt:
          "A data team builds a model that predicted last year's sales almost perfectly — it matched nearly every single day. They're sure it will nail next year too. Using the idea of overfitting, explain why their confidence might be misplaced. (3–5 sentences.)",
        correctAnswer:
          "A model that matches nearly every past day almost perfectly is a warning sign of overfitting, not a triumph. Overfitting happens when a model memorizes the random noise and quirks of the old data instead of learning the real underlying pattern, so it looks amazing on the past it studied but falls apart on new data. It's like a student who memorized the exact answers to last year's test and then fails this year's because they never learned the subject. The team should be suspicious precisely because the fit was too perfect, and they should test the model on data it hasn't seen before trusting it with next year.",
        explanation:
          "Full credit: explains overfitting (memorizing noise/quirks rather than the real pattern), why a near-perfect fit to the past is a warning sign, and that such a model often fails on new data; may suggest testing on unseen data.",
      },
      {
        topicSlug: "prediction-to-decision",
        prompt:
          "A town's forecasters say there's a real but uncertain chance a major storm will hit this weekend. One official says, 'It's not the single most likely outcome, so we shouldn't bother preparing at all.' Explain why this reasoning is dangerous, using the idea of turning a prediction into a decision. (3–5 sentences.)",
        correctAnswer:
          "A prediction is only useful when it changes a decision, and a good decision weighs not just what's most likely but what each kind of mistake would cost. Even if the storm isn't the single most likely outcome, the cost of being unprepared when it does hit — danger to people and property — is far worse than the cost of preparing for a storm that doesn't come. Because the two errors are so unequal, it can be wise to act against the most likely outcome and prepare anyway, sizing the response to both the odds and the stakes. Doing nothing just because the storm isn't most likely ignores the whole point of acting humbly on uncertain predictions.",
        explanation:
          "Full credit: explains a prediction should drive a decision, that you must weigh the cost of being wrong in each direction (the unequal costs), and that it can be right to prepare even against the most likely outcome when one error is far more dangerous.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Predictive Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-predictive-analytics-is",
        prompt:
          "Explain what predictive analytics is, why it's fair to say 'everyone already predicts,' and why a prediction should be understood as a set of odds rather than a guarantee. Why does keeping that distinction matter? (4–6 sentences.)",
        correctAnswer:
          "Predictive analytics is the careful practice of using patterns in past data to estimate what's likely to happen next, instead of relying on gut feeling. It's fair to say everyone already predicts because we all forecast informally every day — grabbing an umbrella when the sky looks grey, or expecting a shop to be busy on a hot weekend — and predictive analytics just makes that habit more honest by leaning on real records rather than a hunch. A prediction should be understood as a set of odds, not a guarantee, because it's an estimate about a future that hasn't happened yet; an 80% chance of rain isn't wrong when the day turns out dry, since it only ever claimed what was likely. Keeping that distinction matters because treating an estimate as a promise leads to overconfidence and nasty surprises, while remembering that the past is a guide and not a guarantee keeps you appropriately humble. That honesty about uncertainty is the foundation the whole course is built on.",
        explanation:
          "Full credit: defines predictive analytics as using past patterns to estimate the likely future, explains everyone predicts informally and data makes it more honest, frames a prediction as odds not a guarantee (with correct intuition), and why that distinction supports humility/good decisions.",
      },
      {
        topicSlug: "shape-of-data-over-time",
        prompt:
          "Describe the three layers in data measured over time — trend, seasonality, and noise — and explain why telling them apart is the heart of good forecasting. (4–6 sentences.)",
        correctAnswer:
          "Data measured over time is usually three things stacked together. The trend is the slow overall direction once you ignore the day-to-day bumps — whether something is generally rising, falling, or holding steady over the long run. Seasonality is any pattern that repeats on a regular cycle, like more ice cream sold every summer or stores busier every December. Noise is the leftover random wiggle that has no pattern and no meaning, like one slightly busier Tuesday. Telling them apart is the heart of forecasting because the real, predictable future lives in the trend and seasonality, while noise is meaningless — mistake noise for a trend and you'll celebrate a fluke and over-prepare, while mistaking a real change for noise leaves you caught off guard. So before predicting anything, a careful person asks whether what they're seeing is a trend, a season, or just noise.",
        explanation:
          "Full credit: defines trend (long-run direction), seasonality (repeating cycle), and noise (meaningless randomness) with examples, and explains that separating the real pattern from noise is what prevents both over-reacting to flukes and missing real changes.",
      },
      {
        topicSlug: "regression",
        prompt:
          "Explain what regression does, what the 'line of best fit' is, why regression is called the workhorse of prediction, and why extrapolating beyond your data is dangerous. (4–6 sentences.)",
        correctAnswer:
          "Regression finds the relationship between two things — like temperature and sales — by looking at many past examples so you can estimate one from the other. The 'line of best fit' is the single straight line drawn as close as possible to all the scattered data points at once; it doesn't touch every point, and isn't supposed to, because it captures the general relationship while ignoring the noise. Regression is called the workhorse because it's simple, cheap, easy to explain, and hiding behind an enormous share of everyday predictions, from house prices to crop sizes. The danger is extrapolation — stretching the line far beyond the range of data you've actually seen — because there's no guarantee the relationship keeps holding out there, and it can even flip, the way more water helps a plant grow but a flood doesn't. So the line is trustworthy inside the data you have and unreliable past it, which is one of the most common ways predictions go wrong.",
        explanation:
          "Full credit: explains regression finds a relationship to estimate one thing from another, describes the line of best fit (closest to all points, ignores noise), notes why it's the workhorse (simple/explainable/everywhere), and explains extrapolation beyond observed data is unreliable.",
      },
      {
        topicSlug: "correlation-vs-causation",
        prompt:
          "Explain the difference between correlation and causation, why a hidden third factor is so often the real explanation, and why this trap fools almost everyone. Use an example. (4–6 sentences.)",
        correctAnswer:
          "Correlation means two things tend to move together, while causation means one actually makes the other happen — and correlation does not prove causation. A correlation can be real and useful for prediction yet say nothing about why, because the link might run the other way, be a coincidence, or be driven by something else entirely. Very often the real explanation is a hidden third factor that drives both: ice cream sales and drownings rise together not because ice cream is dangerous, but because hot weather makes people both buy ice cream and swim. This trap fools almost everyone because our brains are story-making machines that instantly invent a cause whenever they see two things connected, which is why headlines constantly claim one thing causes another. The discipline is to resist the satisfying story, hunt for a lurking third factor, and treat a correlation as a clue rather than a conclusion until it's actually tested.",
        explanation:
          "Full credit: distinguishes correlation (moving together) from causation (one causes the other), explains the hidden third factor with an example (e.g. hot weather behind ice cream and drownings), and why the trap is so common (brains invent causes); may note treating correlation as a clue, not proof.",
      },
      {
        topicSlug: "forecasting-methods",
        prompt:
          "Describe the range of forecasting methods from a simple moving average to machine learning, explain why fancier isn't automatically better, and what it means that 'a model is only as good as its assumptions.' (4–6 sentences.)",
        correctAnswer:
          "Forecasting methods sit on a spectrum from very simple to very complex. At the easy end is the moving average, which smooths out random noise by averaging the last several values to reveal the underlying pattern — humble, easy to explain, and hard to beat for steady situations. At the powerful end is machine learning, where computers hunt through huge piles of data for subtle patterns no person could spot, often very accurately but as a 'black box' you can't easily look inside. Fancier isn't automatically better because a method you can't explain can quietly latch onto meaningless noise and fail on new data without you noticing, while a simple method you understand can be questioned, checked, and fixed. And every method, simple or fancy, rests on the bet that the future will resemble the past in the ways it assumes, so 'a model is only as good as its assumptions' — feed it bad data or wrong assumptions and even a brilliant method gives confident nonsense. The right question is the simplest method that does the job while staying understandable and trustworthy.",
        explanation:
          "Full credit: describes the moving average (smoothing noise) and machine learning (powerful but black box), explains fancier isn't automatically better (unexplainable models can overfit/fail unnoticed vs simple checkable ones), and explains a model depends on its assumptions/data.",
      },
      {
        topicSlug: "measuring-forecast-error",
        prompt:
          "Explain why a forecast nobody scores is worthless, what 'error' and 'backtesting' mean, and why being confident is not the same as being accurate. (4–6 sentences.)",
        correctAnswer:
          "A forecast nobody checks against reality is worthless because, without scoring, you can never tell genuine skill from a lucky guess or a confident bluff — people who only remember their hits can seem brilliant while being no better than chance. Error is simply the gap between what you predicted and what actually happened, like forecasting 100 customers when 120 show up; measuring it turns a vague 'pretty close' into something concrete you can track and improve. Backtesting is testing a method on old data by pretending you didn't know the future, making the prediction, and comparing it to what really happened — a way to see if a method works before betting real stakes on it. Confidence is just a feeling, while accuracy is a measured track record, and the two often come apart: the loudest, surest voice is frequently no more accurate than a coin flip. So when judging any forecast, ignore how sure it sounds and ask what its track record was when someone actually measured.",
        explanation:
          "Full credit: explains an unscored forecast can't separate skill from luck, defines error (gap between predicted and actual) and backtesting (testing on past data as if blind), and distinguishes confidence (a feeling) from accuracy (a measured track record).",
      },
      {
        topicSlug: "why-forecasts-fail",
        prompt:
          "Explain three reasons forecasts fail — irreducible uncertainty, black swans, and overfitting — and why a model that fit the past too perfectly should make you suspicious. (4–6 sentences.)",
        correctAnswer:
          "Forecasts fail first because of irreducible uncertainty: parts of the future carry real randomness that no amount of data can remove, so a good forecast gives a range or probability rather than a single confident number. They fail second because of black swans — rare, enormous events the past gave no warning about, like a sudden crash or a once-in-a-century storm; since predictive analytics learns from history, it's essentially blind to events that history never contained, and those are often the events that matter most. They fail third because of overfitting, where a model tries so hard to match old data that it memorizes the random noise instead of the real pattern, looking perfect on the past it studied and then collapsing on new data — like a student who memorized last year's test answers and fails this year's. A model that fit the past almost perfectly should make you suspicious precisely because near-perfect hindsight usually means it learned the noise, and the harder you tune a model to fit history, the worse it often does on the future. That's why simpler models, which can't overfit as easily, frequently beat complex ones.",
        explanation:
          "Full credit: explains irreducible uncertainty (some randomness can't be removed), black swans (rare unforeseeable events the past never showed), and overfitting (memorizing noise, failing on new data), and why a too-perfect fit to the past is a warning sign.",
      },
      {
        topicSlug: "prediction-to-decision",
        prompt:
          "Explain why a prediction is only useful if it changes a decision, why you must weigh the cost of being wrong in each direction, and what it means to act with humility by sizing the bet to your confidence. (4–6 sentences.)",
        correctAnswer:
          "A prediction is only useful if it changes a decision, because a forecast that leads to the same action no matter what it says is just trivia — the point of predicting rain is to decide whether to bring an umbrella. A good decision-maker doesn't only ask 'what's most likely?' but also 'what does each kind of mistake cost me?', since the two errors are rarely equal: failing to prepare for a storm that hits can be a disaster, while preparing for one that doesn't come is merely wasted effort. Because of that, it's sometimes wise to act against the most likely outcome on purpose, the way buying insurance guards against an unlikely but unaffordable loss. Acting with humility means sizing the bet to your confidence — a well-checked, confident forecast can justify a bold move, while a shaky one calls for a small, cautious, reversible step. Underneath it all runs the course's thread: the past is a guide, not a guarantee, so you leave yourself room to be wrong.",
        explanation:
          "Full credit: explains a prediction must change a decision to be useful, that you weigh the unequal costs of each kind of error (not just likelihood), and that acting with humility means matching the size of the action to your confidence; may cite 'past is a guide not a guarantee.'",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Predictive Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "prediction-to-decision",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'the past is a guide, not a guarantee' — runs through predictive analytics. Show how it applies to at least three different topics (for example: a prediction as odds, noise vs. a real trend, extrapolating a regression line, correlation vs. causation, trusting a fancy model, scoring forecasts, black swans, or overfitting). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is that the past is a guide to the future, not a guarantee, which is why every prediction should be treated as honest odds rather than a promise — an 80% chance of rain isn't wrong on a dry day. The same humility shows up in reading data over time, where a single good week might be meaningless noise rather than a real trend, so you shouldn't bet the future on it. It appears again in regression, where a line of best fit is trustworthy only inside the data you've seen and dangerous when extrapolated to extremes the past never contained. It explains why correlation isn't causation: two things moving together in past data doesn't promise that changing one will change the other, because a hidden third factor may drive both. The habit also warns against trusting a fancy model that fit history too perfectly, since that's usually overfitting — memorizing noise — and it reminds us that black swans are exactly the huge events the past never showed. Across all of it, predictive analytics replaces overconfident gut feeling with careful, humble estimation, which is harder than believing a tidy story but far more honest about a future that was never promised to copy the past.",
        explanation:
          "Full credit: states the unifying habit (the past is a guide, not a guarantee / resist overconfident stories about the future) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "shape-of-data-over-time",
        prompt:
          "Someone insists, 'Our numbers went up three weeks in a row — that's obviously a real upward trend, so we should bet big on it continuing.' Using ideas from the course, argue why a business's real pattern is better understood by separating trend, seasonality, and noise. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'three weeks up means a real trend' view assumes every movement is meaningful, but data measured over time is really three layers stacked together: a long-run trend, repeating seasonal patterns, and random noise. Three good weeks could easily be noise — the meaningless wiggle that our story-making brains love to mistake for a signal — or it could be a seasonal bump that happens at this time every year, neither of which promises the rise will continue. For example, an online store that sells more every December is seeing seasonality, not a permanent new trend, and betting big in January on that 'growth' would mean badly over-ordering once the predictable holiday spike passes. To tell which layer you're looking at, you compare against a longer history and against the same period in past years, instead of reacting to a short run. The danger of confusing noise or seasonality with a trend is celebrating a fluke and preparing for growth that was never real. So the honest move is to separate the real, repeatable pattern from the random jiggle before placing any big bet, because a short streak is a guide at best, not a guarantee.",
        explanation:
          "Full credit: rejects the 'short streak = trend' view, explains the three layers (trend/seasonality/noise) and that a short run could be noise or seasonality, supports it with a concrete example (e.g. December holiday spike), and notes comparing to longer/prior-year history.",
      },
      {
        topicSlug: "correlation-vs-causation",
        prompt:
          "A company finds that customers who use a certain feature spend far more money, and an executive declares, 'The feature obviously causes people to spend more — let's force it on everyone.' Using the course, argue why this could be a costly mistake and what they should check first. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "The executive has jumped from correlation to causation: the fact that feature-users spend more only means the two move together, not that the feature makes people spend. A hidden third factor could easily explain both — for instance, the company's most enthusiastic, loyal customers might be the kind of people who both try every feature and spend a lot anyway, so the feature is a marker of big spenders, not the cause of their spending. If that's true, forcing the feature on everyone would change the thing that was never the cause, and spending wouldn't rise — wasting effort and possibly annoying customers who didn't want it. The same trap fools people constantly because our brains invent a cause the moment they see two things linked, the way some once blamed ice cream for drownings when hot weather drove both. Before acting, they should run a fair test: give the feature to a randomly chosen group and withhold it from a similar group, then compare spending, so any difference can't be explained by what kind of person already chose it. Only if spending genuinely rises in the test group is there real evidence of cause. Until then, the correlation is a clue worth investigating, not a conclusion worth betting the business on.",
        explanation:
          "Full credit: rejects the correlation-equals-causation leap, explains a hidden third factor (e.g. loyal big spenders self-select into the feature), warns acting on a false cause wastes effort, and says to test it fairly (a randomized comparison) before concluding; may give a classic example.",
      },
      {
        topicSlug: "measuring-forecast-error",
        prompt:
          "A forecaster boasts, 'My model is incredible — it matched last year's sales almost perfectly, so trust it completely for next year.' Using the course, explain why a near-perfect fit to the past is not proof the model will work, and what they should actually do to judge it. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "A model that matched last year almost perfectly is a warning sign, not proof, because of overfitting: when a model tries too hard to match old data, it memorizes the random noise and quirks instead of the real underlying pattern, so it looks flawless on the past it studied and then falls apart on new data. It's like a student who memorized the exact answers to last year's test and aces it but fails this year's, because they never actually learned the subject. A forecast also means nothing until it's scored against reality, so a boast about hindsight isn't the same as a measured track record on data the model hasn't seen. To judge it honestly they should backtest properly — hide some data, have the model predict it as if blind, and measure the error between its predictions and what really happened — and ideally test it on a fresh period entirely. They should also be more impressed by a humble model with consistent, checked accuracy than by one that fit history too beautifully. The deeper lesson is that the past is a guide, not a guarantee, so a perfect fit to yesterday earns suspicion, not blind trust, until the model proves itself on tomorrow.",
        explanation:
          "Full credit: explains overfitting (memorizing noise, near-perfect past fit as a warning sign), that a forecast must be scored on unseen data not just hindsight, and what to do (backtest on hidden/fresh data, measure error) before trusting it; may support with a concrete example.",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about predictive analytics cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete prediction and forecasting situations.",
    lectureTitle: "Primer: How to reason about predictive analytics cases",
    body: `# How to reason about predictive analytics cases

This short primer prepares you for the **Predictive Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a forecast treated as a promise, a good week mistaken for a real trend, a correlation read as a cause, a model that fit the past too perfectly — and asks what the course's ideas tell you about it. Knowing the words "regression" or "overfitting" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why a prediction is odds not a guarantee, how to separate trend, seasonality, and noise, when extrapolating a regression line is dangerous, why correlation isn't causation, why a simple method can beat a fancy one, why a forecast must be scored, and what makes forecasts fail.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the overconfident reading** — the course estimates what's really likely; it does not assume the tidiest or most flattering story about the future. The best answers stay grounded in the data and the odds, not in how confident a forecast sounds.

## How to do this activity well

1. **Read the situation first**, then ask which topic it belongs to.
2. **Find the detail that decides it** — what in the scene makes one answer better than another.
3. For written items, **give the core idea in a sentence or two** — clear and correct beats long and padded.

Take it as often as you like; the questions are freshly generated every time, and there is no penalty for any answer.`,
  },
  {
    slug: "reasoning-primer-general",
    title: "Core reasoning skills",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core reasoning skills",
    body: `# Core reasoning skills

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about what the numbers are telling you.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful work with data demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

## How to do this activity well

1. Find the **point** (conclusion) first, then the reasons.
2. Ask which of the five skills the question is testing (a hidden-assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Pick the option that follows **only** from what you were given — not the one that merely sounds true or appealing.

Take it as often as you like; the questions are freshly generated every time, and it never affects your grade.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  const currentSlugs = REASONING_PRIMERS.map((p) => p.slug);
  // Remove any obsolete primer topics from earlier diagnostic models (their
  // lectures cascade-delete), so renamed/retired primers self-heal instead of
  // stranding stale content in existing or republished databases.
  const stale = await db
    .delete(topicsTable)
    .where(
      and(
        like(topicsTable.slug, "reasoning-primer-%"),
        notInArray(topicsTable.slug, currentSlugs),
      ),
    )
    .returning({ slug: topicsTable.slug });
  if (stale.length > 0) {
    logger.info(
      { removed: stale.map((s) => s.slug) },
      "Reasoning primers: removed obsolete primers",
    );
  }
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated to the Predictive Analytics for Children syllabus.
  // Detect the marker topic; if present and the content version matches, the
  // content is current and we skip. This makes the seed self-healing across
  // environments: a database that still holds older content (e.g. a previous
  // curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-predictive-analytics-is"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (markerTopic.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: course content present and current, skipping");
    return;
  }
  if (markerTopic.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: course content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No current content. Either the database is empty (fresh) or it still holds
  // an older curriculum. Do the (optional) wipe and the full reseed in a SINGLE
  // transaction so the marker topic only ever becomes visible once the entire
  // curriculum has committed. A crash mid-seed rolls back, so the next boot
  // retries instead of leaving partial content that the marker check would
  // wrongly treat as healthy. TRUNCATE also takes an ACCESS EXCLUSIVE lock, so
  // concurrent readers never observe a half-empty course during the replace
  // window. The diagnostic tables are truncated here too so the (non
  // version-gated) diagnostic seed repopulates them with the current content on
  // the same boot.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale course content detected — replacing with the Predictive Analytics for Children curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics, diagnostic_responses, diagnostic_attempts, diagnostic_items, diagnostic_assessments RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}
