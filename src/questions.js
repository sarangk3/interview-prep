/* Question bank: Industry → Role → { text, mc } */

export const INDUSTRIES = ['General', 'Healthcare', 'Fintech', 'E-commerce'];
export const ROLES = ['AI Solutions Architect', 'Forward Deployed Engineer', 'Forward Deployed Product Manager', 'Technical Program Manager'];

const mc = (q, options, correct, explanation) => ({ q, options, correct, explanation });

/* ── Reusable role blocks per industry ── */

const AISA = {
  General: {
    text: [
      "Design a RAG (retrieval-augmented generation) system over a company's internal knowledge base. Walk through chunking, embeddings, retrieval, and how you'd reduce hallucinations.",
      "A client wants an LLM-powered assistant. How do you decide between prompting, RAG, and fine-tuning — and what are the tradeoffs?",
      "Design an evaluation framework for an LLM application where there's no single ground-truth answer. How do you measure quality and catch regressions?",
      "How do you architect an agentic AI system that calls tools and takes multi-step actions reliably? How do you handle failures and guardrails?",
      "A client's AI feature is too slow and too expensive at scale. Walk me through how you'd cut latency and cost without sacrificing quality.",
    ],
    mc: [
      mc("A client needs an LLM to answer over proprietary docs that change weekly. Best approach?",
        ["Fine-tune a model weekly", "Retrieval-augmented generation (RAG)", "Prompt with no external data", "Train a model from scratch"], 1,
        "RAG keeps knowledge fresh without retraining. Fine-tuning bakes in static knowledge and is costly to update weekly."),
      mc("Your RAG system retrieves irrelevant chunks. Most impactful first fix?",
        ["Use a bigger LLM", "Improve chunking, embeddings, and add reranking", "Write longer prompts", "Increase temperature"], 1,
        "Garbage retrieval yields garbage generation. Fix retrieval quality before reaching for a larger model."),
      mc("Best way to reduce hallucinations in a RAG answer?",
        ["Raise temperature", "Ground answers in retrieved context, cite sources, allow 'I don't know'", "Remove the retrieval step", "Make the prompt vaguer"], 1,
        "Grounding in retrieved context with citations and an explicit 'I don't know' path curbs fabrication."),
      mc("Evaluating an LLM app with no single correct answer, best practice?",
        ["Eyeball a few outputs once", "Curated eval set with LLM-as-judge + human review + task metrics", "Trust the model", "Only measure latency"], 1,
        "A curated eval set scored by a mix of LLM-as-judge, humans, and task metrics catches regressions reliably."),
      mc("An AI feature is too expensive at scale. Effective lever?",
        ["Always use the largest model", "Route easy cases to a smaller model, cache, right-size context", "Disable caching", "Add more prompt text"], 1,
        "Model routing, caching, and trimming context cut cost substantially while preserving quality on hard cases."),
    ],
  },
  Healthcare: {
    text: [
      "Design an AI system to help clinicians summarize patient charts. How do you handle PHI, accuracy, and clinician trust?",
      "A health system wants AI-assisted HCC risk-adjustment coding. How do you architect it to be accurate and auditable?",
      "How would you deploy an LLM in a clinical setting while managing hallucination risk and regulatory concerns?",
    ],
    mc: [
      mc("Running an LLM over clinical notes containing PHI, key requirement?",
        ["Send notes to any public API", "Process within a HIPAA-compliant environment under a BAA", "Email notes to the model vendor", "Skip access controls"], 1,
        "PHI must stay within a HIPAA-compliant, BAA-covered environment — not sent to non-compliant endpoints."),
      mc("What makes AI-assisted clinical coding trustworthy to reviewers?",
        ["Hiding its reasoning", "Surfacing supporting evidence/citations from the chart for human verification", "Auto-submitting codes", "Higher temperature"], 1,
        "Showing the chart evidence behind each suggested code lets a human verify — essential for auditable coding."),
      mc("Biggest risk of an LLM giving medical info directly to patients?",
        ["Slower responses", "Hallucinated or incorrect guidance without clinical oversight", "Too many citations", "Lower cost"], 1,
        "Unsupervised clinical advice can be wrong and harmful; human oversight and strict guardrails are required."),
    ],
  },
  Fintech: {
    text: [
      "Design an AI system for detecting fraudulent transactions that combines ML models with LLMs. How do you handle false positives?",
      "A bank wants an LLM support assistant. How do you stop it giving incorrect financial advice or leaking customer data?",
      "How would you build an AI system to extract structured data from financial documents at scale and reliably?",
    ],
    mc: [
      mc("Deploying an LLM assistant in banking, top guardrail?",
        ["Let it answer anything", "Restrict scope, ground in approved content, block unauthorized advice and data leakage", "Disable logging", "Maximize creativity"], 1,
        "Banking assistants need tight scope, grounding, and controls against incorrect advice and data exposure."),
      mc("Why pair ML scoring with rules in fraud detection?",
        ["Rules are useless", "Rules catch known patterns deterministically; ML generalizes — together they balance precision/recall", "ML alone is always enough", "To slow it down"], 1,
        "Deterministic rules plus generalizing ML balance catching known and novel fraud while controlling false positives."),
      mc("Extracting data from financial PDFs robustly, best approach?",
        ["Trust raw OCR blindly", "OCR + LLM extraction with validation and confidence checks against the source", "Manual entry only", "Guess values"], 1,
        "Combining extraction with validation and confidence scoring against the source document ensures reliability."),
    ],
  },
  'E-commerce': {
    text: [
      "Design an AI-powered product search and recommendation system. How do you blend embeddings, ranking, and personalization?",
      "A retailer wants an LLM shopping assistant. How do you keep it grounded in real inventory and current pricing?",
      "How would you use AI to generate and optimize product descriptions at scale while keeping quality high?",
    ],
    mc: [
      mc("An LLM shopping assistant must not invent products. Best design?",
        ["Let it free-generate SKUs", "Ground responses in the live catalog via retrieval/tools", "Ignore inventory", "Hard-code 10 products"], 1,
        "Grounding in a live product catalog via retrieval/tools prevents the assistant from inventing products or prices."),
      mc("Improving semantic product search, key technique?",
        ["Exact keyword match only", "Embedding-based retrieval with reranking, blended with business signals", "Random ordering", "Alphabetical only"], 1,
        "Embedding retrieval plus reranking and business signals captures intent far better than keyword matching alone."),
      mc("Generating product descriptions at scale, quality control?",
        ["Publish raw output", "Templated prompts + automated checks + human spot-review for brand and accuracy", "No review", "One prompt for all"], 1,
        "Structured prompts with automated checks and human spot-review keep generated copy on-brand and accurate."),
    ],
  },
};

