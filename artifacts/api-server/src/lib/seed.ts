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
const SEED_CONTENT_VERSION = "2026-06-17-marketing-analytics-v1";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Marketing Analytics for Everyone
  {
    slug: "what-marketing-analytics-is",
    title: "What marketing analytics is",
    weekNumber: 1,
    blurb: "Marketing analytics is using data about real customers to understand who they are and what makes them buy — replacing 'what we think the market wants' with what the evidence actually shows.",
    lectureTitle: "1.1 What marketing analytics is (knowing the customer through data)",
    body: `# What marketing analytics is

Almost every business spends money trying to win customers — an ad here, a discount there, a fresh sign in the window — and most of it is based on a hunch about "what people want." Hunches are powerful, but they're often wrong, and wrong hunches cost real money. **Marketing analytics** is the careful version of that everyday habit: using data about real customers to understand who they are, what they do, and what actually makes them buy — not by how it feels, but by what the evidence shows.

## Knowing the customer through data

Every business is really trying to answer one question: *who is my customer, and what will make them say yes?* Marketing analytics answers it by looking at what customers actually do — what they click, buy, return, and ignore — instead of guessing. It turns a pile of ordinary records — sales receipts, sign-ups, website visits — into a clear picture of real people, so you can serve them better instead of shouting into the dark. The goal isn't to read minds; it's to be a lot less wrong than a gut feeling would be.

## Everyone already does marketing

Here's something easy to miss: you already think like a marketer all the time. When a friend reminds you about a sale they know you'll love, that's targeting. When a shop owner remembers a regular's usual order, that's using customer data. Marketing analytics doesn't invent something brand new — it just makes that ordinary skill more honest and more reliable by leaning on real records instead of memory and hope. Doing it with data is usually fairer and far more dependable than trusting whoever in the room sounds most confident.

## Opinions are cheap; evidence is not

This is one of the most important ideas in the whole course: in marketing, *everyone has an opinion, and opinions are usually free and usually wrong.* The boss likes the blue logo, the designer prefers the green one, and both can argue forever. Marketing analytics steps in and asks a different question — not "which do we *like*?" but "which one actually makes more people buy?" Replacing confident opinions with measured evidence is the single biggest thing that separates modern marketing from guesswork.

## The myths about customers

People believe confident myths about customers: that "everybody" is their customer, that customers buy for the reasons they *say* they do, that one loud complaint speaks for thousands, that a good month means you've cracked the code forever. None of these hold up. Most products are for a specific kind of person, what people say and what they do often differ, and a single month can be luck. A big part of this course is **un-learning** those myths and replacing them with an honest look at what customers actually do.

## It's about people, not just numbers

It's easy to think analytics turns customers into cold numbers, but the opposite is true when it's done well. Behind every data point is a real person making a real choice — to click, to buy, to walk away. Good marketing analytics uses the numbers to *understand* people more clearly and treat them more fairly, not to manipulate them. When it's done badly, it feels creepy and pushy; when it's done well, customers feel understood, and the business stops wasting their time and its own money.

## In the real world

The most famous example of a company learning its customers through data is the **supermarket loyalty card.** When a grocery chain gives you a little card that saves you a few cents, it isn't being generous for free — in return it records exactly what you buy, how often, and when. One British grocer used the mountains of data from its loyalty card to discover who its customers really were and what each kind of shopper wanted, and used that to send the right offers to the right people. It quietly became one of the most successful marketing moves in retail history. That everyday card — turning ordinary purchases into a real understanding of real customers — is exactly what this whole course is about.`,
  },
  {
    slug: "segmentation",
    title: "Segmentation: why the average customer doesn't exist",
    weekNumber: 1,
    blurb: "Customers aren't one big blob and 'the average customer' is a myth — segmentation splits them into meaningful groups so you can speak to each one instead of to no one.",
    lectureTitle: "1.2 Segmentation (why 'the average customer' doesn't exist)",
    body: `# Segmentation: why the average customer doesn't exist

When a business pictures "the customer," it usually imagines one made-up average person and tries to please them. That feels efficient, but it's a trap, because the average customer is a fiction — almost nobody actually matches them. One of the most useful ideas in marketing analytics is **segmentation**: instead of treating everyone as one blurry blob, you split customers into meaningful groups, so you can finally speak to real people instead of to an average that doesn't exist.

## The average customer is a myth

If half your customers are teenagers and half are retirees, the "average customer" is middle-aged — and you'd be designing for someone who isn't there at all. Averages hide the very differences that matter. A clothing store whose customers are split between budget shoppers and luxury buyers learns nothing from "the average customer spends a medium amount." The truth lives in the groups, not in the blended-together middle, and chasing the average usually means pleasing no one.

## What segmentation is

**Segmentation** is dividing your customers into groups whose members are alike in some way that matters for marketing. The point is that people inside a group will tend to respond to the same message, while people in different groups need different ones. Good segments are big enough to be worth the effort, different enough from each other to deserve separate treatment, and based on something you can actually act on. Done right, segmentation turns one impossible question — "what does everyone want?" — into several answerable ones.

## Ways to slice your customers

There are many ways to cut customers into groups, and the best one depends on your goal. You can slice by **who they are** (age, location, income), by **what they do** (how often they buy, how much they spend, what they browse), or by **what they need** (the job they're hiring your product to do). Behavior is often the most powerful, because what people *do* predicts what they'll do next far better than what they *are.* A useful habit is to ask: which way of grouping these customers actually changes how I'd treat them?

## Speaking to a segment, not to everyone

The payoff of segmentation is the message. A gym can tell its committed regulars about a new advanced class while reminding lapsed members how much they miss it — two different messages for two different groups, each landing because it fits. Trying to write one message for everyone forces you into bland mush that excites no one. When marketing feels personal and relevant, it's usually because someone segmented first and then spoke to each group in its own language.

## The danger of too many or too few segments

Segmentation can go wrong in two opposite directions. Too few segments — treating everyone the same — and you're back to the mythical average, missing real differences. Too many — a separate plan for every single customer — and you drown in complexity and can't act on any of it. The skill is finding a handful of segments that are genuinely different and genuinely useful. A good test: if two "segments" would get the exact same marketing anyway, they shouldn't be separate segments at all.

## In the real world

A famous lesson about averages comes from the **U.S. Air Force.** In the 1950s, planes kept crashing, and the cockpit had been designed to fit the "average pilot" — built from the average of thousands of pilots' measurements. A researcher then checked how many real pilots actually matched that average across the key dimensions. The answer was *zero.* Not a single pilot was average on all of them, so the cockpit built for the average fit no one well. The fix was to stop designing for the average and instead make seats, pedals, and straps adjustable to different kinds of bodies. Marketers learned the same thing: there is no average customer, so the winning move is to design for the real, different groups who are actually out there.`,
  },
  {
    slug: "the-funnel",
    title: "The funnel: from stranger to buyer",
    weekNumber: 1,
    blurb: "Customers travel a journey from never hearing of you to buying, dropping off at every stage — the funnel maps that journey so you can find and fix the leak.",
    lectureTitle: "1.3 The funnel (tracking the journey from stranger to buyer)",
    body: `# The funnel: from stranger to buyer

Nobody goes from never having heard of a business to handing over money in a single instant. They take a journey: they notice you, get curious, weigh it up, and finally decide. Marketing analytics gives that journey a shape — the **funnel** — and once you can see it, you can find exactly where customers are slipping away and fix the right thing instead of guessing.

## The journey from stranger to buyer

A customer's path usually runs through a few stages: first they become *aware* you exist, then *interested* enough to learn more, then they *consider* whether to buy, and finally they *purchase* (and ideally come back). Each stage is a real moment where a person either moves forward or drops out. Mapping this journey matters because "sales are down" is useless on its own — the cure is completely different depending on *which* step is losing people.

## Why it's shaped like a funnel

It's called a funnel because it's wide at the top and narrow at the bottom: lots of people hear about you, fewer get interested, fewer still consider buying, and only some actually purchase. That narrowing is normal and unavoidable — not everyone who sees an ad needs the product. The shape is useful precisely because it shows you can't expect everyone to reach the bottom; the question is never "why didn't everyone buy?" but "are we losing too many at one particular step?"

## Conversion rate: measuring each step

The key number in a funnel is the **conversion rate** — the share of people who make it from one stage to the next. If 1,000 people visit your site and 50 buy, that's a 5% conversion from visit to purchase. Measuring the rate at *each* step turns a vague feeling of "not enough sales" into a precise map: maybe lots of people add items to the cart but almost none finish checkout. The rate, step by step, is what tells you where the journey is breaking.

## Finding the leak

The whole power of the funnel is that it shows you the **leak** — the one stage where you're losing far more people than you should. If tons of people visit but almost none get interested, your problem is the first impression, not the price. If many fill a cart but abandon it at payment, your problem is checkout, not advertising. Pouring more money into the top of the funnel when the leak is at the bottom is like filling a bucket faster instead of plugging the hole.

## Fixing the right stage

Once you've found the leaky stage, you fix *that* stage, not a random one. A drop-off at checkout might be solved by offering more payment options or removing a forced sign-up; a drop-off at awareness needs better reach, not a smoother checkout. The discipline is to let the funnel point you to the real problem before spending a cent. The biggest, cheapest wins in marketing usually come from plugging the worst leak, not from working harder everywhere at once.

## In the real world

The clearest funnel leak on earth is the **abandoned online shopping cart.** Across e-commerce, roughly seven out of ten shoppers who put items in their cart never actually complete the purchase — they get all the way to the edge of buying and then vanish. Stores that studied this leak found the culprits were things like surprise shipping costs at the last second, being forced to create an account, or a checkout with too many steps. By fixing that one stage — showing costs upfront, allowing guest checkout, shortening the form — many recovered a big share of those nearly-lost sales. It's a perfect lesson of the funnel: the money wasn't hiding at the top of the journey, it was leaking out one specific step from the end.`,
  },
  {
    slug: "customer-lifetime-value",
    title: "Customer lifetime value",
    weekNumber: 1,
    blurb: "A customer isn't worth one sale — they're worth every sale across the whole relationship, and seeing that total changes how much you can spend to win and keep them.",
    lectureTitle: "1.4 Customer lifetime value (what a customer is really worth)",
    body: `# Customer lifetime value

When a new customer makes a small first purchase, it's tempting to judge them by that one sale and move on. But that's like judging a friendship by the first conversation. The single most clarifying idea in marketing analytics is **customer lifetime value** — the total worth of a customer across the *whole* relationship, not just today's receipt. Once you see customers this way, almost every spending decision changes.

## One sale versus a lifetime of sales

A coffee shop might make two dollars when you buy a latte. Judged on that sale alone, spending much to attract you looks foolish. But if you come back twice a week for two years, you're worth thousands — and suddenly fighting to win and keep you is obviously worth it. The trap is treating each customer as a one-time two-dollar transaction when they're really a long stream of purchases. Seeing the lifetime, not the single sale, is what separates short-sighted marketing from smart marketing.

## What customer lifetime value is

**Customer lifetime value (CLV)** is an estimate of the total money a customer will bring in over their entire relationship with you — how much they spend each time, how often, and for how long. You don't need exact math to use the idea: it's simply the difference between "this person bought once" and "this person will buy steadily for years." CLV reframes a customer from a single sale into an ongoing relationship with a total worth, which is the figure that should actually guide your decisions.

## Why CLV changes how much you can spend

CLV answers a question every business struggles with: *how much can I afford to spend to get a new customer?* If a customer is worth two dollars, you can't spend twenty to win them. But if they're worth two thousand over their lifetime, spending fifty to acquire them is a bargain. Businesses that only look at the first sale starve their marketing and lose to rivals who understand the lifetime value and confidently outspend them to win the same customers. CLV turns "are we spending too much?" into a question you can actually answer.

## Not all customers are equal

CLV also reveals an uncomfortable truth: customers are not equally valuable. A small group of loyal, frequent, high-spending customers often produces a huge share of the profit, while many one-time bargain-hunters barely cover the cost of serving them. This matters because it tells you where to aim your best effort: keeping and delighting your highest-value customers is usually worth far more than chasing endless cheap, one-time sales. Spreading attention equally across everyone quietly neglects the very customers who matter most.

## The retention trap

Here's a lesson that surprises people: it is almost always cheaper to *keep* a customer than to win a brand-new one. Yet many businesses pour nearly all their money into attracting strangers while letting loyal customers quietly drift away. Because winning a new customer can cost several times more than keeping an existing one, a business obsessed with new sales and blind to retention is filling a leaky bucket. Thinking in lifetime value naturally pushes you to protect the relationships you already have, not just hunt for new ones.

## In the real world

A clear example of lifetime-value thinking is a **paid membership like Amazon Prime.** On paper, giving members fast, free shipping costs the company money on each order and looks like a loss. But Amazon understood the lifetime value: members shop far more often and spend much more over the years than non-members, so the relationship is hugely profitable even when individual orders aren't. By spending generously to win and keep members — accepting thin or negative margins on single orders — the company invested in lifetime value instead of single sales. That willingness to lose a little on one purchase to gain a lot over a lifetime is exactly the mindset this section is about.`,
  },
  {
    slug: "churn",
    title: "Churn: spotting who's about to leave",
    weekNumber: 1,
    blurb: "Customers rarely announce they're leaving — they just quietly stop, but their behavior changes first, and spotting those warning signs lets you act before they're gone.",
    lectureTitle: "1.5 Churn (spotting who's about to leave before they do)",
    body: `# Churn: spotting who's about to leave

A business can be winning new customers every month and still be shrinking, because customers are leaking out the back door just as fast as they arrive. That quiet leaving is called **churn**, and it's one of the most expensive problems in marketing precisely because it's so easy to ignore. The good news: customers usually send warning signs before they go, and marketing analytics is how you read those signs in time to act.

## What churn is

**Churn** is simply customers leaving — canceling a subscription, not renewing, or just never coming back. Every business loses some customers; that's normal. The danger is when churn quietly outpaces the new customers coming in, so the business is shrinking even while marketing celebrates new sign-ups. Churn matters because it directly destroys the lifetime value you worked to build: a customer who leaves early was never worth what you paid to acquire them.

## Why churn is so expensive

Churn is brutal because of everything we learned about lifetime value: when a customer leaves, you lose not one sale but every future sale they would have made — and you've already spent good money winning them. It's a leaky bucket, where pouring in new customers at the top never fills it if they're draining out the bottom. Because keeping a customer is usually far cheaper than replacing them, reducing churn is often the single most profitable thing a business can do, even though it's far less glamorous than chasing new sign-ups.

## The warning signs

The crucial insight is that customers rarely leave without warning — their *behavior* changes first. Someone about to cancel a streaming service usually watches less and less for weeks before they quit; a once-weekly shopper starts coming monthly, then not at all. These slowdowns are the early-warning signals. By watching how engagement *changes over time* rather than just whether someone is still technically a customer, you can spot the people drifting toward the exit while there's still time to do something about it.

## Predicting churn from patterns

Once you know what leaving looks like, you can look across all your customers and flag the ones whose behavior matches that pattern — declining visits, smaller orders, longer gaps, ignored emails. This is prediction in the service of marketing: not certainty about who will leave, but a ranked list of who's *at risk.* It works because past leavers tend to behave a certain way before going, and current customers showing the same signs are likely heading the same way. The point isn't to be exactly right; it's to find the at-risk customers before they're gone.

## Acting in time

A churn prediction is only useful if it changes what you do. Once you've flagged at-risk customers, you can step in — a friendly check-in, a well-timed offer, fixing whatever frustrated them — while they can still be saved. Acting *before* someone leaves is far more effective than trying to win them back after they've already quit and moved on. The whole point of spotting churn early is turning a silent goodbye into a second chance, and doing it while the relationship is still alive.

## In the real world

The classic home of churn analysis is the **mobile phone carrier.** For years, phone companies faced customers who could switch to a rival at the end of any contract, and losing them was enormously costly. So carriers became pioneers of churn prediction: they watched for the tell-tale signs — more dropped-call complaints, declining usage, calls to customer service, a contract nearing its end — and flagged customers likely to leave. Then they acted in time, offering those specific at-risk customers a better deal or a new phone before the contract expired. That playbook — read the warning signs in the data, predict who's about to leave, and intervene before they do — is exactly what this section is teaching.`,
  },
  {
    slug: "ab-testing",
    title: "A/B testing: letting data settle the argument",
    weekNumber: 1,
    blurb: "Instead of arguing over which version is better, an A/B test shows both to similar customers at random and lets their actual behavior decide — the closest marketing gets to a fair experiment.",
    lectureTitle: "1.6 A/B testing (letting data settle the argument)",
    body: `# A/B testing: letting data settle the argument

Marketing teams love to argue: which headline, which color, which price, which photo. These arguments can go in circles forever because everyone's reasoning from opinion. **A/B testing** ends the argument the only honest way — by trying both versions on real customers and letting their actual behavior decide. It's the closest thing marketing has to a fair scientific experiment, and it's how data settles a debate that opinions never could.

## What an A/B test is

An **A/B test** is beautifully simple: you make two versions of something — call them A and B — show each version to a different randomly chosen group of customers, and measure which one performs better. Maybe version A is the old button and version B is a new one; whichever gets more clicks wins, decided by what people *did,* not what anyone *predicted.* The genius is that you don't have to win the argument in advance; you just run the test and read the answer off reality.

## Why the random split matters

The single most important rule is that the two groups must be split **at random.** If you showed version A to your loyal regulars and version B to brand-new visitors, you couldn't tell whether the difference came from the button or from the kind of people who saw it. Splitting customers randomly makes the two groups statistically alike in every other way, so any difference in results can fairly be credited to the one thing you changed. This is exactly the lesson of a fair experiment: change only one thing, keep everything else the same.

## Reading the result honestly

A winning version isn't always a real winner — sometimes one group just got lucky. If A gets 11 clicks and B gets 10 out of a few dozen people, that gap is probably random noise, not a real difference. To trust a result, you need enough people in each group and a big enough gap that luck is an unlikely explanation. The discipline is to ask not just "which number is higher?" but "is this difference big and solid enough that it would probably show up again?" — because a tiny lead on a tiny test means almost nothing.

## Common mistakes

A/B testing is easy to do badly. **Stopping early** the moment your favorite version is ahead lets you fool yourself with a lucky streak that would have evened out. **Changing several things at once** — new color *and* new wording *and* new price — means that even if B wins, you have no idea *which* change did it. And **testing something nobody cares about**, like a shade of grey almost no one notices, wastes effort that could test something that actually moves customers. The cure for all three is patience and focus: one change, enough data, and a result you're willing to be surprised by.

## One change at a time

The reason to test just one change at a time is the same reason scientists isolate variables: it's the only way to know *what* caused the result. If you want to learn whether a shorter form helps, change only the form length and leave everything else alone. It feels slower, but it's the only path to real knowledge instead of a pile of changes and a mystery about which one mattered. Tested patiently, one change at a time, A/B testing turns marketing from a shouting match into a steady accumulation of things you actually know.

## In the real world

A famous A/B test comes from the **2008 Obama presidential campaign.** The team couldn't agree on which photo and which button text would get more people to sign up on the website, so instead of arguing, they tested different combinations on real visitors at random and measured who actually signed up. The winning combination beat the version the team had originally favored by a wide margin — and, scaled across millions of visitors, that single tested improvement was estimated to have gained the campaign tens of millions of dollars in donations. They didn't win the argument in the meeting; they let the data settle it. That's the entire spirit of A/B testing: stop debating, run the test, and trust what customers actually do.`,
  },
  {
    slug: "attribution-and-personalization",
    title: "Attribution and personalization",
    weekNumber: 1,
    blurb: "When a customer sees many ads before buying, attribution asks which one deserves the credit — and personalization uses what you know to target each person, right up to the creepiness line.",
    lectureTitle: "1.7 Attribution and personalization (who gets credit, who gets targeted)",
    body: `# Attribution and personalization

A customer almost never buys after seeing a single ad. They see a post, get an email, notice a billboard, click a search result, and *then* buy — so when the sale finally happens, which of those touches deserves the credit? That's the puzzle of **attribution.** And once you know enough about a customer to answer it, you face a second power and a second danger: **personalization** — using what you know to target each person individually. These two ideas, credit and targeting, are where marketing analytics gets both most powerful and most fraught.

## Attribution: who gets the credit?

**Attribution** is the problem of deciding which marketing efforts actually caused a sale, when many of them touched the customer along the way. It matters enormously because credit decides where the money goes: if you wrongly believe the last ad did all the work, you'll pour your budget there and starve the efforts that really started the journey. Getting attribution right means spending on what genuinely brings customers in, instead of on whatever happens to be standing closest when they finally buy.

## The last-click trap

The most common attribution mistake is giving *all* the credit to the very last thing the customer clicked before buying — the "last click." It's tempting because it's easy to see, but it's like crediting only the player who scored and ignoring everyone who passed the ball up the field. The ad that first made the customer aware of you may have done the real work; the final click just collected an already-decided sale. Trusting last-click attribution quietly funds the ending of the journey while defunding the beginning that made it possible.

## Different ways to give credit

Because no single rule is perfect, marketers use different **attribution models.** *First-touch* credits whatever first brought the customer in; *last-touch* credits the final step; *multi-touch* tries to spread credit across all the steps in between. Each tells a different story about what's working, and the honest move is to recognize that the truth is usually shared across the whole journey, not owned by any one touch. The goal isn't a perfect formula; it's to stop fooling yourself that one easy-to-see step deserves all the credit.

## Personalization: targeting the right person

The flip side of knowing your customers is **personalization** — tailoring what each person sees to who they are and what they've done. Recommending a product based on past purchases, sending a reminder about an abandoned cart, or showing different offers to different segments are all personalization. Done well, it's genuinely helpful: customers see things they actually want and waste less time wading through things they don't. It's segmentation taken to its logical end — speaking not just to a group, but as closely as possible to the individual.

## The creepiness line

Personalization carries a real danger: push it too far and helpful becomes creepy, even harmful. Customers feel watched when targeting reveals you know more than they ever told you, and personalization can cross into manipulation or expose private things people never wanted shared. The line between "this is useful" and "this is unsettling" is where marketing analytics meets ethics. The responsible habit is to ask not only "*can* we target this precisely?" but "*should* we — would the customer feel served or spied on?" Power over data comes with a duty not to abuse it.

## In the real world

The most famous personalization story is the American retailer **Target.** By analyzing what customers bought, the company learned to predict surprisingly private things — including, in one widely reported case, that certain shopping patterns suggested a customer was pregnant, sometimes before her own family knew. Target used this to send pregnancy-related offers, which was powerfully effective marketing and also, to many people, deeply unsettling once they realized how much a store could infer. The story became a landmark lesson precisely because it sits exactly on the creepiness line: it shows both how potent personalization can be and why marketers must constantly ask whether precise targeting crosses from helpful into a violation of trust.`,
  },
  {
    slug: "insight-to-campaign",
    title: "From insight to campaign (capstone)",
    weekNumber: 1,
    blurb: "An insight buried in a report changes nothing — it's only worth something when it becomes a real campaign, and then you must measure whether the campaign actually worked.",
    lectureTitle: "1.8 From insight to campaign (Capstone)",
    body: `# From insight to campaign (capstone)

We end on the hardest and most important skill in the whole field: turning what you've learned about customers into something that actually happens. An insight sitting in a slide deck changes nothing. A business deciding *which customers to win back,* *which message to send,* *which idea to test* — that's where everything in this course comes together, including its deepest limits. This is the move from knowing to doing: from insight to **campaign.**

## An insight is only useful if it changes a campaign

Here's the blunt truth: if a finding wouldn't change anything you do, it's just trivia. Discovering that a certain segment is drifting toward churn matters only if it leads to a win-back campaign; learning which ad truly brings customers in matters only if you move budget toward it. Before celebrating any insight, the sharpest question is, *what will this change?* A beautiful chart that leads to the same actions you'd have taken anyway was a waste of everyone's time — useful insights are the ones that actually tip a real decision.

## Turning a number into an action

The whole course becomes a toolkit here. You *segment* to decide who the campaign is for, use *lifetime value* to decide how much they're worth spending on, read the *funnel* to find the stage that needs fixing, watch *churn* signals to decide who to save, *A/B test* to decide which version to send, and use *attribution* to decide where the budget really belongs. Each idea answers one piece of "what should we actually do?" A campaign is just a chain of these decisions, each one grounded in evidence instead of opinion.

## Closing the loop: did it work?

A campaign isn't finished when it launches — it's finished when you measure whether it worked. This is where everything about honest measurement returns: you check the campaign's results against what you hoped for, ideally compared to a group that didn't get it, so you can tell real impact from what would have happened anyway. A marketer who never checks results can't tell a brilliant campaign from a lucky one or a flop, and will keep repeating mistakes confidently. Closing the loop is what turns a one-off guess into a business that gets steadily smarter.

## Weighing the cost: spend where it counts

Every campaign spends limited money, so good decisions weigh the cost of each choice. Chasing brand-new strangers can cost far more than keeping existing customers; a flashy campaign aimed at low-value buyers can lose money even if it "works." A smart marketer asks not just "will this get a response?" but "is the response worth what it costs, given what these customers are worth?" Sometimes the wisest move is unglamorous — protecting loyal, high-value customers — because the math of lifetime value and acquisition cost says that's where the real profit lives.

## Act with humility: test, learn, iterate

Because customers are people and the world keeps changing, no campaign should be a single all-or-nothing bet. The honest approach is to test small, learn from the result, and scale up what works while quietly dropping what doesn't. A confident, well-tested finding can justify a bold campaign; a shaky hunch calls for a small experiment first. Humble marketers leave themselves room to be wrong — they pilot before they commit, and they treat every campaign as another chance to learn rather than a verdict carved in stone.

## Tying the course together

Look back and one thread runs through all eight topics: **don't guess what customers want — measure what they actually do, and act on it.** There is no average customer, so you segment; the journey leaks, so you read the funnel; a customer is worth a lifetime, not a sale; churn hides until you watch behavior; arguments are settled by testing, not opinions; credit and targeting must be handled honestly. Marketing analytics replaces confident assumptions with evidence about real people — harder than a flattering story, but the only kind that survives contact with actual customers.

## The biggest questions stay open

And plenty stays unsettled. How precisely *should* we target people before it becomes a violation of their privacy? When does using data to persuade tip over into manipulation? How do we keep our numbers from quietly steering us toward decisions that look smart on a dashboard but treat customers as targets instead of people? Marketing analytics gives us sharper questions and more honest evidence — not permission to do anything we can measure. The most useful habit to carry out of this course is simple: whenever the data tells a clean, flattering story about your customers, ask, "Is that real — and is acting on it fair to the people behind the numbers?"`,
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
    title: "Homework 1.1 — Customers, segments, funnels, and value",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. There's no need for any math — just explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-marketing-analytics-is",
        prompt:
          "A shop owner says, 'I don't need data — I've been doing this for years and I just know what my customers want.' Use what marketing analytics actually is to explain why relying only on gut feeling can mislead the owner, and what data would add. (3–5 sentences.)",
        correctAnswer:
          "Marketing analytics is using data about what customers actually do — what they buy, click, and ignore — to understand them, instead of relying on a hunch. Gut feeling is powerful but often wrong: the owner may remember loyal regulars vividly while never noticing the many customers who quietly tried the shop once and never came back. Data would replace 'I just know' with evidence about who really shops there, what actually sells, and where customers are being lost, which the owner's memory can't reliably see. It doesn't replace the owner's experience; it makes it more honest by checking confident opinions against what customers truly do.",
        explanation:
          "Full credit: explains marketing analytics uses real behavior data not just intuition, notes gut feeling is often biased/incomplete (e.g. memory misses silent non-returners), and that data turns confident opinion into evidence about real customers.",
      },
      {
        topicSlug: "segmentation",
        prompt:
          "A streaming service looks at its users and proudly reports, 'Our average customer is 35 years old and watches 4 hours a week, so we'll design everything for that person.' Using the idea of segmentation, explain what's wrong with designing for the average customer. (3–5 sentences.)",
        correctAnswer:
          "The 'average customer' is usually a fiction that almost nobody actually matches, so designing for them can please no one. If the service really has a big group of teenagers bingeing cartoons and a big group of retirees watching the news, the '35-year-old who watches 4 hours' is just those groups blended into a middle that doesn't exist. Segmentation means splitting customers into meaningful groups that respond to different messages, so the service can offer each group what it actually wants. Designing for the blended average hides the very differences that matter and leads to bland choices that fit nobody well.",
        explanation:
          "Full credit: explains the average customer is a myth that hides real differences, that segmentation splits customers into meaningful groups needing different treatment, and why designing for the average pleases no one; may give an example of distinct groups.",
        hint: "If half your customers are very different from the other half, who exactly is the 'average' one — and does that person really exist?",
      },
      {
        topicSlug: "the-funnel",
        prompt:
          "An online store sees lots of visitors and lots of items added to carts, but very few completed purchases, and the owner's plan is to 'buy more ads to get even more visitors.' Using the idea of the funnel, explain why this plan probably won't fix the problem. (3–5 sentences.)",
        correctAnswer:
          "The funnel is the journey from awareness to interest to purchase, and the store should find which stage is leaking before spending. Here, plenty of people are reaching the cart but dropping out at checkout, so the leak is near the bottom of the funnel, not the top. Buying more ads just pours more people into a funnel that's losing them at the same broken step, which is like filling a leaky bucket faster instead of plugging the hole. The smarter move is to fix the checkout stage — for example surprise costs or a forced sign-up — so more of the visitors they already have actually finish buying.",
        explanation:
          "Full credit: explains the funnel and conversion at each stage, identifies the leak as checkout (bottom) not awareness (top), and explains why more top-of-funnel ads won't fix a bottom-of-funnel leak; may suggest fixing checkout.",
      },
      {
        topicSlug: "customer-lifetime-value",
        prompt:
          "A coffee shop refuses to spend more than $1 to attract a new customer because 'a single coffee only earns us about $1 in profit.' Using customer lifetime value, explain why this reasoning could be costing the shop money. (3–5 sentences.)",
        correctAnswer:
          "Customer lifetime value is the total a customer is worth across the whole relationship, not just one sale. A regular who buys coffee twice a week for two years is worth hundreds of dollars, not one — so judging them by a single $1 cup massively undervalues them. Because the lifetime value is so much larger than one sale, the shop could afford to spend far more than $1 to win a customer who will keep coming back, and still come out ahead. By looking only at the first sale, the shop starves its marketing and loses good long-term customers to competitors who understand what those customers are really worth.",
        explanation:
          "Full credit: explains CLV is total value over the whole relationship not one sale, that judging by a single purchase undervalues a repeat customer, and that knowing CLV lets the shop justify spending more to acquire customers it would otherwise lose.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Churn, testing, attribution, and campaigns",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. No math is required — explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "churn",
        prompt:
          "A subscription app is thrilled because it's signing up more new users than ever, but its total number of users isn't growing. Using the idea of churn, explain what's likely happening and why the company should care. (3–5 sentences.)",
        correctAnswer:
          "Churn is customers quietly leaving — canceling or just never coming back — and it sounds like users are leaving the back door as fast as new ones come in the front. Even with record sign-ups, if churn is just as high the total stays flat, like a leaky bucket that never fills no matter how fast you pour. The company should care because churn destroys the lifetime value of customers it already paid to acquire, and keeping an existing customer is usually far cheaper than winning a new one. Instead of only celebrating sign-ups, it should watch for the behavior changes that signal people drifting away and act to keep them before they leave.",
        explanation:
          "Full credit: explains churn (customers leaving) can cancel out new sign-ups (leaky bucket), why it's expensive (lost lifetime value, retention cheaper than acquisition), and that the firm should track/reduce churn, not just count sign-ups.",
        hint: "If new users come in just as fast as old ones leave, what happens to the total — and which number is the company ignoring?",
      },
      {
        topicSlug: "ab-testing",
        prompt:
          "A marketing team can't agree whether a red or a green 'Buy Now' button gets more clicks, so they show the red button only to their loyal repeat customers and the green button only to first-time visitors, then declare the winner. Explain what's wrong with this test using the idea of A/B testing. (3–5 sentences.)",
        correctAnswer:
          "A proper A/B test must split customers between the two versions at random, so the groups are alike in every way except the one thing being tested. Here the groups are completely different kinds of people — loyal regulars versus brand-new visitors — so if one button 'wins,' you can't tell whether it was the color or just the type of customer who saw it. Loyal customers buy more anyway, so the result is hopelessly tangled with who got which button. To fix it, they should show red and green to randomly mixed customers and change only the button color, so any difference in clicks can fairly be credited to the color itself.",
        explanation:
          "Full credit: explains A/B tests need a random split so groups are comparable, identifies that splitting by customer type confounds the result (can't separate color from customer), and that the fix is random assignment changing only one thing.",
      },
      {
        topicSlug: "attribution-and-personalization",
        prompt:
          "A company notices that customers almost always click a search ad right before buying, so it decides to move its entire budget to search ads and cut everything else. Using the idea of attribution, explain why this could be a mistake. (3–5 sentences.)",
        correctAnswer:
          "Attribution is about deciding which marketing efforts actually deserve credit for a sale when many touched the customer along the way, and this company is falling into the last-click trap. The search ad is just the final step the customer clicks, but other efforts — a social post or email that first made them aware and interested — may have done the real work of starting the journey. Crediting only the last click is like crediting only the player who scored and ignoring everyone who passed the ball up the field. If the company cuts the earlier efforts that bring customers in, it may find the search ads have far fewer people left to convert, and overall sales fall.",
        explanation:
          "Full credit: explains attribution and the last-click trap, that earlier touches may have done the real work of creating awareness/interest, and that cutting them could starve the top of the journey and reduce sales; may use a multi-touch point.",
      },
      {
        topicSlug: "insight-to-campaign",
        prompt:
          "A data team discovers that a particular group of customers is showing early signs of leaving, writes it up in a slide, and moves on to the next analysis. Using the idea of turning insight into a campaign, explain why this insight has created no value yet, and what should happen next. (3–5 sentences.)",
        correctAnswer:
          "An insight is only useful if it actually changes what the company does; sitting in a slide, this finding has changed nothing and so is just trivia. Discovering that a group is drifting toward churn matters only if it leads to action — a win-back offer, a check-in, or fixing whatever is frustrating them — aimed at those specific at-risk customers while they can still be saved. The team should turn the insight into a real campaign targeting that group, then close the loop by measuring whether the campaign actually kept more of them, ideally compared to a group that didn't get it. Without that move from knowing to doing and then checking, the analysis produces no value at all.",
        explanation:
          "Full credit: explains an insight is worthless until it changes an action, that this churn finding should drive a targeted win-back campaign, and that they should measure whether it worked (close the loop); may note acting before customers leave.",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Marketing Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-marketing-analytics-is",
        prompt:
          "Explain what marketing analytics is, why it's fair to say 'everyone already does marketing,' and why measured evidence about what customers do beats confident opinions about what they want. Why does keeping that distinction matter? (4–6 sentences.)",
        correctAnswer:
          "Marketing analytics is the careful practice of using data about what real customers actually do — what they buy, click, return, and ignore — to understand them and decide what will make them buy, instead of relying on gut feeling. It's fair to say everyone already does marketing because we all do it informally, like a friend who flags a sale they know you'll love (that's targeting) or a shopkeeper who remembers a regular's usual order (that's using customer data). Measured evidence beats opinion because in marketing everyone has a free and confident opinion — the boss likes blue, the designer likes green — and analytics replaces 'which do we like?' with 'which actually makes more people buy?' Keeping that distinction matters because acting on untested opinion wastes money and misreads customers, while grounding decisions in real behavior is fairer and far more reliable. That honesty about evidence over assumption is the foundation the whole course is built on.",
        explanation:
          "Full credit: defines marketing analytics as using real customer-behavior data to understand customers, explains everyone markets informally and data makes it more honest, contrasts measured evidence with free opinions, and why that distinction supports better/fairer decisions.",
      },
      {
        topicSlug: "segmentation",
        prompt:
          "Explain what segmentation is, why 'the average customer' is a myth, and why splitting customers into a few meaningful groups beats either treating everyone the same or making a separate plan for every single person. (4–6 sentences.)",
        correctAnswer:
          "Segmentation is dividing customers into groups whose members are alike in some way that matters for marketing, so people in the same group respond to the same message while different groups get different ones. The 'average customer' is a myth because real customers are usually a mix of very different kinds of people, and blending them produces a made-up middle person almost nobody matches — like averaging teenagers and retirees into a 'middle-aged' customer who isn't there. Treating everyone the same falls back on that fictional average and misses real differences, so the marketing pleases no one. But making a separate plan for every individual drowns you in complexity you can't act on. The skill is finding a handful of segments that are genuinely different and genuinely useful — big enough to matter, distinct enough to deserve their own message, and based on something you can actually act on.",
        explanation:
          "Full credit: defines segmentation (meaningful groups responding to different messages), explains the average customer is a myth that hides differences, and why a few useful segments beat both one-size-fits-all and per-person plans (too few misses differences, too many is unmanageable).",
      },
      {
        topicSlug: "the-funnel",
        prompt:
          "Describe the marketing funnel and its stages, explain what a conversion rate measures, and explain why finding the 'leak' is more useful than just trying to get more customers at the top. (4–6 sentences.)",
        correctAnswer:
          "The funnel is the customer's journey from stranger to buyer, usually running through stages like awareness, interest, consideration, and purchase, and it's shaped like a funnel because it's wide at the top and narrows as people drop out at each step. A conversion rate is the share of people who make it from one stage to the next — for example, if 1,000 people visit and 50 buy, that's a 5% visit-to-purchase conversion. Measuring the rate at each step turns a vague 'sales are low' into a precise map of where customers are slipping away. Finding the leak — the one stage losing far more people than it should — matters because the cure depends entirely on which step is broken: a checkout problem needs a smoother checkout, not more ads. Pouring money into the top of the funnel when the leak is at the bottom is like filling a leaky bucket faster instead of plugging the hole, so the biggest cheap wins come from fixing the worst-leaking stage.",
        explanation:
          "Full credit: describes the funnel stages (awareness→…→purchase) and its narrowing shape, defines conversion rate (share moving to the next stage), and explains why fixing the leaky stage beats adding top-of-funnel volume; may use the leaky-bucket image.",
      },
      {
        topicSlug: "customer-lifetime-value",
        prompt:
          "Explain what customer lifetime value is, why it changes how much a business can afford to spend to win a customer, and why it usually makes sense to protect existing customers rather than only chase new ones. (4–6 sentences.)",
        correctAnswer:
          "Customer lifetime value (CLV) is an estimate of the total money a customer brings in across the whole relationship — how much they spend, how often, and for how long — not just the value of a single sale. It changes how much you can spend to win a customer because if someone is worth only one $2 sale you can't spend $20 to get them, but if they're worth thousands over years, spending $50 to acquire them is a bargain. Businesses that look only at the first sale starve their marketing and lose customers to rivals who understand the lifetime value and confidently outspend them. CLV also reveals that customers aren't equally valuable — a small group of loyal, frequent buyers often produces most of the profit. And because keeping a customer is usually several times cheaper than winning a new one, it usually makes sense to protect existing high-value customers rather than pour everything into chasing strangers while loyal customers quietly drift away.",
        explanation:
          "Full credit: defines CLV (total value over the whole relationship), explains it sets how much you can afford to acquire a customer, notes customers differ in value, and that retention is usually cheaper than acquisition so protecting existing customers often pays more.",
      },
      {
        topicSlug: "churn",
        prompt:
          "Explain what churn is, why it can be so expensive even while a business is gaining new customers, and how watching customer behavior over time helps you act before customers leave. (4–6 sentences.)",
        correctAnswer:
          "Churn is customers leaving — canceling, not renewing, or simply never coming back — and every business loses some, but it becomes dangerous when leavers quietly outpace new arrivals. It can be expensive even while you're gaining customers because, like a leaky bucket, pouring new customers in the top never fills it if just as many drain out the bottom, and each leaver costs you all their future lifetime value plus the money you already spent to acquire them. The key insight is that customers rarely leave without warning — their behavior changes first, like a streaming user watching less and less for weeks before canceling, or a weekly shopper slipping to monthly and then to nothing. By watching how engagement changes over time rather than just whether someone is still technically a customer, you can flag the people drifting toward the exit while there's still time. Then you can act — a check-in, a well-timed offer, or fixing the frustration — before they're gone, which is far more effective than trying to win them back afterward.",
        explanation:
          "Full credit: defines churn, explains the leaky-bucket effect (churn can cancel out new sign-ups) and lost lifetime value, that behavior changes are early warning signs, and that watching behavior over time lets you intervene before customers leave.",
      },
      {
        topicSlug: "ab-testing",
        prompt:
          "Explain what an A/B test is, why splitting customers at random is essential, and why you should change only one thing at a time and avoid stopping the test the moment your favorite version is ahead. (4–6 sentences.)",
        correctAnswer:
          "An A/B test is comparing two versions of something — call them A and B — by showing each to a different randomly chosen group of customers and measuring which performs better, letting actual behavior decide instead of opinion. Splitting at random is essential because it makes the two groups alike in every other way, so any difference in results can fairly be credited to the one thing you changed; if you instead gave A to loyal regulars and B to new visitors, you couldn't tell whether the button or the customers caused the difference. You should change only one thing at a time because if you change the color and the wording and the price all at once and B wins, you have no idea which change actually did it. And you shouldn't stop the moment your favorite is ahead, because a small early lead is often just luck (noise) that would even out — you need enough people and a big enough gap that luck is an unlikely explanation. Tested patiently, one change at a time, A/B testing turns a marketing argument into something you actually know.",
        explanation:
          "Full credit: defines an A/B test (two versions, random split, measure which wins), explains random assignment makes groups comparable so the change gets the credit, why isolating one change identifies the cause, and why stopping early/small samples risk mistaking luck for a real result.",
      },
      {
        topicSlug: "attribution-and-personalization",
        prompt:
          "Explain the problem of attribution and the 'last-click trap,' then explain what personalization is and why marketers must watch the 'creepiness line.' (4–6 sentences.)",
        correctAnswer:
          "Attribution is the problem of deciding which marketing efforts actually deserve credit for a sale when many of them touched the customer along the way, and it matters because credit decides where the budget goes. The last-click trap is giving all the credit to the very last thing the customer clicked before buying — easy to see, but like crediting only the player who scored while ignoring everyone who passed the ball up the field; the earlier touches that first created awareness may have done the real work. That's why marketers use different models (first-touch, last-touch, multi-touch) and accept that credit is usually shared across the whole journey. Personalization is the flip side of knowing your customers: tailoring what each person sees to who they are and what they've done, like recommending products from past purchases or reminding someone about an abandoned cart, which is genuinely helpful when done well. But marketers must watch the creepiness line, because pushing personalization too far makes customers feel watched or exposes private things, tipping helpful into unsettling or manipulative — so the real question is not just 'can we target this precisely?' but 'should we, and would the customer feel served or spied on?'",
        explanation:
          "Full credit: explains attribution (which efforts get credit) and the last-click trap (over-crediting the final touch, ignoring earlier ones), defines personalization (tailoring to the individual), and explains the creepiness line (too-precise targeting feels invasive/manipulative — must ask 'should we?').",
      },
      {
        topicSlug: "insight-to-campaign",
        prompt:
          "Explain why an insight is only useful if it changes a campaign, why you must measure whether the campaign actually worked, and what it means to act with humility by testing and iterating rather than betting everything at once. (4–6 sentences.)",
        correctAnswer:
          "An insight is only useful if it changes a campaign because a finding that wouldn't change anything you do is just trivia — discovering a segment is drifting toward churn matters only if it leads to a real win-back effort. Turning insight into action draws on the whole course: you segment to decide who the campaign is for, use lifetime value to decide how much they're worth, read the funnel to find what to fix, and use attribution to decide where the budget belongs. You must measure whether the campaign worked because a campaign isn't finished when it launches but when you check its results, ideally against a group that didn't get it, so you can tell real impact from what would have happened anyway — otherwise you can't separate a brilliant campaign from a lucky or failed one. Acting with humility means testing small, learning from the result, and scaling up what works rather than betting everything on a single all-or-nothing campaign: a well-tested finding can justify a bold move, but a shaky hunch calls for a small experiment first. Underneath it all runs the course's thread — don't guess what customers want, measure what they actually do, and act on it — which is why you pilot, check, and leave yourself room to be wrong.",
        explanation:
          "Full credit: explains an insight must change a campaign to matter, that you must measure results (ideally vs. a control) to tell real impact from luck, and that acting with humility means testing/iterating rather than one big bet; may cite the course's measure-don't-guess thread.",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Marketing Analytics for Everyone",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. No math is required. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "insight-to-campaign",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'don't guess what customers want; measure what they actually do, and act on it' — runs through marketing analytics. Show how it applies to at least three different topics (for example: opinions vs. evidence, the average customer myth, finding the funnel's leak, lifetime value, churn warning signs, A/B testing, last-click attribution, or turning insight into a campaign). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is that you shouldn't guess what customers want — you should measure what they actually do and act on it, replacing confident opinions with evidence about real people. It shows up first in what marketing analytics is: instead of arguing over which logo the boss likes, you measure which one actually makes more people buy. It appears in segmentation, where the comfortable 'average customer' is a myth and the truth lives in what different real groups actually do, so you split them and speak to each. It drives the funnel, where you don't assume why sales are low but measure the conversion at each step to find the real leak, and A/B testing, where you stop debating and let a fair, randomized test settle which version wins. It governs churn, where you watch how behavior actually changes over time to spot who's leaving rather than assuming everyone's happy, and attribution, where you resist the easy last-click story and look at what really brought customers in. Finally it defines the capstone: an insight is worthless until it becomes a campaign and you measure whether that campaign truly worked. Across all of it, marketing analytics trades flattering assumptions for honest evidence about what customers really do — harder than a tidy story, but the only approach that survives contact with actual customers.",
        explanation:
          "Full credit: states the unifying habit (measure real behavior, don't guess/assume) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "segmentation",
        prompt:
          "A company says, 'Our typical customer is a 30-something city dweller, so we'll send the exact same campaign to everyone on our list.' Using ideas from the course, argue why understanding customers as distinct segments would lead to better marketing. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'typical customer' view assumes one made-up average person stands in for everyone, but that average is usually a fiction almost nobody matches, so a single campaign aimed at them tends to please no one. Real customer lists are normally a mix of very different groups, and segmentation means splitting them into meaningful groups that respond to different messages. For example, a streaming service might have committed daily viewers, occasional weekend watchers, and lapsed members who haven't logged in for months — and the same email can't possibly fit all three. The daily viewers might want news of an advanced new feature, the occasional ones a reminder of what's new, and the lapsed ones a win-back offer; one blended message lands with none of them. Segmenting also connects to lifetime value, since the loyal heavy users are usually worth far more and deserve the best effort. The honest move is to identify a handful of genuinely different, useful segments and speak to each in its own language, instead of broadcasting one bland message to a customer who doesn't exist.",
        explanation:
          "Full credit: rejects the 'average/typical customer' approach, explains segmentation into meaningful groups needing different messages, supports it with a concrete example of distinct segments, and notes why one-size-fits-all pleases no one; may link to lifetime value.",
      },
      {
        topicSlug: "ab-testing",
        prompt:
          "A team is sure that a new website design is better, so they switch everyone over to it, see sales rise the next month, and declare the new design a success. Using ideas from the course, explain why this isn't solid proof the design caused the rise, and what they should have done instead. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Switching everyone over at once and watching sales rise mixes up correlation with causation: many things could have lifted sales that month, so the rise moving together with the new design doesn't prove the design caused it. Maybe a holiday, a competitor's stumble, or a separate ad campaign happened at the same time — a hidden third factor driving the rise while the design got the credit. The honest tool is an A/B test: show the old design and the new one to randomly split groups of visitors at the same time, change only the design, and compare how each group actually behaves. Because random assignment makes the two groups alike in every other way, any difference in sales can fairly be credited to the design rather than to timing or luck. They should also have collected enough visitors and a big enough gap that the result isn't just noise, and changed only the design rather than several things at once. With everyone switched at once and no comparison group, they have a confident story but no real evidence — exactly the guesswork the course warns against.",
        explanation:
          "Full credit: explains that a before/after rise with no control confounds the design with other causes (correlation not causation / hidden third factor), that an A/B test with a randomized control changing only the design would isolate the cause, and notes needing enough data; may give a concrete confounder.",
      },
      {
        topicSlug: "churn",
        prompt:
          "A subscription business celebrates record new sign-ups every month but is frustrated that revenue is flat, and an executive says, 'We just need even more new customers.' Using ideas from the course, explain why focusing only on new customers may be the wrong fix, and what they should examine instead. Use a concrete example. (5–7 sentences.)",
        correctAnswer:
          "Record sign-ups with flat revenue is the classic sign of churn: customers are leaving out the back door about as fast as new ones arrive, so the bucket never fills no matter how fast you pour. Chasing even more new customers is expensive and, on its own, won't fix a leak at the bottom — and winning a new customer usually costs several times more than keeping an existing one, so this plan may actually lose money. The business should examine its churn and the lifetime value it's destroying: each customer who leaves early takes all their future revenue and wastes the money spent acquiring them. It should look for the warning signs in behavior — for example, users who log in less and less each week, or whose usage drops before they cancel — and flag the at-risk customers while there's still time. Then it can act with a targeted retention campaign, like a check-in or a well-timed offer to those specific people, and measure whether it keeps more of them. Plugging the leak by reducing churn is often far more profitable than pouring in ever more new sign-ups, which is why the right fix starts at the bottom of the bucket, not the top.",
        explanation:
          "Full credit: identifies churn as the cause of flat revenue despite sign-ups (leaky bucket), explains retention is usually cheaper than acquisition and that churn destroys lifetime value, and says to detect at-risk customers via behavior signals and run a targeted retention campaign; may give a concrete warning sign.",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about marketing analytics cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete marketing and customer-data situations.",
    lectureTitle: "Primer: How to reason about marketing analytics cases",
    body: `# How to reason about marketing analytics cases

This short primer prepares you for the **Marketing Analytics** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — a business designing for "the average customer," a funnel leaking at checkout, a last-click decision that defunds the real source of customers, an A/B test split unfairly — and asks what the course's ideas tell you about it. Knowing the words "segmentation" or "churn" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: why evidence beats opinion, why there's no average customer, how to find the leak in a funnel, what a customer is worth over a lifetime, how to read churn warning signs, why an A/B test must be split at random, when last-click attribution misleads, and what it takes to turn an insight into a campaign.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the flattering reading** — marketing analytics measures what customers actually do; it does not assume the tidiest or most convenient story about them. The best answers stay grounded in real behavior and evidence, not in what a business wishes were true.

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
  // The course was migrated to the Marketing Analytics syllabus.
  // Detect the marker topic; if present and the content version matches, the
  // content is current and we skip. This makes the seed self-healing across
  // environments: a database that still holds older content (e.g. a previous
  // curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-marketing-analytics-is"));
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
        "Seed: stale course content detected — replacing with the Marketing Analytics curriculum",
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