const FDE = {
  General: {
    text: [
      "You're embedded with a customer who can't clearly articulate what they need. Walk me through going from an ambiguous problem to a working prototype.",
      "A customer's data is messy, siloed across systems, and poorly documented. How do you build a reliable pipeline on top of it?",
      "You've built a solution for one customer. How do you decide what to push back into the core product vs. keep as a custom build?",
      "A customer demo is in 3 days and the integration isn't working. How do you triage and still deliver something credible?",
      "How do you balance moving fast for a single customer against building maintainable, scalable software?",
    ],
    mc: [
      mc("A customer can't articulate requirements. Best first move?",
        ["Write a 30-page spec first", "Observe their real workflow and build a quick prototype to react to", "Wait for them to figure it out", "Build what you assume they want"], 1,
        "Forward-deployed work thrives on observing real workflows and iterating on prototypes, not upfront specs."),
      mc("Customer data is messy and undocumented. Reliable pipeline approach?",
        ["Assume it's clean", "Build with schema validation, data-quality checks, and observability", "Skip validation to move fast", "Hardcode the happy path"], 1,
        "Validation, quality checks, and observability surface bad data early instead of failing silently downstream."),
      mc("A one-off custom feature is now requested by many customers. Right move?",
        ["Keep rebuilding it per customer", "Generalize it and push into the core platform", "Refuse all of them", "Ignore the pattern"], 1,
        "Recurring custom needs should be generalized into the platform to avoid maintaining many one-offs."),
      mc("Demo in 3 days, integration broken. Best triage?",
        ["Try to fix everything", "Scope to the critical path that proves value; mock non-essential parts", "Cancel the demo", "Show a slide deck only"], 1,
        "Focus on the critical path that demonstrates value and stub the rest to deliver something credible on time."),
      mc("Forward-deployed work risks one-off spaghetti. Mitigation?",
        ["Never reuse anything", "Build reusable components and feed learnings back to product", "Avoid documentation", "Rewrite per customer"], 1,
        "Reusable components plus a feedback loop to product keeps custom work from becoming unmaintainable."),
    ],
  },
  Healthcare: {
    text: [
      "You're embedded at a health system to deploy a data platform. How do you handle PHI access, EHR integration, and clinician adoption?",
      "A hospital's data is spread across legacy systems with no clean API. How do you integrate it safely?",
      "How do you earn the trust of clinical staff who are skeptical of a new tool you're deploying on-site?",
    ],
    mc: [
      mc("Accessing a health system's data on-site, first requirement?",
        ["Grab whatever you can", "Proper data-use agreements/BAA and least-privilege PHI access", "Use a personal laptop", "Disable audit logs"], 1,
        "PHI access requires the right agreements and least-privilege, audited access before any integration."),
      mc("Integrating a legacy EHR with no clean API, pragmatic approach?",
        ["Scrape the UI insecurely", "Use available interfaces (HL7/FHIR, secure extracts) with validation", "Copy the database to a USB", "Skip integration"], 1,
        "Lean on standard interfaces and secure extracts with validation rather than insecure scraping of PHI."),
      mc("Winning over skeptical clinicians, best tactic?",
        ["Mandate usage", "Solve a real pain they feel, with their input, inside their workflow", "Send a long email", "Ignore their concerns"], 1,
        "Adoption follows from solving a felt pain point collaboratively and fitting their existing workflow."),
    ],
  },
  Fintech: {
    text: [
      "You're deployed at a bank to build a custom risk dashboard. How do you integrate with their core systems while meeting compliance?",
      "A financial customer needs a solution fast but has strict change-control. How do you move quickly without breaking their rules?",
      "How do you build on a customer's sensitive financial data while ensuring auditability?",
    ],
    mc: [
      mc("Building on a bank's core systems, key constraint to respect?",
        ["Move fast and skip process", "Their change-control and compliance processes", "Their lunch schedule", "Nothing"], 1,
        "Regulated customers have change-control and compliance you must align delivery to, not bypass."),
      mc("Handling sensitive financial data on-site, essential practice?",
        ["Open access for all", "Auditable, least-privilege access with encryption", "Store it in plaintext", "Email extracts around"], 1,
        "Least-privilege, audited, encrypted access is foundational when handling sensitive financial data."),
      mc("Moving fast in a regulated customer environment, best approach?",
        ["Ignore their controls", "Work within controls, automate compliance evidence, prototype in safe environments", "Deploy straight to prod", "Avoid documentation"], 1,
        "Speed in regulated settings comes from working within controls and automating evidence, not skipping them."),
    ],
  },
  'E-commerce': {
    text: [
      "You're embedded with a retailer to unify inventory, orders, and analytics into one platform. Where do you start?",
      "A retail customer wants a custom solution before peak season. How do you deliver reliably under a hard deadline?",
      "How do you handle a retailer's data that's inconsistent across online and in-store systems?",
    ],
    mc: [
      mc("Integrating a retailer's fragmented systems, sensible first step?",
        ["Build the UI first", "Map data sources and establish a single source of truth", "Pick one system and ignore the rest", "Skip discovery"], 1,
        "Mapping sources and defining a canonical source of truth prevents downstream inconsistency."),
      mc("Delivering before peak season, risk management?",
        ["Add scope as you go", "Lock scope to must-haves, load-test, and leave buffer", "Deploy on Black Friday", "No testing"], 1,
        "A hard seasonal deadline demands tight scope, load testing, and buffer for the unexpected."),
      mc("Inconsistent online/in-store data, approach?",
        ["Pick whichever looks right", "Reconcile to a canonical model with validation rules", "Ignore in-store data", "Average the numbers"], 1,
        "Reconciling to a canonical model with validation resolves cross-channel inconsistency reliably."),
    ],
  },
};

const FDPM = {
  General: {
    text: [
      "You're embedded with a customer to understand their needs. How do you translate messy, on-the-ground requirements into a clear product direction?",
      "How do you balance building exactly what one customer wants against building a generalizable product?",
      "A customer demands a feature that doesn't fit the product vision. How do you handle it?",
      "How do you drive adoption of a deployed solution when end-users resist change?",
      "You sit between the customer and your engineering team. How do you manage competing priorities and expectations on both sides?",
    ],
    mc: [
      mc("Embedded with a customer, best way to capture true requirements?",
        ["Take their feature list at face value", "Observe real workflows and validate with prototypes", "Survey once", "Ask executives only"], 1,
        "Stated asks often miss the real need; observing workflows and prototyping surfaces what actually matters."),
      mc("One customer wants a bespoke feature. Key product concern?",
        ["Build it as a pure one-off", "Assess if the need is shared and generalize what's common", "Reject it outright", "Build for everyone blindly"], 1,
        "Distinguishing shared needs from true one-offs keeps the product generalizable and maintainable."),
      mc("A customer demand conflicts with product vision. Best move?",
        ["Just say no", "Understand the underlying need and find a vision-aligned solution", "Always comply", "Escalate immediately"], 1,
        "Digging into the underlying need usually reveals a solution that serves the customer and the vision."),
      mc("End-users resist a deployed tool. Most effective adoption lever?",
        ["Mandate it top-down", "Solve a real pain they feel and involve them early", "Add more features", "Ignore the resistance"], 1,
        "Adoption follows from solving felt pain and involving users early, not mandates or feature bloat."),
      mc("Caught between customer and engineering, key skill?",
        ["Take one side", "Translate needs both ways and manage expectations transparently", "Avoid both", "Promise everything"], 1,
        "An FDPM bridges both sides — translating needs and setting honest expectations in both directions."),
    ],
  },
  Healthcare: {
    text: [
      "You're embedded at a provider org. How do you translate clinician frustrations into a prioritized product roadmap?",
      "How do you balance one health system's custom needs against a scalable healthcare product?",
      "How do you drive clinician adoption of a tool that changes their workflow?",
    ],
    mc: [
      mc("Translating clinician frustrations to a roadmap, best input?",
        ["Executive guesses", "Direct observation + clinician interviews, prioritized by impact on care and burden", "Competitor copying", "Random requests"], 1,
        "Observation and clinician input, prioritized by care impact and workload, build a roadmap that lands."),
      mc("Balancing custom health-system needs vs scale, approach?",
        ["Hard-code each system", "A configurable platform over one-off builds", "Refuse customization", "Fork per customer"], 1,
        "Configurability lets you serve varied health systems without unscalable per-customer forks."),
      mc("Driving clinician adoption, top factor?",
        ["More dashboards", "Demonstrable reduction in their daily burden", "Mandates", "Longer training only"], 1,
        "Clinicians adopt tools that visibly reduce their daily burden, not ones that add work."),
    ],
  },
  Fintech: {
    text: [
      "You're embedded at a financial institution. How do you balance compliance-driven requirements with product simplicity?",
      "How do you prioritize when a financial customer's regulatory needs compete with usability?",
      "How do you manage the customer relationship when you must say no to a non-compliant feature request?",
    ],
    mc: [
      mc("Financial customer's compliance need vs simplicity, stance?",
        ["Skip compliance for UX", "Compliance is non-negotiable; design the simplest compliant experience", "Ignore UX entirely", "Let legal build it"], 1,
        "Compliance is a hard constraint; the craft is making the simplest experience that still satisfies it."),
      mc("Regulatory vs usability tradeoff, approach?",
        ["Drop the requirement", "Meet the requirement, then optimize UX within those constraints", "Ignore usability", "Delay indefinitely"], 1,
        "Satisfy the regulation first, then optimize the experience within the allowed design space."),
      mc("Saying no to a non-compliant request, best framing?",
        ["A flat no", "Explain the regulatory risk and offer a compliant alternative", "Pretend to agree", "Escalate without context"], 1,
        "Framing the no around concrete regulatory risk plus an alternative preserves trust and progress."),
    ],
  },
  'E-commerce': {
    text: [
      "You're embedded with a retailer. How do you translate their conversion and growth goals into product priorities?",
      "How do you balance a retailer's seasonal, urgent requests against long-term product health?",
      "How do you drive adoption of new tooling across a retailer's merchandising and ops teams?",
    ],
    mc: [
      mc("Translating a retailer's growth goals to product, key focus?",
        ["Vanity metrics", "Conversion/funnel metrics tied to revenue", "Page views only", "Internal opinions"], 1,
        "Revenue-linked conversion and funnel metrics keep product priorities aligned to the retailer's growth goals."),
      mc("Seasonal urgent requests vs long-term health, approach?",
        ["Always drop everything", "Triage by impact; protect platform health with clear tradeoff communication", "Ignore seasonality", "Say yes to all"], 1,
        "Impact-based triage with transparent tradeoffs balances urgent seasonal asks against long-term health."),
      mc("Driving cross-team adoption at a retailer, lever?",
        ["One generic rollout", "Show value in each team's own workflow", "Mandate from HQ", "More emails"], 1,
        "Adoption sticks when each team sees value inside their own workflow, not a one-size-fits-all push."),
    ],
  },
};

const TPM = {
  General: {
    text: [
      "You're running a program with 8 teams across 3 orgs and a hard ship date. How do you manage dependencies?",
      "How do you build and maintain a program status dashboard that leadership actually trusts?",
      "Walk me through your risk management framework. Give a real example of a risk that materialized.",
      "How do you decide when to cut scope vs. push the ship date vs. add resources?",
      "Describe a program that went off the rails. How did you detect it early and replan?",
    ],
    mc: [
      mc("8 teams, hard date. First tool for managing dependencies?",
        ["One giant group chat", "Critical path + dependency matrix with clear owners", "Hope teams self-coordinate", "Daily 2-hour all-hands"], 1,
        "Critical path + dependency mapping surfaces what blocks what and where slippage threatens the date."),
      mc("What makes a status dashboard leadership trusts?",
        ["Only green statuses", "Leading indicators, honest risk signals, consistent definitions", "Vague updates", "Quarterly refresh"], 1,
        "Trust comes from leading indicators and honest red/yellow signals, not vanity dashboards."),
      mc("Core artifact of structured risk management?",
        ["A risk register with likelihood, impact, owner, mitigation", "A mental note", "A kickoff email", "Reacting when it breaks"], 0,
        "A living risk register enables proactive management of each risk's likelihood, impact, and mitigation."),
      mc("Behind schedule. Per Brooks's Law, often the WORST option?",
        ["Cut scope", "Add many new engineers late", "Push the date", "Re-sequence work"], 1,
        "Adding people to a late project often slows it further due to onboarding and communication overhead."),
      mc("How to detect a program going off the rails early?",
        ["Wait for the final milestone", "Track leading indicators (velocity, blocker age, scope creep)", "Ask at status meetings only", "Assume no news is good news"], 1,
        "Leading indicators reveal trouble weeks before a missed milestone makes it obvious."),
    ],
  },
  Healthcare: {
    text: [
      "You're coordinating a rollout of a new clinical system across multiple hospital sites. How do you manage stakeholders, compliance, and phased deployment?",
      "How do you run a program that depends on integrating with several external EHR vendors with different timelines?",
      "A compliance audit is scheduled mid-program. How do you ensure readiness without derailing delivery?",
    ],
    mc: [
      mc("Rolling out a clinical system across sites, best deployment approach?",
        ["Big-bang to all sites at once", "Phased rollout with a pilot site and clinical validation gates", "Let each site self-install", "Deploy without clinician input"], 1,
        "A phased rollout with a pilot limits patient-safety risk and lets you learn before scaling."),
      mc("Depending on multiple EHR vendors with different timelines, key tool?",
        ["Assume all deliver on time", "Vendor-specific milestone tracking with contingency plans", "One shared deadline", "No tracking"], 1,
        "External vendor timelines aren't yours to control; track milestones per vendor with contingencies."),
      mc("A compliance audit lands mid-program. Best stance?",
        ["Pause all delivery", "Treat compliance evidence as a tracked workstream from the start", "Scramble the week before", "Ignore it"], 1,
        "Continuously gathering compliance evidence avoids last-minute scrambles and delivery disruption."),
    ],
  },
  Fintech: {
    text: [
      "You're driving a program to obtain a financial compliance certification with a hard regulatory deadline. How do you plan and de-risk it?",
      "How do you coordinate a migration to a new payment processor across teams without disrupting live transactions?",
      "A regulator changes requirements mid-program. How do you absorb the change and keep the deadline?",
    ],
    mc: [
      mc("A regulatory deadline is fixed. Your planning posture?",
        ["Treat it like a soft date", "Plan backward from the date with buffer and a compliance-evidence workstream", "Start late", "Assume an extension"], 1,
        "Regulatory deadlines rarely move; plan backward with buffer and continuous evidence-gathering."),
      mc("Migrating to a new payment processor on live traffic, safest approach?",
        ["Cut over all at once", "Gradual traffic shifting with parallel-run and reconciliation", "Migrate during peak", "No rollback plan"], 1,
        "Gradual cutover with parallel-run lets you reconcile and roll back before fully trusting the new processor."),
      mc("A regulator changes requirements mid-program. First move?",
        ["Ignore it", "Assess impact, re-baseline, and communicate to stakeholders", "Hide it from leadership", "Cancel the program"], 1,
        "Assess impact, re-baseline transparently, and communicate — regulatory change is a managed risk."),
    ],
  },
  'E-commerce': {
    text: [
      "You own peak-season (Black Friday) readiness across engineering, ops, and support. How do you run the program?",
      "How do you coordinate a re-platforming of the checkout system across teams without hurting conversion?",
      "A key third-party integration is at risk weeks before peak. How do you respond?",
    ],
    mc: [
      mc("Running peak-season readiness, most useful cross-team artifact?",
        ["A motivational poster", "A readiness checklist with load tests, runbooks, and go/no-go gates", "A single email", "Nothing"], 1,
        "Readiness needs explicit checklists, load-test sign-offs, runbooks, and go/no-go gates across teams."),
      mc("Re-platforming checkout without hurting conversion, safest approach?",
        ["Switch everyone at once", "Gradual rollout with A/B measurement of conversion impact", "Launch at peak", "No measurement"], 1,
        "Gradual rollout with conversion A/B testing catches regressions before they hit all revenue."),
      mc("A critical integration is at risk weeks before peak. First move?",
        ["Wait and see", "Escalate, assess impact, and activate a contingency/fallback plan", "Hide it", "Cancel peak"], 1,
        "Surface the risk early, assess impact, and stand up a fallback — peak dates don't move."),
    ],
  },
};

export const QUESTION_BANK = {
  'General':     { 'AI Solutions Architect': AISA.General,     'Forward Deployed Engineer': FDE.General,     'Forward Deployed Product Manager': FDPM.General,     'Technical Program Manager': TPM.General },
  'Healthcare':  { 'AI Solutions Architect': AISA.Healthcare,  'Forward Deployed Engineer': FDE.Healthcare,  'Forward Deployed Product Manager': FDPM.Healthcare,  'Technical Program Manager': TPM.Healthcare },
  'Fintech':     { 'AI Solutions Architect': AISA.Fintech,     'Forward Deployed Engineer': FDE.Fintech,     'Forward Deployed Product Manager': FDPM.Fintech,     'Technical Program Manager': TPM.Fintech },
  'E-commerce':  { 'AI Solutions Architect': AISA['E-commerce'],'Forward Deployed Engineer': FDE['E-commerce'],'Forward Deployed Product Manager': FDPM['E-commerce'],'Technical Program Manager': TPM['E-commerce'] },
};
