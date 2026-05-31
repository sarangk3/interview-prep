/* Question bank: Industry → Role → { text, mc } */

export const INDUSTRIES = ['General', 'Healthcare', 'Fintech', 'E-commerce'];
export const ROLES = ['AI Solutions Architect', 'Forward Deployed Engineer', 'Forward Deployed Product Manager', 'Technical Program Manager'];

const mc = (q, options, correct, explanation) => ({ q, options, correct, explanation });

/* ── Reusable role blocks per industry ── */

const AISA = {
  General: {
    text: [
      "Design a RAG (retrieval-augmented generation) system over a company's internal knowledge base. Walk through chunking, embeddings, retrieval, and how you'd reduce hallucinations.",
      "A client wants an LLM-powered assistant. How do you decide between prompting, RAG, and fine-tuning, and what are the tradeoffs?",
      "Design an evaluation framework for an LLM application where there's no single ground-truth answer. How do you measure quality and catch regressions?",
      "How do you architect an agentic AI system that calls tools and takes multi-step actions reliably? How do you handle failures and guardrails?",
      "A client's AI feature is too slow and too expensive at scale. Walk me through how you'd cut latency and cost without sacrificing quality.",
    ],
    mc: [
      mc("A client needs an AI assistant that can answer questions using their internal documents, which are updated every week. What is the most effective architectural approach?",
        ["Fine-tune a model weekly", "Retrieval-augmented generation (RAG)", "Prompt with no external data", "Train a model from scratch"], 1,
        "RAG keeps knowledge fresh without retraining. Fine-tuning bakes in static knowledge and is costly to update weekly."),
      mc("Your RAG system keeps returning chunks that are not relevant to the user's question. You have limited time to improve it. What is the single most impactful change you would make first?",
        ["Use a bigger LLM", "Improve chunking, embeddings, and add reranking", "Write longer prompts", "Increase temperature"], 1,
        "Garbage retrieval yields garbage generation. Fix retrieval quality before reaching for a larger model."),
      mc("Your RAG-powered assistant is occasionally generating answers that are not grounded in the retrieved documents. What is the most effective way to reduce hallucinations in this context?",
        ["Raise temperature", "Ground answers in retrieved context, cite sources, allow 'I don't know'", "Remove the retrieval step", "Make the prompt vaguer"], 1,
        "Grounding in retrieved context with citations and an explicit 'I don't know' path curbs fabrication."),
      mc("You are evaluating an LLM-powered application where there is no single correct answer to judge responses against. What is the most reliable evaluation approach for this situation?",
        ["Eyeball a few outputs once", "Curated eval set with LLM-as-judge + human review + task metrics", "Trust the model", "Only measure latency"], 1,
        "A curated eval set scored by a mix of LLM-as-judge, humans, and task metrics catches regressions reliably."),
      mc("An AI feature you deployed is working well technically, but the inference cost is unsustainable at the scale the product team wants to reach. What is the most effective lever to bring costs under control?",
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
      mc("You are designing a system that runs an LLM over clinical notes containing protected health information. What is the most critical requirement before you can proceed?",
        ["Send notes to any public API", "Process within a HIPAA-compliant environment under a BAA", "Email notes to the model vendor", "Skip access controls"], 1,
        "PHI must stay within a HIPAA-compliant, BAA-covered environment, not sent to non-compliant endpoints."),
      mc("Your team has built an AI system to assist with clinical coding. Reviewers are skeptical and slow to trust its outputs. What is the most important design feature to build trust with human reviewers?",
        ["Hiding its reasoning", "Surfacing supporting evidence/citations from the chart for human verification", "Auto-submitting codes", "Higher temperature"], 1,
        "Showing the chart evidence behind each suggested code lets a human verify, essential for auditable coding."),
      mc("A healthcare client wants to deploy an LLM chatbot that provides medical information directly to patients without a clinician in the loop. What is the most significant risk you would raise with them?",
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
      mc("You are deploying an AI assistant inside a retail bank that will help customers with account questions. What is the single most important guardrail to implement before launch?",
        ["Let it answer anything", "Restrict scope, ground in approved content, block unauthorized advice and data leakage", "Disable logging", "Maximize creativity"], 1,
        "Banking assistants need tight scope, grounding, and controls against incorrect advice and data exposure."),
      mc("A financial institution wants to use a machine learning model alone to make fraud detection decisions. Why would you recommend pairing ML scoring with a rules-based layer rather than relying on the model alone?",
        ["Rules are useless", "Rules catch known patterns deterministically; ML generalizes, together they balance precision/recall", "ML alone is always enough", "To slow it down"], 1,
        "Deterministic rules plus generalizing ML balance catching known and novel fraud while controlling false positives."),
      mc("You need to extract structured financial data from thousands of PDF documents that vary in format and layout. What is the most robust approach to handle the inevitable edge cases?",
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
      mc("You are building an AI shopping assistant and the client's top concern is that it must never recommend products that do not exist in their catalog. What design pattern most reliably prevents this?",
        ["Let it free-generate SKUs", "Ground responses in the live catalog via retrieval/tools", "Ignore inventory", "Hard-code 10 products"], 1,
        "Grounding in a live product catalog via retrieval/tools prevents the assistant from inventing products or prices."),
      mc("A retailer's product search is returning poor results for natural language queries like "comfortable summer dress for a beach wedding." What is the most impactful technique to improve semantic search quality?",
        ["Exact keyword match only", "Embedding-based retrieval with reranking, blended with business signals", "Random ordering", "Alphabetical only"], 1,
        "Embedding retrieval plus reranking and business signals captures intent far better than keyword matching alone."),
      mc("You are generating product descriptions for 500,000 SKUs using an LLM. The client needs consistent quality across all outputs. What is your quality control strategy at this scale?",
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
      mc("You are starting an engagement and the customer's stakeholders cannot clearly articulate what they need from the system. They keep describing symptoms rather than requirements. What is your best first move?",
        ["Write a 30-page spec first", "Observe their real workflow and build a quick prototype to react to", "Wait for them to figure it out", "Build what you assume they want"], 1,
        "Forward-deployed work thrives on observing real workflows and iterating on prototypes, not upfront specs."),
      mc("You arrive at a customer site and discover that their data is messy, inconsistently formatted, and largely undocumented. You still need to build a reliable data pipeline. What is your approach?",
        ["Assume it's clean", "Build with schema validation, data-quality checks, and observability", "Skip validation to move fast", "Hardcode the happy path"], 1,
        "Validation, quality checks, and observability surface bad data early instead of failing silently downstream."),
      mc("You built a custom feature for one customer six months ago. You are now hearing that three other customers are asking for something very similar. What is the right move?",
        ["Keep rebuilding it per customer", "Generalize it and push into the core platform", "Refuse all of them", "Ignore the pattern"], 1,
        "Recurring custom needs should be generalized into the platform to avoid maintaining many one-offs."),
      mc("You have a live demo with the customer's executive team in three days. The integration you were counting on just broke and the fix timeline is unclear. How do you triage this situation?",
        ["Try to fix everything", "Scope to the critical path that proves value; mock non-essential parts", "Cancel the demo", "Show a slide deck only"], 1,
        "Focus on the critical path that demonstrates value and stub the rest to deliver something credible on time."),
      mc("Forward-deployed work often produces code that is tightly coupled to one customer's environment and hard to reuse. How do you mitigate this risk without slowing down delivery?",
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
      mc("You are about to access a health system's patient data on-site to build an AI pipeline. Before touching anything, what is the first requirement you need to confirm is in place?",
        ["Grab whatever you can", "Proper data-use agreements/BAA and least-privilege PHI access", "Use a personal laptop", "Disable audit logs"], 1,
        "PHI access requires the right agreements and least-privilege, audited access before any integration."),
      mc("The health system you are working with has a legacy EHR that has no clean API and the vendor is unresponsive. You still need to integrate with it. What is the most pragmatic approach?",
        ["Scrape the UI insecurely", "Use available interfaces (HL7/FHIR, secure extracts) with validation", "Copy the database to a USB", "Skip integration"], 1,
        "Lean on standard interfaces and secure extracts with validation rather than insecure scraping of PHI."),
      mc("The clinicians who will use the AI tool you are deploying are openly skeptical and resistant to change. What is the most effective tactic to build genuine buy-in rather than just compliance?",
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
      mc("You are integrating an AI feature with a bank's core transaction processing systems. What is the single most important constraint you need to respect throughout the build?",
        ["Move fast and skip process", "Their change-control and compliance processes", "Their lunch schedule", "Nothing"], 1,
        "Regulated customers have change-control and compliance you must align delivery to, not bypass."),
      mc("You are working on-site at a financial institution with access to sensitive customer financial data. What is the most essential practice to follow throughout the engagement?",
        ["Open access for all", "Auditable, least-privilege access with encryption", "Store it in plaintext", "Email extracts around"], 1,
        "Least-privilege, audited, encrypted access is foundational when handling sensitive financial data."),
      mc("Your customer is in a heavily regulated industry and their legal and compliance teams are creating significant delays. How do you maintain delivery speed without creating risk for the customer?",
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
      mc("A retailer's data lives across five different systems that were not designed to work together. You need to build an AI feature that draws from all of them. What is the most sensible first step?",
        ["Build the UI first", "Map data sources and establish a single source of truth", "Pick one system and ignore the rest", "Skip discovery"], 1,
        "Mapping sources and defining a canonical source of truth prevents downstream inconsistency."),
      mc("You need to deliver an AI feature for a retailer before their peak holiday season, which is eight weeks away. The timeline is tight. How do you manage delivery risk?",
        ["Add scope as you go", "Lock scope to must-haves, load-test, and leave buffer", "Deploy on Black Friday", "No testing"], 1,
        "A hard seasonal deadline demands tight scope, load testing, and buffer for the unexpected."),
      mc("A retailer's online and in-store systems hold conflicting data about the same products and customers. Your AI feature depends on both. How do you approach this data consistency problem?",
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
      mc("You are embedded at a customer site. Stakeholders give you conflicting answers about what they need, and what they say they want keeps changing. What is the most reliable way to capture the true requirements?",
        ["Take their feature list at face value", "Observe real workflows and validate with prototypes", "Survey once", "Ask executives only"], 1,
        "Stated asks often miss the real need; observing workflows and prototyping surfaces what actually matters."),
      mc("A high-value customer is requesting a feature that would require significant engineering effort and would only apply to their specific workflow. What is the key product question you need to answer before agreeing to build it?",
        ["Build it as a pure one-off", "Assess if the need is shared and generalize what's common", "Reject it outright", "Build for everyone blindly"], 1,
        "Distinguishing shared needs from true one-offs keeps the product generalizable and maintainable."),
      mc("A customer is requesting a feature that directly conflicts with where your product is headed. They are threatening to churn if you don't build it. What is your best move?",
        ["Just say no", "Understand the underlying need and find a vision-aligned solution", "Always comply", "Escalate immediately"], 1,
        "Digging into the underlying need usually reveals a solution that serves the customer and the vision."),
      mc("You have deployed an AI tool at a customer site, but end-users are ignoring it and continuing with their old workflow. Leadership is frustrated. What is the most effective lever for driving genuine adoption?",
        ["Mandate it top-down", "Solve a real pain they feel and involve them early", "Add more features", "Ignore the resistance"], 1,
        "Adoption follows from solving felt pain and involving users early, not mandates or feature bloat."),
      mc("The customer is pushing hard for additional scope and your engineering team is telling you the timeline is already at risk. You are caught in the middle. What is the key skill that gets you through this situation?",
        ["Take one side", "Translate needs both ways and manage expectations transparently", "Avoid both", "Promise everything"], 1,
        "An FDPM bridges both sides, translating needs and setting honest expectations in both directions."),
    ],
  },
  Healthcare: {
    text: [
      "You're embedded at a provider org. How do you translate clinician frustrations into a prioritized product roadmap?",
      "How do you balance one health system's custom needs against a scalable healthcare product?",
      "How do you drive clinician adoption of a tool that changes their workflow?",
    ],
    mc: [
      mc("You are capturing product requirements from clinicians who are frustrated with the current system. Their feedback is emotional and vague. How do you translate this into a clear product roadmap?",
        ["Executive guesses", "Direct observation + clinician interviews, prioritized by impact on care and burden", "Competitor copying", "Random requests"], 1,
        "Observation and clinician input, prioritized by care impact and workload, build a roadmap that lands."),
      mc("A health system wants you to build something that is very specific to their workflows and would be hard to generalize to other customers. How do you balance meeting their needs while building something that can scale?",
        ["Hard-code each system", "A configurable platform over one-off builds", "Refuse customization", "Fork per customer"], 1,
        "Configurability lets you serve varied health systems without unscalable per-customer forks."),
      mc("Research consistently shows that clinician adoption is the biggest predictor of whether health AI deployments succeed or fail. What is the single most important factor in driving clinician adoption?",
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
      mc("A financial services customer wants a feature that would significantly improve the user experience, but their compliance team says it violates internal policy. How do you navigate this?",
        ["Skip compliance for UX", "Compliance is non-negotiable; design the simplest compliant experience", "Ignore UX entirely", "Let legal build it"], 1,
        "Compliance is a hard constraint; the craft is making the simplest experience that still satisfies it."),
      mc("You are building a product that serves a regulated industry. There is a direct tension between what makes the product easy to use and what regulators require. How do you approach this tradeoff?",
        ["Drop the requirement", "Meet the requirement, then optimize UX within those constraints", "Ignore usability", "Delay indefinitely"], 1,
        "Satisfy the regulation first, then optimize the experience within the allowed design space."),
      mc("A customer is asking you to build something that would violate regulatory requirements. They are not aware of the compliance issue. How do you frame the conversation when you push back?",
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
      mc("A retail customer has given you a broad mandate: "help us grow." They have not given you specific requirements. How do you translate this vague goal into a focused product scope?",
        ["Vanity metrics", "Conversion/funnel metrics tied to revenue", "Page views only", "Internal opinions"], 1,
        "Revenue-linked conversion and funnel metrics keep product priorities aligned to the retailer's growth goals."),
      mc("It is three months before peak season and a retailer is asking you to add features to the AI system at the expense of technical debt that is already causing instability. How do you approach this?",
        ["Always drop everything", "Triage by impact; protect platform health with clear tradeoff communication", "Ignore seasonality", "Say yes to all"], 1,
        "Impact-based triage with transparent tradeoffs balances urgent seasonal asks against long-term health."),
      mc("You have built an AI tool that the merchandising team loves, but the operations and store teams are not using it. Their cooperation is essential for the tool to deliver its full value. What is your lever for driving adoption across teams?",
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
      mc("You are running a program with 8 engineering teams and a hard external deadline. After your first week of conversations, you can already see that teams have made assumptions about each other's deliverables that do not match. What is the first tool you create?",
        ["One giant group chat", "Critical path + dependency matrix with clear owners", "Hope teams self-coordinate", "Daily 2-hour all-hands"], 1,
        "Critical path + dependency mapping surfaces what blocks what and where slippage threatens the date."),
      mc("You have been asked to create a program status dashboard for weekly leadership reviews. Previous dashboards have been ignored because they were seen as unreliable. What is the most important quality that makes a status dashboard leadership actually trusts?",
        ["Only green statuses", "Leading indicators, honest risk signals, consistent definitions", "Vague updates", "Quarterly refresh"], 1,
        "Trust comes from leading indicators and honest red/yellow signals, not vanity dashboards."),
      mc("You are running a complex multi-team technical program and want to implement structured risk management. Beyond the status report, what is the core artifact you would create and maintain throughout the program?",
        ["A risk register with likelihood, impact, owner, mitigation", "A mental note", "A kickoff email", "Reacting when it breaks"], 0,
        "A living risk register enables proactive management of each risk's likelihood, impact, and mitigation."),
      mc("Your program is behind schedule and the executive team is pushing to add engineers to speed things up. You know Brooks's Law. What is the argument you make against this approach, and what does Brooks's Law actually say about adding people to a late project?",
        ["Cut scope", "Add many new engineers late", "Push the date", "Re-sequence work"], 1,
        "Adding people to a late project often slows it further due to onboarding and communication overhead."),
      mc("You have been burned before by programs that looked fine in status reports but were actually in serious trouble. What early warning signals do you look for to detect a program going off the rails before it becomes a crisis?",
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
      mc("You are rolling out a new clinical AI system across 12 hospital sites. All sites need to be live within six months. What deployment approach gives you the best chance of success while managing risk?",
        ["Big-bang to all sites at once", "Phased rollout with a pilot site and clinical validation gates", "Let each site self-install", "Deploy without clinician input"], 1,
        "A phased rollout with a pilot limits patient-safety risk and lets you learn before scaling."),
      mc("Your program depends on integrations with three different EHR vendors, each running on their own timeline with different levels of responsiveness. How do you manage this dependency risk?",
        ["Assume all deliver on time", "Vendor-specific milestone tracking with contingency plans", "One shared deadline", "No tracking"], 1,
        "External vendor timelines aren't yours to control; track milestones per vendor with contingencies."),
      mc("Your program is in full execution when the customer announces an unplanned compliance audit that will require significant time from the engineers you depend on. The audit will last three weeks. What is your stance and response?",
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
        "Assess impact, re-baseline transparently, and communicate, regulatory change is a managed risk."),
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
        "Surface the risk early, assess impact, and stand up a fallback, peak dates don't move."),
    ],
  },
};

export const QUESTION_BANK = {
  'General':     { 'AI Solutions Architect': AISA.General,     'Forward Deployed Engineer': FDE.General,     'Forward Deployed Product Manager': FDPM.General,     'Technical Program Manager': TPM.General },
  'Healthcare':  { 'AI Solutions Architect': AISA.Healthcare,  'Forward Deployed Engineer': FDE.Healthcare,  'Forward Deployed Product Manager': FDPM.Healthcare,  'Technical Program Manager': TPM.Healthcare },
  'Fintech':     { 'AI Solutions Architect': AISA.Fintech,     'Forward Deployed Engineer': FDE.Fintech,     'Forward Deployed Product Manager': FDPM.Fintech,     'Technical Program Manager': TPM.Fintech },
  'E-commerce':  { 'AI Solutions Architect': AISA['E-commerce'],'Forward Deployed Engineer': FDE['E-commerce'],'Forward Deployed Product Manager': FDPM['E-commerce'],'Technical Program Manager': TPM['E-commerce'] },
};

/* ── Opening problems for Mock Interview mode ── */
export const OPENING_PROBLEMS = {
  'AI Solutions Architect': {
    'General':     { title: 'Enterprise AI Knowledge Assistant', problem: "A 600-person professional services firm wants to build an internal AI assistant that can answer questions using their 10 years of project documentation, client reports, and internal wikis. Employees waste 2 hours a day searching for information. Walk me through how you'd approach this." },
    'Healthcare':  { title: 'Clinical Documentation AI', problem: "A large academic medical center wants to deploy an AI system to help physicians reduce clinical documentation time by 50%. Physicians currently spend 3 hours per day on notes. Walk me through how you'd design this system." },
    'Fintech':     { title: 'Real-Time Fraud Detection', problem: "A digital bank processing 5 million transactions daily wants to build an AI-powered fraud detection system that makes decisions in under 100ms with a false positive rate below 0.1%. Walk me through your approach." },
    'E-commerce':  { title: 'AI Shopping Assistant', problem: "A fashion marketplace with 20 million SKUs and 15 million monthly active users wants to build a personalized AI shopping assistant that improves conversion by 15%. Walk me through how you'd approach this." },
  },
  'Forward Deployed Engineer': {
    'General':     { title: 'Supply Chain Visibility Platform', problem: "A Fortune 500 manufacturing company wants a real-time supply chain visibility platform. They have 12 legacy ERP systems, no unified API layer, inconsistent data formats, and need a working MVP in 90 days. Where do you start?" },
    'Healthcare':  { title: 'Multi-EHR Patient Data Unification', problem: "A regional hospital network wants to unify patient records across 6 different EHR systems to enable care coordination. Their IT team is understaffed, change-averse, and two of the systems are 15 years old with no modern APIs. Walk me through your approach." },
    'Fintech':     { title: 'Real-Time Lending Risk Dashboard', problem: "A regional bank wants a real-time lending risk dashboard pulling data from 4 core banking systems. Their data is inconsistent, partially in mainframes, and they have a board presentation in 60 days. Where do you start?" },
    'E-commerce':  { title: 'Omnichannel Inventory Unification', problem: "A large retailer wants to unify online and in-store inventory across 400 locations into a single real-time view. They have 8 existing systems, seasonal peak in 10 weeks, and their current inventory accuracy is 73%. Walk me through your approach." },
  },
  'Forward Deployed Product Manager': {
    'General':     { title: 'Enterprise Churn Crisis', problem: "A Series B SaaS company brought you in, their enterprise customers are churning at 30% annually and they don't know why. You have 60 days, full access to customers, data, and engineering. Walk me through how you'd approach diagnosing and fixing this." },
    'Healthcare':  { title: 'Clinical Platform Adoption Crisis', problem: "A health system deployed your care coordination platform to 300 clinicians 4 months ago. Adoption is at 25% and declining. The CMO is losing patience and threatening to pull the contract. Walk me through how you'd diagnose and turn this around." },
    'Fintech':     { title: 'SMB Lending Product Strategy', problem: "A digital lending startup wants to expand from consumer personal loans into SMB lending. You're embedded with them for 90 days to define the product strategy and go-to-market approach. Walk me through how you'd tackle this." },
    'E-commerce':  { title: 'Marketplace Seller Satisfaction Crisis', problem: "A marketplace with 3 million sellers has seen seller satisfaction drop 20% in 6 months and churn is accelerating. You're embedded to diagnose the problem and build a roadmap. Walk me through your approach." },
  },
  'Technical Program Manager': {
    'General':     { title: 'Failing Platform Migration', problem: "You've just taken over as TPM for a 12-team, 18-month platform migration. It's 4 months in, 6 weeks behind schedule, there's no dependency map, and three teams are blocked on each other. Walk me through how you'd stabilize this program." },
    'Healthcare':  { title: 'Clinical System Multi-Site Rollout', problem: "You're leading the rollout of a new clinical decision support system across 8 hospital sites with a hard regulatory compliance deadline in 5 months. Two sites are actively resisting. Walk me through how you'd run this program." },
    'Fintech':     { title: 'Compliance + Migration Collision', problem: "You're driving a PCI-DSS Level 1 recertification across 6 engineering teams while simultaneously migrating to a new payment processor. Both have hard deadlines in the same quarter and are competing for the same engineers. Walk me through your approach." },
    'E-commerce':  { title: 'Black Friday Readiness at Risk', problem: "You're the TPM for peak-season readiness at a major retailer. It's September, Black Friday is 11 weeks away, 4 critical integrations aren't finished, load tests haven't started, and two team leads just gave notice. Walk me through how you'd run this." },
  },
};

/* ── Target solutions for Mock Interview mode ──
   Each has:
   - keyComponents: the specific things a strong answer must cover (used to steer the interviewer)
   - idealSolution: the full model answer shown on the results page
   - hints: progressive hints the interviewer can drop if candidate is off track
*/
export const MOCK_TARGETS = {
  'AI Solutions Architect': {
    'General': {
      keyComponents: [
        'Document chunking strategy (semantic vs fixed-size, overlap)',
        'Embedding model selection and vector store (e.g. Pinecone, pgvector)',
        'Retrieval pipeline with hybrid search (semantic + keyword)',
        'Reranking layer to improve precision',
        'LLM orchestration with citation and grounding',
        'Evaluation framework (retrieval recall, answer faithfulness, latency)',
        'Access control, not every employee should see every document',
      ],
      idealSolution: `The core architecture is a RAG (retrieval-augmented generation) pipeline. Documents are ingested, chunked semantically (500–1000 tokens with overlap), and embedded using a model like text-embedding-3-small. Embeddings are stored in a vector database (pgvector or Pinecone). At query time, hybrid search combines dense vector retrieval with BM25 keyword search, then a reranker (e.g. Cohere Rerank) improves precision. The top-k chunks are injected into an LLM prompt with a strict grounding instruction: only answer from retrieved context, cite sources, say "I don't know" if nothing is found. Access control is enforced at retrieval time, filter by document permissions before returning chunks. The evaluation framework tracks retrieval recall@k, answer faithfulness (does the answer match retrieved context?), and latency p95. Fine-tuning is not needed for V1, good chunking and retrieval outperform fine-tuning at this stage.`,
      hints: [
        'Think about how documents get broken up before they can be searched',
        'How does the system find relevant documents, what does similarity search actually mean here?',
        'What stops the model from making things up that aren\'t in the documents?',
        'If an employee can\'t see a document normally, should they be able to ask the AI about it?',
        'How would you know if the system is giving bad answers before users complain?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'PHI must stay within HIPAA-compliant, BAA-covered environment',
        'Ambient AI listening during visit (not post-hoc transcription only)',
        'Structured note generation: SOAP format from conversation',
        'Physician review and one-click edit before signing',
        'EHR integration via FHIR to auto-populate structured fields',
        'Hallucination guardrails: only document what was explicitly said',
        'Audit trail for every generated and edited note',
      ],
      idealSolution: `The system uses ambient AI, a microphone captures the physician-patient conversation in real time within a HIPAA-compliant, BAA-covered cloud environment. Speech is transcribed and processed by an LLM fine-tuned or prompted to generate structured SOAP notes. Critically, the model is instructed to only document what was explicitly stated, hallucination here is a patient safety risk. The draft note is surfaced to the physician immediately post-visit for review and one-click editing before it's signed. Structured data (diagnosis codes, medications, vitals) are extracted and pushed to the EHR via FHIR APIs to auto-populate structured fields rather than relying on free-text alone. Every generated note, edit, and sign-off is logged in an immutable audit trail. Success is measured by time-to-signed-note per encounter and physician edit rate (proxy for accuracy).`,
      hints: [
        'When in the clinical workflow does the AI actually listen, before, during, or after the visit?',
        'SOAP notes have specific structure, how does the AI know what goes where?',
        'What\'s the patient safety risk if the AI documents something that wasn\'t actually said?',
        'How does the structured data get into the EHR system itself, not just as a text note?',
        'How would a physician trust this enough to actually use it?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Two-layer architecture: fast ML model (<10ms) + slower LLM anomaly explainer',
        'Feature engineering: velocity, geolocation delta, merchant category, device fingerprint',
        'Real-time feature store for sub-100ms retrieval',
        'Gradient boosted model (XGBoost/LightGBM) for primary scoring',
        'LLM for explainability and edge case triage, not primary detection',
        'Feedback loop: analyst decisions retrain the model weekly',
        'False positive budget, blocking legit transactions is also costly',
      ],
      idealSolution: `The architecture is two-layer. Layer 1 is a gradient boosted model (XGBoost or LightGBM) that scores every transaction in under 10ms using a real-time feature store, features include transaction velocity (5/15/60 min windows), geolocation delta from last transaction, merchant category risk score, device fingerprint, and amount z-score against user history. Transactions above a threshold are blocked or flagged; borderline cases go to Layer 2. Layer 2 uses an LLM to synthesize signals and generate a human-readable explanation for analyst review, the LLM is not in the primary detection path because it can't hit 100ms. Analysts review flagged transactions and their decisions feed back into weekly model retraining. The false positive rate is as important as the true positive rate, blocking a legitimate transaction destroys trust. The system is monitored via precision/recall on a labeled holdout set, with concept drift detection to catch when fraud patterns shift.`,
      hints: [
        'Can an LLM actually make a decision in under 100ms? What does that mean for your architecture?',
        'What signals tell you a transaction is suspicious before you have a label for it?',
        'How does the model get better over time as fraud patterns change?',
        'Blocking a legitimate transaction has a cost too, how do you think about that tradeoff?',
        'How does an analyst actually review a flagged transaction, what do they see?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Candidate generation (collaborative filtering or two-tower model) separate from ranking',
        'Multi-signal ranking: purchase history, browse history, explicit ratings, trending',
        'Embedding-based semantic search for natural language queries',
        'Business constraints layer: margin, inventory, sponsored products',
        'A/B testing framework to measure conversion lift, not just CTR',
        'Cold start solution for new users and new products',
        'Real-time vs batch inference tradeoff',
      ],
      idealSolution: `The system separates candidate generation from ranking. Candidate generation uses a two-tower neural network trained on purchase and browse history, one tower encodes the user, one encodes items, and dot product similarity retrieves top-500 candidates in milliseconds from an ANN index (Faiss or ScaNN). The ranking layer scores those 500 with a more complex model incorporating explicit signals (purchases, wishlists), implicit signals (dwell time, scroll depth), item features (margin, inventory level), and contextual signals (time of day, device). For the shopping assistant specifically, a semantic search layer maps natural language queries to item embeddings, enabling "show me something for a beach vacation under $50" queries. Business constraints (sponsored products, inventory limits, margin floors) are applied as a post-ranking filter. Cold start is handled via popularity-based fallback for new users and content-based similarity for new products. All changes are validated via A/B tests measuring conversion rate and revenue per session, not just CTR.`,
      hints: [
        'Ranking 20 million items for every user in real time isn\'t feasible, how do you narrow it down first?',
        'Purchase history is the strongest signal, but what do you do with a new user who has none?',
        'The business wants to promote high-margin items even if they\'re not the best recommendation, how do you handle that?',
        'How do you know if the recommendation system is actually better, not just getting more clicks?',
        'A new product has no purchase history, how does it get recommended at all?',
      ],
    },
  },

  'Forward Deployed Engineer': {
    'General': {
      keyComponents: [
        'Discovery first: map all 12 systems, identify the 2-3 with the richest data',
        'Don\'t boil the ocean, pick one high-value data flow for the MVP',
        'Thin integration layer (event bus or API gateway) not a full ETL rewrite',
        'Define "visibility" concretely with the stakeholder before building',
        'Incremental delivery: working dashboard in 30 days, not 90',
        'Data quality validation at ingestion, not at query time',
        'Change management, 12 systems means 12 teams who need to cooperate',
      ],
      idealSolution: `Start with a discovery sprint, 2 weeks mapping all 12 systems, their data models, owners, and update frequencies. Don't try to integrate everything. Identify the 2-3 systems that hold the most operationally critical data (typically order management, inventory, and shipping). Define "visibility" concretely with the business stakeholder: what decisions will they make with this dashboard that they can't make today? Build a thin integration layer, an event bus (Kafka or cloud pub/sub) that systems publish to rather than a heavyweight ETL pipeline. MVP in 30 days: one working data flow, one dashboard screen, real data. Validate data quality at ingestion with schema checks and alerting, not at query time. The hardest problem is change management, 12 legacy systems means 12 teams, and at least 3 will be uncooperative. Establish a single executive sponsor who can unblock access. Deliver incrementally, adding data flows every 2 weeks, so the business sees value before the 90-day deadline.`,
      hints: [
        'You have 12 systems, where do you actually start on day one?',
        'What does "supply chain visibility" actually mean in terms of a specific decision the business makes today that they can\'t?',
        'A full ETL rewrite of 12 systems would take a year, what\'s the thinnest possible integration that still delivers value?',
        'What happens when the team that owns system #7 won\'t give you API access?',
        'How do you show value before the 90 days are up so the project doesn\'t get cancelled?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Start with a read-only integration, don\'t write back to EHRs initially',
        'HL7 FHIR R4 as the canonical data model for patient data',
        'Master Patient Index (MPI) to deduplicate patients across systems',
        'Proper data use agreements and BAA before touching any PHI',
        'Work with IT champions inside the hospital, not around them',
        'Pilot with one site, one use case before expanding',
        'Clinician workflow, the integration must fit into existing clinical flow',
      ],
      idealSolution: `Before touching any data, get signed data use agreements and BAA for every facility. Then run a 2-week discovery: audit each EHR's available interfaces (most support HL7 FHIR R4 or at minimum HL7 v2 feeds), document what patient data each holds, and identify IT champions at each site who will advocate internally. Start read-only, pull data from each EHR via FHIR APIs into a unified patient record store, mapping to a canonical FHIR R4 data model. The hardest problem is patient matching: the same patient exists in all 6 systems with slightly different demographics. Build a probabilistic Master Patient Index using name, DOB, address, and MRN to create a unified patient ID. Pilot with one site and one clinical use case (e.g., care transitions). Only after proving value and ironing out data quality issues do you expand to remaining sites. Never start with the most resistant site, find your early adopter.`,
      hints: [
        'Before you write a single line of code, what do you need in place legally?',
        'The same patient exists in all 6 systems, how do you know they\'re the same person?',
        'Most EHRs have APIs, what\'s the standard you\'d use to pull patient data?',
        'The IT team at site 3 says they\'re too busy to help for 3 months. How do you handle that?',
        'Writing data back to an EHR is much harder than reading, how does that change your approach?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Read-only first, never write to core banking systems as MVP',
        'Identify the single most valuable metric for the board presentation',
        'Mainframe data extraction via existing batch feeds, not direct access',
        'Data normalization layer to reconcile inconsistent schemas',
        'Pre-compute risk metrics on a schedule, not real-time for V1',
        'Work within their change-control process, not around it',
        'Build with their security team\'s constraints from day one',
      ],
      idealSolution: `The 60-day constraint defines the architecture. This is not the time for a real-time streaming pipeline, it's the time for a pragmatic batch solution that actually ships. Work with the bank's IT team to get read-only exports from each of the 4 systems on a nightly schedule, mainframes typically have existing batch feeds. Build a normalization layer that maps each system's schema to a canonical loan record model, with explicit reconciliation rules for conflicts. Pre-compute the key risk metrics (portfolio concentration, delinquency rates, covenant headroom) nightly and serve them from a simple database. The board presentation needs 3-5 numbers, not 50. Spend week 1 nailing down exactly which metrics matter to the board, that defines everything. Work within their change-control process even if it's slow, a bank that sees you bypass controls will shut the project down. Deliver a working V1 in 45 days, leaving 15 days for testing and sign-off.`,
      hints: [
        'You have 60 days, does the solution need to be real-time, or is nightly good enough for a board presentation?',
        'Mainframes don\'t have REST APIs, how do you actually get data out of them?',
        'The 4 systems define "delinquent loan" differently, how do you reconcile that in the dashboard?',
        'The bank\'s change-control process takes 3 weeks to approve any system change. How does that affect your plan?',
        'What are the 3 numbers the board actually needs, and how does that shape what you build?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Event-driven architecture: inventory changes published as events',
        'Golden record per SKU with source-of-truth hierarchy across systems',
        'Store POS integration via existing APIs or polling if no webhooks',
        'Conflict resolution rules when two systems show different stock counts',
        'Reservation system to prevent overselling during high-traffic events',
        'Peak season in 10 weeks, MVP scope must be ruthlessly cut',
        'Accuracy monitoring: sample physical counts vs system counts',
      ],
      idealSolution: `The core design is a golden record system, one canonical inventory record per SKU, with a defined source-of-truth hierarchy (e.g., warehouse management system is authoritative for stock levels, ERP for pricing). When any of the 8 systems updates inventory, it publishes an event to a central bus. The golden record service consumes these events, applies conflict resolution rules, and updates the unified view. Store POS systems are the hardest: many don't support webhooks, so you poll on a 5-minute cycle for V1. A reservation system is critical for the peak season, when a customer adds to cart, inventory is soft-reserved to prevent overselling under concurrent load. Given 10 weeks to peak, ruthlessly cut scope: launch with online + top 50 stores (highest volume) first, then roll out to remaining 350. Monitor accuracy by sampling: weekly comparison of system counts against physical counts at 10 stores. 73% accuracy today means there's bad data in the source systems, surface and fix the top 5 data quality issues first.`,
      hints: [
        'When inventory changes in the warehouse system and the POS at the same time, which one is right?',
        'Not all store systems support real-time updates, what\'s your fallback?',
        'Two customers buy the last unit simultaneously, how does your system handle that?',
        'You have 10 weeks and 400 stores. What\'s the realistic scope for launch?',
        'The current accuracy is 73%, does that mean your new system will also be 73% accurate on day one?',
      ],
    },
  },

  'Forward Deployed Product Manager': {
    'General': {
      keyComponents: [
        'Churn diagnosis before solutioning, don\'t assume you know the cause',
        'Segment churned accounts: which customers, which use cases, which point in lifecycle',
        'Talk to churned customers directly, not just internal stakeholders',
        'Identify the "aha moment", what do retained customers do that churned ones don\'t?',
        'Separate product issues from sales/onboarding/support issues',
        'Propose a intervention with a measurable leading indicator, not just churn rate',
        'Build a retention motion, not just fix bugs',
      ],
      idealSolution: `Start with data before talking to anyone. Segment churned accounts by size, industry, contract length, and feature usage patterns. Look for the "aha moment", the action or milestone that retained customers hit that churned customers didn't. This is almost always identifiable in product analytics within the first 2 weeks. Then do 10-15 interviews with churned customers (not just internal account teams who will rationalize). Separate root causes: is churn from product gaps, poor onboarding, lack of ongoing support, or a bad-fit customer that sales shouldn't have sold? Most enterprise churn is a combination of onboarding failure and product-market fit gaps for specific segments. Prioritize the highest-value segment where the fix is tractable. Propose one high-confidence intervention with a measurable leading indicator, not churn rate (lags 6-12 months) but something like "% of accounts reaching X engagement milestone in first 30 days." Build a retention playbook, not just a bug fix list.`,
      hints: [
        'Before you talk to anyone, what does the data tell you about which customers are churning?',
        'What\'s the difference between a customer who churns because the product is bad vs one who churns because they were a bad fit to begin with?',
        'Internal account teams will tell you churn is about missing features, why might that not be the whole story?',
        'Churn rate takes 6-12 months to move, what leading indicator tells you earlier if your intervention is working?',
        'You could fix the product, fix onboarding, or fix which customers sales targets, which do you go after first and why?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Adoption diagnosis: which workflows, which roles, which sites have the lowest usage',
        'Observe actual clinical use, don\'t rely on surveys',
        'Separate the "won\'t use" from the "can\'t use" problem',
        'Find internal clinical champion, not just an admin sponsor',
        'Reduce friction to zero for the first interaction',
        'Quick win that makes one group\'s life visibly better within 30 days',
        'Usage metric must be tied to patient care outcome, not just logins',
      ],
      idealSolution: `Start by segmenting adoption data: which clinical roles (physicians vs nurses vs care coordinators), which sites, and which specific workflows have the lowest usage. Low overall adoption masks very different problems. Spend the first week observing actual clinical workflows at the lowest-adoption site, not interviewing, observing. You'll find the real friction: most clinical adoption failures are workflow integration failures, not feature gaps. Clinicians won't change their workflow for a tool that doesn't fit in it. Separate "won't use" (skeptics who don't see value) from "can't use" (workflow or technical barrier). Find one clinical champion, a respected physician or charge nurse, not an administrator, who believes in the tool and will advocate peer-to-peer. Design a 30-day quick win: remove every click between login and the one thing that saves clinicians the most time. Measure success by a workflow metric tied to patient care, not just logins, e.g., "reduction in time to next care action after discharge."`,
      hints: [
        'Overall adoption is 25%, but is that 25% across all roles and sites, or is it 80% in one place and 5% everywhere else?',
        'Clinicians say the tool is "too many clicks", is that a feature problem or a workflow integration problem?',
        'The CMO is your executive sponsor, but who actually influences whether a physician uses a new tool day-to-day?',
        'What\'s the difference between a clinician who doesn\'t see value and one who sees value but can\'t fit it into their workflow?',
        'Logins per day is an easy metric, but what would a metric look like that actually reflects impact on patient care?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'SMB lending is fundamentally different from consumer, different risk model, sales motion, and product',
        'Underwriting is the core product decision: what data signals determine creditworthiness for SMBs?',
        'Distribution strategy: direct, broker, embedded in accounting software',
        'Regulatory requirements differ by loan size and type (SBA, non-SBA)',
        'Unit economics: CAC, default rate, and interest margin must work together',
        'Start with a specific SMB segment, not "all SMBs"',
        'Differentiation: why would an SMB choose this over their bank or Kabbage?',
      ],
      idealSolution: `SMB lending is not consumer lending with a higher limit, it's a different product. The first 2 weeks are market segmentation: which SMB segment (micro-business <$1M revenue, small business $1-10M, lower-middle market) and which vertical (restaurant, retail, SaaS, services) are tractable given current data and capital? The underwriting model is the core product decision, what signals predict SMB creditworthiness? Bank transaction data (cash flow consistency, revenue trends) is more predictive than credit scores for SMBs. The distribution strategy is equally critical: direct sales is expensive, broker networks have margin pressure, but embedding in accounting software (QuickBooks, Xero) where SMBs already manage cash flow is the highest-leverage channel. Regulatory complexity scales with loan size, sub-$150K loans have lighter-touch requirements. Define unit economics targets before building: what default rate and interest margin makes the business work at scale? Differentiation must be concrete: faster decisioning, higher approval rates for good-risk businesses banks reject, or sector-specific underwriting.`,
      hints: [
        'Consumer personal loans and SMB loans, what\'s actually different about the risk and the product?',
        'A credit score works for consumers, what tells you whether a small business will repay a loan?',
        'You could sell directly, through brokers, or through accounting software, what are the tradeoffs?',
        'Which specific type of SMB are you going after first, and why not all of them?',
        'What makes this better than what an SMB can get from their existing bank today?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Seller satisfaction diagnosis: segment by seller size, category, tenure',
        'Identify the top 3 pain points by frequency AND severity, not just complaints',
        'Distinguish platform problems from seller expectation problems',
        'Seller lifetime value framework, not all sellers are equally worth retaining',
        'Quick win within 30 days to stop the bleeding before roadmap work',
        'Feedback loop: how do sellers currently surface problems, and why isn\'t it working?',
        'Seller success motion: proactive vs reactive support',
      ],
      idealSolution: `Start with data segmentation: satisfaction scores broken down by seller GMV tier, category, tenure, and geography. A 20% average drop almost certainly hides a catastrophic drop in one segment masked by stability elsewhere. Pull CSAT drivers, what are sellers actually complaining about? Cluster complaints into themes and score each by frequency × severity × tractability. The top issues in marketplace seller dissatisfaction are almost always: fee changes, search/ranking algorithm changes that reduced visibility, policy enforcement inconsistency, and slow dispute resolution. Separate legitimate product problems from expectation problems, some churn is sellers who never should have been onboarded. Build a seller lifetime value model: a seller doing $500K GMV annually is worth fighting for; a seller doing $500 is not. Design a 30-day quick win targeting the highest-LTV churning segment, often it's a specific policy or fee change you can roll back or grandfather. Long-term: build a proactive seller success motion (dedicated support tiers, early warning system based on GMV trends) rather than reactive firefighting.`,
      hints: [
        'A 20% average drop, is that uniform across all 3 million sellers, or is it concentrated somewhere?',
        'Sellers complain about everything, how do you separate the 3 problems worth solving from the 50 they mention?',
        'Some sellers churning might actually be fine for the business, how do you think about that?',
        'What can you do in the next 30 days that would visibly improve things for your most important sellers?',
        'Sellers are telling you about problems, but what\'s the system today for surfacing those problems, and why isn\'t it working?',
      ],
    },
  },

  'Technical Program Manager': {
    'General': {
      keyComponents: [
        'Immediate triage: understand the critical path and where the 6-week slip came from',
        'Dependency mapping session within week 1, not a document, a working session',
        'Separate "blocked" from "behind", different interventions',
        'Executive alignment: is the date fixed or is scope negotiable?',
        'Weekly program rhythm with clear escalation path',
        'One source of truth for status, replace all the shadow trackers',
        'Risk register with owners and mitigation plans, not just a list',
      ],
      idealSolution: `Week 1 is entirely diagnostic, don't make changes yet. Schedule 1:1s with each of the 12 team leads to understand their actual state, not their status report state. Map the critical path by asking: "What is the one thing your team is waiting for that isn't in your control?" This surfaces the real dependency graph in 2-3 days. Separate teams that are behind on their own work from teams that are blocked by others, the intervention is completely different. With the dependency map in hand, call a cross-team working session (not a status meeting) to resolve the top 3 blocking dependencies in real time. Establish a single program tracker that all teams feed, eliminate shadow spreadsheets. Set up a weekly rhythm: 30-min leads sync Monday, written status update Thursday, escalation path defined so any blocker unresolved for 48 hours auto-escalates to you. Go to your executive sponsor and have an honest conversation: given 6 weeks of slip, is the date actually fixed? Scope negotiation now is better than a missed launch. Build a risk register with likelihood, impact, owner, and mitigation, not to report it, but to actively work it weekly.`,
      hints: [
        'You inherit a program that\'s behind, what do you do in the first 48 hours before you change anything?',
        'A dependency map is the first thing you need, but how do you actually build one when no one has documented it?',
        'Three teams are blocked on each other, what does "blocked" actually mean, and how do you unblock them?',
        'Your executive sponsor asks you for a status update on day 3. What do you tell them?',
        'Is the ship date actually fixed? How do you have that conversation with leadership?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Clinical validation gate before each site rollout, not just technical testing',
        'Regulatory compliance as a tracked workstream from day 1, not a final checklist',
        'Phased rollout: pilot site → validation → expansion, not big bang',
        'Clinician change management is the hardest part, not the technology',
        'Two resisting sites: understand root cause, political, workflow, or technical?',
        'Hard compliance deadline drives backward planning, start there',
        'Clinical superuser network at each site',
      ],
      idealSolution: `The 5-month regulatory deadline is immovable, start there and plan backward. Map every compliance evidence artifact required and assign it to a team with a due date 3 weeks before the deadline to allow for audit prep. Don't treat compliance as a final step; it's a continuous workstream. The phased site rollout is driven by risk and influence: start with the most receptive site that has a clinical champion, not the largest or most complex. Build a clinical validation gate between sites, go-live at site 2 only when site 1 meets pre-defined adoption and safety metrics for 30 days. Clinician change management is the hardest part: deploy clinical superusers (2-3 trained power users per site) who support peers peer-to-peer, because clinicians trust other clinicians. For the 2 resisting sites, diagnose the root cause: if it's political (administration vs clinical leadership conflict), escalate to your health system executive sponsor. If it's workflow, redesign the implementation for that site's specific workflow before launch. Never go live at a resisting site without genuine buy-in, it will fail and damage the whole program.`,
      hints: [
        'The compliance deadline is in 5 months, when do you need to have all compliance evidence ready, and who owns it?',
        'You have 8 sites, do you launch all of them at once, or in sequence? What determines the order?',
        'Two sites are resisting, is that a political problem, a workflow problem, or a technical problem? Does the answer change what you do?',
        'Technology rollouts in hospitals fail more often due to people than technology, how does your program address that?',
        'How do you know a site is actually ready to go live, not just technically deployed?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Separate the two programs with one shared resource pool, explicit allocation model',
        'Regulatory deadline for PCI is immovable, it gates everything else',
        'Identify the shared engineers and get explicit executive decision on prioritization',
        'PCI recertification is evidence-heavy, compliance as a workstream from day 1',
        'Payment processor migration needs a parallel-run and gradual traffic cutover',
        'Risk register with shared-resource conflicts explicitly tracked',
        'Single executive sponsor who owns the prioritization decision',
      ],
      idealSolution: `The first problem is resource contention, you can't run both programs at full speed with the same engineers. In week 1, map exactly which engineers are on which workstreams and where they're double-booked. Take this to a single executive sponsor and force an explicit prioritization decision: PCI recertification is the right answer because it has a regulatory hard stop, while the payment processor migration has a business-driven deadline with more flexibility. With that decision made, allocate engineers accordingly and replan the migration timeline. PCI recertification is primarily an evidence and process problem, not a technology problem, stand up a compliance workstream that runs in parallel, collecting evidence continuously rather than scrambling at the end. For the payment processor migration, design a gradual traffic cutover: 1% → 5% → 25% → 100% over 4 weeks with a parallel-run period where both processors handle traffic and you reconcile the results. Never cut over fully without reconciliation proving the new processor matches the old. Maintain a shared risk register that explicitly tracks every shared-resource conflict and its resolution.`,
      hints: [
        'You have two programs competing for the same engineers, who makes the call on who gets priority?',
        'PCI recertification has a regulatory deadline, the processor migration has a business deadline, does that change how you treat them?',
        'PCI certification requires a lot of documentation and evidence, when does that work start?',
        'You\'re switching payment processors on live transaction traffic, what\'s the safest way to do that cutover?',
        'How do you know the new payment processor is working correctly before you fully switch over?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Immediate readiness assessment: what\'s done, what\'s not, what\'s the critical path to peak',
        'Go/no-go gate with explicit criteria, not a feeling, a checklist',
        'Load testing is the highest priority in week 1, you need data on current capacity',
        'The 4 unfinished integrations: triage by revenue impact, not by technical complexity',
        'Two team leads leaving: knowledge transfer plan before they\'re gone',
        'Escalate to leadership immediately, this is a program at risk',
        'Contingency plan: what if integration X isn\'t done by November 1?',
      ],
      idealSolution: `The first action is to escalate to leadership immediately, this program is at significant risk and leadership needs to know now, not after peak. Then run a 48-hour triage: for each of the 4 unfinished integrations, assess revenue impact (how much GMV is at risk if it's not done?), completion estimate, and dependencies. Rank them by revenue impact, not technical complexity. The one that protects the most revenue gets all available resources. Stand up load testing immediately, you need to know what the system can actually handle today before you know how much risk you're carrying. Schedule knowledge transfer sessions with the two departing team leads this week before they mentally check out. Establish a daily readiness stand-up with a go/no-go framework: explicit criteria that must be met by November 1 for peak go-live. Build contingency plans for each unfinished integration, what's the manual workaround if it's not ready? Some peak season failures can be mitigated with operations if you plan ahead. Weekly stakeholder communication to leadership with a traffic-light dashboard, no surprises.`,
      hints: [
        'It\'s September and peak is 11 weeks away, who do you tell first, and what do you tell them?',
        'You have 4 unfinished integrations and not enough time to finish all of them. How do you decide which one gets the engineers?',
        'Two team leads are leaving, what\'s the single most important thing you need from them before they go?',
        'How do you know if the system can actually handle Black Friday traffic if you haven\'t load tested yet?',
        'What\'s your plan if integration #2 isn\'t done by November 1, do you cancel peak, or is there another option?',
      ],
    },
  },
};

/* ── Additional opening problems (2 more per role × industry) ──
   Merged at runtime with OPENING_PROBLEMS and MOCK_TARGETS.
*/
export const EXTRA_PROBLEMS = {
  'AI Solutions Architect': {
    'General': [
      {
        title: 'LLM Evaluation Framework',
        problem: "A 200-person SaaS company shipped an LLM-powered feature that summarizes customer support tickets. Three months in, customers complain summaries are wrong 20% of the time, but the team has no systematic way to measure this. Walk me through how you'd build an evaluation framework.",
        keyComponents: [
          "Define failure modes precisely: factual errors, missing key info, wrong tone, each needs a separate metric",
          "Golden dataset: 300-500 labeled examples stratified by ticket type and complexity, not just easy cases",
          "LLM-as-judge with rubric for scalable automated scoring, calibrate against 100 human-judged examples",
          "Regression suite: every model or prompt change runs the full eval before shipping",
          "Slice analysis: find which ticket types (billing, technical, complaints) have the highest error rates",
          "Human spot-review of 50 outputs per week to catch distribution shift the automated eval misses",
          "Track latency and cost alongside quality, quality alone is not the full picture",
        ],
        idealSolution: "Start by defining failure modes precisely, 'wrong' could mean factual error, missing critical detail, wrong sentiment, or hallucinated resolution. Each requires a different metric. Build a golden dataset of 300-500 tickets with human-written reference summaries, stratified by ticket type and historical error rate. Use an LLM-as-judge approach for scalable automated scoring: prompt a strong model to score summaries on a rubric (accuracy 1-5, completeness 1-5, conciseness 1-5) and calibrate this against 100 human-judged examples, you want >80% correlation. Slice your eval by ticket category to find where errors concentrate. Run this eval suite on every model or prompt change before shipping, treat it as a CI gate. Set up weekly human spot-review of 50 random outputs to catch distribution shift the automated eval misses. Track cost and latency alongside quality.",
        hints: [
          "What does 'wrong' actually mean, is a summary that misses a detail the same as one that invents a resolution?",
          "You need to measure quality at scale, human review of every summary isn't feasible. What's the systematic approach?",
          "How do you know your automated eval is actually measuring what you think it is?",
          "Some ticket types are much harder to summarize. How does your eval surface that?",
          "If the team ships a new prompt next week, how does your framework tell them whether it's better or worse?",
        ],
      },
      {
        title: 'Agentic AI System Design',
        problem: "A professional services firm wants to automate their RFP response process. Three senior consultants currently spend 2 weeks on each RFP pulling from past proposals and client data. They want an AI agent that drafts a complete response in 2 hours. Walk me through how you'd architect this.",
        keyComponents: [
          "Multi-step agent pipeline: retrieval → outline → section drafting → review, not one monolithic LLM call",
          "Semantic search over past proposals to find relevant case studies and methodology sections",
          "Structured output: RFP has defined sections, constrain the agent to match them",
          "Human-in-the-loop checkpoints at retrieval review and after draft before client delivery",
          "Grounding: every claim must be traceable to a source document, no invented case studies",
          "Guardrails: prevent hallucinated client names, fabricated metrics, or invented project outcomes",
          "Evaluation: compare agent draft vs final consultant edit to measure edit distance and time saved",
        ],
        idealSolution: "This is a multi-step agentic pipeline, not a single LLM call. Break the process into stages: (1) parse the RFP and extract requirements and scoring criteria; (2) retrieve relevant past proposals via semantic search; (3) generate a structured outline matching required sections; (4) draft each section grounded in retrieved source documents with citations; (5) a final LLM consistency review pass. Human checkpoints sit between stages 2-3 and after stage 4. Guardrails are critical: the system must refuse to invent client names, case studies, or metrics not in source documents, every factual claim links to a source. Evaluate by comparing agent draft to final version: edit distance, time saved, and whether any hallucinated facts made it through review.",
        hints: [
          "A complete RFP response is too complex for one LLM call, how do you break it into stages?",
          "The firm has years of past proposals, how does the agent find the relevant ones for a specific RFP?",
          "What's the biggest risk if the agent invents a case study that wasn't real?",
          "Where in the workflow does a human need to be before the output goes to the client?",
          "How do you measure whether this is actually working better than the manual process?",
        ],
      },
    ],
    'Healthcare': [
      { title: 'Clinical Trial Matching AI', problem: "A cancer center runs 80 active clinical trials. Oncologists spend 45 minutes per patient manually checking eligibility. They want an AI system that surfaces matching trials in under 2 minutes. Walk me through the design.", keyComponents: ["Parse eligibility criteria into structured inclusion/exclusion rules from unstructured protocol text","Extract patient attributes from EHR via FHIR: diagnosis, labs, medications, prior treatments","Rule-based matching for hard criteria, ML for fuzzy criteria like 'adequate organ function'","Rank top 5 matches with confidence and criteria met/not met per trial","Explainability: oncologist sees WHY the patient matches, not just a score","HIPAA compliance: all processing within BAA-covered environment","Human-in-the-loop: AI surfaces candidates, physician decides on enrollment"], idealSolution: "Two parallel pipelines meet at matching time. Pipeline 1 processes trial protocols: parse inclusion/exclusion criteria into structured form using an LLM, store in a structured database. Pipeline 2 processes patient records: pull clinical attributes via FHIR APIs. Matching uses a hybrid engine: deterministic rules for hard criteria, ML for fuzzy criteria calibrated on historical enrollment decisions. Surface top 5 trials ranked by confidence, showing which criteria are met, uncertain, or failed. Explainability is non-negotiable, the oncologist must see the specific evidence for each criterion. All processing stays within a HIPAA-compliant BAA-covered environment. The system surfaces; the physician enrolls.", hints: ["Trial criteria say 'adequate organ function', that isn't a SQL query. How do you make it computable?","What patient data do you need, and where does it live in the EHR?","An oncologist won't trust a score without knowing why. How does the system explain its reasoning?","Some criteria are yes/no, others are judgment calls. How do you handle both?","The physician makes the final call, where exactly does the AI stop and the human begin?"] },
      { title: 'AI-Powered Prior Authorization', problem: "A health system processes 50,000 prior authorization requests per month. The manual process takes 3-5 days and requires 40 staff. They want AI to reduce routine case review to 4 hours. Walk me through the design.", keyComponents: ["Triage first: separate routine auto-approvable cases from complex ones needing human review","Payer criteria ingestion: parse each payer's auth criteria into a structured library","Clinical documentation extraction: diagnosis codes, procedure codes, clinical notes from EHR","Evidence matching: map clinical evidence to payer criteria automatically","Confidence tiering: high confidence → auto-process, low confidence → human review queue","Audit trail: every decision logged with evidence for regulatory and appeals purposes","Appeals workflow: denied cases need structured evidence packages"], idealSolution: "The core insight is triage: classify every request by complexity. A significant portion (40-60%) are routine cases against clear criteria that can be auto-processed. Three layers: Layer 1 builds a payer criteria library, structured by payer × procedure type, parsed and updated regularly. Layer 2 extracts clinical evidence from the EHR via FHIR. Layer 3 matches evidence to criteria and produces confidence-tiered output: high confidence match → auto-approve with audit log, high confidence non-match → auto-deny with appeal package, low confidence → human review queue with evidence pre-organized. Every decision is logged with specific evidence used, both for compliance and to build the training dataset.", hints: ["Not all 50,000 cases need the same treatment, how do you separate easy from complex?","Every payer has different criteria for the same procedure. How does the system handle that?","The AI denies an authorization and the patient appeals. What must the system have captured?","How confident does the system need to be before making an automated decision?","What's the regulatory and liability implication of an incorrect automated denial?"] },
    ],
    'Fintech': [
      { title: 'AI Credit Underwriting', problem: "A consumer lending startup underwrites 10,000 loans per month manually, taking 3 days per application with a 12% default rate. They want an AI system that decides in under 10 seconds with a target default rate below 8%. Walk me through how you'd design this.", keyComponents: ["Bank transaction cash flow patterns are more predictive than credit score alone","Gradient boosted trees (XGBoost/LightGBM) for tabular financial data, not neural networks","Reject inference to handle selection bias from historical declined applications","Fairness audit for disparate impact across protected classes before deployment","Adverse action notices legally require explaining a denial in plain language","Champion/challenger framework: new models run in shadow mode before replacing champion","Monthly drift monitoring as economic conditions change"], idealSolution: "The core model is gradient boosted trees trained on credit bureau data plus 12 months of bank transaction features: income consistency, spending-to-income ratio, overdraft frequency, merchant category patterns. These signals predict default far better than credit score alone for thin-file borrowers. Training requires reject inference: declined applications have no outcome, so use techniques to estimate their counterfactual performance. Before deployment, run a fairness audit for disparate impact, this is both ethical and legally required. Adverse action notices must explain denials in plain language using SHAP-based explanations. Deploy via champion/challenger: new models run in shadow mode until they prove out. Monitor for drift monthly.", hints: ["Credit score alone is a weak signal for many borrowers, what other data sources tell you more?","Your training data only has outcomes for loans you approved, how does that bias the model?","A model that denies more loans from one demographic, what's the legal framework?","Regulations require explaining why a loan was denied. How does that shape your model choice?","How do you know when your model is going stale and needs retraining?"] },
      { title: 'Wealth Management AI Assistant', problem: "A wealth management firm with $50B AUM wants to give 200 financial advisors an AI assistant to answer questions about client portfolios, market conditions, and regulatory requirements. Advisors spend 2 hours per client meeting preparing. Walk me through the design.", keyComponents: ["Three retrieval sources: client portfolio data (structured), market data (real-time feeds), regulatory docs (knowledge base)","Strict scope: AI answers factual questions, never gives investment advice or makes trade recommendations","Row-level access control: advisor can only query their own clients' data","Every query and response logged immutably for regulatory review","Financial figures must cite exact sources with timestamps, no approximation or hallucination","Advisor reviews all AI-generated content before it reaches a client","Real-time market data requires live feed integration, not static retrieval"], idealSolution: "The system has three retrieval layers. Layer 1: client portfolio data from the portfolio management system, queryable in real time. Layer 2: live market data feeds with defined staleness tolerance. Layer 3: regulatory and compliance knowledge base (SEC rules, FINRA guidance, firm policies). Critical design constraint: this system answers factual questions and summarizes information but never recommends trades, that remains the advisor's licensed responsibility. Row-level access control ensures advisors can only query their own clients. Every query and response is logged immutably. Every financial figure in a response must cite its exact source with timestamp. Advisor reviews all content before it reaches a client.", hints: ["An advisor asks 'should I move this client into more bonds?', how does your system handle that?","Client portfolio data, market data, and regulatory docs are three different sources, how does the system know which to query?","If the AI reports a client's portfolio is up 8% and it's 7.3%, what are the consequences?","Advisor A can't see Advisor B's client data, how do you enforce that at the system level?","A regulator subpoenas all AI-assisted communications for 2 years. Is your system ready?"] },
    ],
    'E-commerce': [
      { title: 'Dynamic Pricing AI', problem: "A marketplace wants to implement dynamic pricing adjusting prices in real time based on demand, competitor pricing, and inventory. They sell 5 million SKUs. Sellers are afraid of a race to the bottom. Walk me through how you'd design this system.", keyComponents: ["Price elasticity model per SKU segment, not one model for all 5M SKUs","Competitive price intelligence via data feeds and targeted scraping with defined latency tolerance","Inventory-aware pricing: low stock triggers higher prices, excess triggers discounts","Seller guardrails: minimum price floors and seller opt-in/out controls per SKU","Category-level price floors to prevent race-to-bottom dynamics","A/B testing framework to validate elasticity models before full rollout","Margin-aware: can't optimize revenue if it destroys seller relationships or marketplace trust"], idealSolution: "Segment the 5 million SKUs by category, price tier, and demand velocity, you can't build bespoke models per SKU. Build price elasticity models at the segment level trained on historical price-demand pairs. Competitive intelligence comes from purchased data feeds and targeted scraping with defined latency by category tier. The pricing engine considers demand elasticity, inventory level, and competitive position. Seller guardrails are non-negotiable: minimum price floors, opt-out controls, advance notice of changes outside defined bands. Race-to-bottom prevention uses category-level floors and a fairness constraint preventing prices that make listings unprofitable for typical sellers. Validate all model changes via A/B tests with holdout groups before full rollout.", hints: ["You have 5 million SKUs, you can't build a separate model for each. How do you scale this?","A seller has a minimum margin they need, how does your system respect that?","Competitor A drops price. Your system drops. They drop again. How do you prevent that spiral?","How do you know a price change caused a demand change vs demand changed for other reasons?","Sellers will revolt if prices change without warning. What's the seller-facing design?"] },
      { title: 'Returns Fraud Detection', problem: "An e-commerce platform processes 2 million returns per month and loses $180M annually to return fraud (wardrobing, empty box, counterfeit). Manual review catches only 30% of fraud. Walk me through how you'd design an AI-powered detection system.", keyComponents: ["Multi-signal features: return rate history, account age, item category, purchase-to-return timing","Network analysis: detect fraud rings sharing addresses, payment methods, and devices","Anomaly detection for new fraud patterns not seen in training data","Risk-tiered response: auto-approve vs enhanced verification vs manual review vs block","False positive cost: wrongly flagging a legitimate customer destroys lifetime value","Feedback loop: review outcomes retrain the model weekly","Appeals workflow for legitimate customers flagged as fraud"], idealSolution: "The system risk-scores every return request. Features combine account-level signals (return rate history, account age, CLV, prior fraud flags), transaction signals (category risk, purchase-to-return timing, whether item was on sale), and behavioral signals (return reason vs item type mismatch). Network analysis is the most powerful layer: fraud rings operate across accounts sharing addresses, devices, and payment methods, graph analysis surfaces coordinated behavior no per-account model catches. Output is a risk-tiered response: auto-approve, require photo of return, hold for manual review, or deny and escalate. False positive cost is equally important to catch rate, track both precision and customer satisfaction impact of wrong flags. Model retrains weekly on reviewed cases.", hints: ["A fraudster creates a new account for every return, how do you detect them with no individual history?","What signals tell you a return is suspicious before you even open the box?","Blocking a legitimate customer's return is also a cost, how do you think about the tradeoff?","How do you detect fraud rings where multiple accounts are coordinating?","New fraud schemes emerge constantly, how does your system catch patterns it wasn't trained on?"] },
    ],
  },
  'Forward Deployed Engineer': {
    'General': [
      { title: 'Data Migration at Scale', problem: "A SaaS company is migrating 10 years of customer data from a legacy on-premise system to a new cloud platform. 500 enterprise customers depend on this data. No downtime is acceptable. Migration must be complete in 6 months. Walk me through your approach.", keyComponents: ["Strangler fig: migrate incrementally with old and new running in parallel, never big bang","Data validation: record counts, checksums, and field-level spot checks between source and destination","Customer sequencing: smallest/simplest first, largest last","Per-customer rollback plan: ability to revert any customer within 1 hour","Dual-write period during cutover: both systems receive writes to prevent data loss","Zero-downtime cutover via feature flags per customer","Customer communication plan: 30 days advance notice with a migration runbook"], idealSolution: "Strangler fig, never attempt big-bang migration of 500 enterprise customers. Run old and new systems in parallel throughout. Phase 1 (weeks 1-4): build the ETL pipeline and validation suite (record counts, checksums, referential integrity), run migration on internal test data. Phase 2 (weeks 5-16): migrate customers in cohorts starting with smallest. Each migration: extract → transform → load → validate → dual-write 2 weeks → cutover via feature flag. Every customer has a 1-hour rollback plan. Phase 3 (weeks 17-24): largest and most complex enterprise accounts with dedicated migration engineers. Proactive customer communication throughout.", hints: ["Big-bang migration of 500 customers, what's the risk, and what's the alternative?","How do you know the migrated data in the new system is correct and complete?","If something goes wrong at 2am the night of a customer's migration, what's your plan?","During transition, a customer updates their data. How do both systems stay in sync?","Which customers do you migrate first, and why does that order matter?"] },
      { title: 'Real-Time Analytics Platform', problem: "A logistics company tracks 50,000 delivery vehicles. Operations teams use a 4-hour-old dashboard and make decisions on stale data, costing $2M/month. They need a real-time dashboard with under 30-second data latency. Walk me through the architecture.", keyComponents: ["Event streaming: Kafka/Kinesis to ingest GPS pings (50K vehicles × 1 ping/30s ≈ 1,700 events/sec)","Stream processing: Flink or Spark Streaming for real-time metric computation","Hot/warm/cold storage: Redis for current state, time-series DB for recent history, S3 for archive","WebSocket push to dashboard, polling can't achieve 30s latency at scale","Separate current vehicle state from event history as different data concerns","Stream-based alerting: vehicle stopped >30 min in non-depot triggers alert before hitting storage","Graceful degradation: show last-known position with staleness indicator when vehicle goes offline"], idealSolution: "Vehicles publish GPS pings via MQTT to a Kafka cluster. Apache Flink consumes from Kafka and computes real-time derived state: current location, speed, route adherence, estimated arrival, exception flags. This processed state writes to Redis (current vehicle state, sub-second dashboard reads) and a time-series database (24-hour history). Dashboard receives updates via WebSocket push, polling at 30-second intervals creates a thundering herd problem at 50K vehicles. Alerting runs on the Flink stream directly: a vehicle stopped 30+ minutes in a non-depot location triggers an alert before it ever hits storage. Vehicles that go offline show last-known position with a staleness indicator, graceful degradation maintains operator trust.", hints: ["50,000 vehicles pinging every 30 seconds, how many events per second, and how does that shape the architecture?","The dashboard needs sub-30-second latency, does polling work at this scale?","You need current vehicle location AND where it was 3 hours ago, are those the same data store?","A vehicle goes offline mid-route. What does the operations dashboard show?","How do you compute 'this vehicle is behind schedule' in real time without querying a database on every update?"] },
    ],
    'Healthcare': [
      { title: 'Remote Patient Monitoring Platform', problem: "A hospital system wants to monitor 5,000 post-surgical patients at home using wearables. Patients call in when unwell, catching deterioration too late. The goal is to detect clinical deterioration 24 hours earlier. Walk me through the architecture.", keyComponents: ["Edge processing on device: detect obvious anomalies locally before transmitting","Tiered alerting: automated alert → nurse → physician with defined escalation path","Clinical threshold configuration: physicians define alert thresholds per patient type, not engineers","PHI encrypted in transit and at rest, BAA in place with all vendors","Alert fatigue prevention: precision matters as much as recall, too many false alarms causes nurses to ignore the system","Device must buffer and sync when connectivity is lost","Every alert surfaces in EHR with patient history alongside the vital reading"], idealSolution: "Edge-to-cloud architecture with tiered alerting. On device: simple threshold detection runs locally, if heart rate exceeds a hard limit, alert immediately without cloud round-trip. The cloud handles complex pattern detection: trending deterioration over 6 hours detectable before a single threshold is breached. Stream processing ingests vitals, runs patient-specific alert models (thresholds configured by clinical team), and computes Modified Early Warning Scores. Alerting has explicit escalation: anomaly → on-call nurse, unacknowledged 5 minutes → attending physician. Alert fatigue is the biggest clinical risk: tune for precision, not just recall. Offline resilience: devices buffer 72 hours and sync on reconnection. Every alert surfaces in the EHR with recent patient history for context.", hints: ["A post-surgical patient's heart rate spikes at 3am, what happens next, step by step?","If every minor anomaly triggers an alert, what happens to the nurses over time?","A patient drives through a rural area and loses signal for 6 hours, what happens to their monitoring?","The system detects deterioration, what context does the nurse see alongside the alert?","Different thresholds for cardiac vs orthopedic patients, how does your system support that?"] },
      { title: 'Medication Adherence Platform', problem: "A chronic disease management company wants to improve medication adherence for 100,000 diabetes patients from 50% to 75%. Walk me through what you'd build.", keyComponents: ["Behavioral segmentation: forgetters vs cost-sensitive vs side-effect avoiders need different interventions","Intervention escalation: app notification → SMS → nurse outreach, cheapest first","Pharmacy integration: detect overdue refills before the patient runs out","EHR integration: pull prescription data and refill history to identify at-risk patients proactively","Provider loop: flag persistently non-adherent patients to their care team","Measurement: pharmacy fill rate (days supply dispensed / days prescribed) as primary metric","Privacy: medication data is sensitive, patient trust is foundational"], idealSolution: "Start with segmentation, 'non-adherent' is not one population. Analyze pharmacy fill data to identify primary barriers: forgetters (need reminders), cost-sensitive (need assistance programs), side-effect avoiders (need clinical engagement). The intervention ladder matches the barrier and escalates by cost. Pharmacy integration is highest-leverage: detect refills overdue by 5 days and intervene before the patient runs out. EHR integration identifies patients at high risk of non-adherence proactively, recent hospitalization, new medication, cost change. The provider loop is critical: persistently non-adherent patients get flagged in care team workflows. Measure via pharmacy fill rate, more objective than patient self-report.", hints: ["A patient hasn't picked up their medication in 2 weeks, what does your system do, and in what order?","Sending a push notification to every patient every day at 9am, what's wrong with that?","Some patients can't afford their medication. How does your platform help?","How do you actually know if a patient is taking their medication vs just picking it up?","When should the platform escalate to the physician vs handling it through patient-facing tools?"] },
    ],
    'Fintech': [
      { title: 'Open Banking Integration Platform', problem: "A fintech startup wants to aggregate financial data from 500 banks for 200,000 users. Users want all accounts in one place with real-time balance updates and transaction history. Walk me through the technical architecture.", keyComponents: ["Connection strategy: OAuth direct bank APIs (Open Banking/PSD2) where available, aggregators for the rest","Canonical data model: normalize each institution's transaction format to a unified schema","Never store raw bank credentials, use token-based auth with secure refresh handling","Balance updates on demand, transaction sync on schedule, not all data needs to be real-time","Design for failure: connections go stale, tokens expire, institutions change APIs","Rate limiting: banks rate-limit API calls, queue and throttle intelligently","Show data freshness indicators, never pretend data is current when it's not"], idealSolution: "Tiered connection layer: for banks with Open Banking/PSD2 APIs use direct OAuth2 integration, more reliable, no credential storage. For the long tail of 500 institutions, use an aggregator (Plaid, MX). Never store raw credentials, use the aggregator's token system or bank OAuth tokens with secure storage and refresh. Normalization layer maps each institution's format to a canonical schema: date, amount, normalized merchant name, category. Normalization is 80% automated with ML-based merchant classification, 20% manual mapping rules. Freshness: balances refresh on session start, transaction history syncs every 4 hours. Design for failure from day 1: every connection has health status, stale connections surface re-authentication prompts, partial failures show gracefully.", hints: ["You need to connect to 500 banks, do you build each integration yourself, and what's the tradeoff?","A user connects their bank account. What do you actually store, and what can you never store?","'WHOLEFDS #1234 NYC' and 'WFM 0012 NEW YORK' are the same merchant. How do you normalize that?","A user's bank token expires at 2am. What happens to their data?","You can't refresh all 200,000 users' accounts in real time, how do you prioritize?"] },
      { title: 'Real-Time Payment Infrastructure', problem: "A B2B payments startup wants to build real-time payment rails: settlement under 10 seconds, $50K+ amounts, 10,000 transactions per second at peak. Walk me through the architecture.", keyComponents: ["Idempotency is foundational: unique key per transaction; retries never double-process","Atomic debit-credit: both sides succeed or both fail, no partial states","Event sourcing: transaction state machine with immutable append-only log","Fraud and risk checks must complete in under 2 seconds to meet 10-second SLA","Settlement finality: define precisely when a payment is irrevocable","Daily and real-time reconciliation against bank partner balances","BSA/AML compliance required on every transaction"], idealSolution: "Every payment has a state machine: initiated → validated → risk-cleared → debited → credited → settled. States stored in an immutable event log, you can reconstruct any transaction's history for audit. Idempotency key deduplication happens at database level before any money moves. Atomic flow: debit sender (reserve funds) → run fraud/AML in parallel (<2 seconds) → credit receiver → confirm settlement. If any step fails, reservation releases atomically. Risk checks run concurrently to meet the 2-second budget. Settlement finality is defined contractually with banking partners, 'settled' means irrevocable. Continuous reconciliation: real-time balance tracking against bank partner accounts, end-of-day reconciliation to catch discrepancies.", hints: ["A payment is processed but the response times out. The client retries. How do you prevent charging twice?","The debit succeeds but the credit fails, what's the exact state of the money?","You need fraud checks AND settlement in under 10 seconds, how do both fit?","When is a payment truly 'final'? Why does that definition matter for architecture?","At 10,000 transactions per second, how do you reconcile your records against the bank's?"] },
    ],
    'E-commerce': [
      { title: 'Seller Onboarding Automation', problem: "A marketplace onboards 50,000 new sellers per month. Current process takes 5 days with manual document review. 40% of new sellers churn in 30 days because onboarding is too slow. Walk me through how you'd automate this.", keyComponents: ["Risk tiering: low-risk seller categories can be fast-tracked vs high-risk categories needing full verification","OCR + ML to extract structured data from business licenses, tax forms, IDs","Cross-reference extracted data against third-party sources: IRS EIN database, state business registries","Progressive onboarding: provisional account immediately, listings live once verification completes","Fraud detection during onboarding: catch fake documents and identity fraud before activation","Exception routing: human reviewers see pre-extracted data and risk summary, not raw PDFs","Proactive status updates: 'Your account is 80% verified' not 'application is under review'"], idealSolution: "Goal: same-day activation for 80%+ of sellers. Risk score at intake determines the verification path, a small business in a low-risk category needs less verification than an electronics seller where counterfeiting is high. Document pipeline: OCR extracts text, ML classifies document type and extracts structured fields, verification layer cross-references against third-party sources. This automated verification handles 75-80% of cases. Critical UX change: progressive onboarding, sellers get a provisional account immediately to create listings and set up their storefront while verification runs in background. Listings go live when verification completes. For the 20-25% needing manual review, route with pre-extracted data and a risk summary, not raw PDFs. Proactive communication throughout.", hints: ["A seller submits a business license, what does your system actually do with that document?","Can some sellers start selling before verification is complete, and which ones?","Someone submits a fake business license. How does your system catch that?","Which sellers need deep verification and which can be fast-tracked?","What's wrong with 'your application is under review'?"] },
      { title: 'Flash Sale Infrastructure', problem: "A retailer wants to run a flash sale: 500 products, 70% off, 2 hours, starting at noon. They expect 500,000 concurrent users at peak. Current infrastructure handles 10,000. Walk me through how you'd architect the system.", keyComponents: ["Read path served entirely from CDN edge cache, zero database reads for product browsing","Virtual waiting room queue to control checkout rate rather than 500,000 hitting checkout simultaneously","Atomic inventory reservation via Redis DECR with TTL, prevent overselling under concurrency","Cart reservation expires in 10 minutes if purchase isn't completed","Checkout write cluster isolated from all read traffic","Graceful degradation: return 'sold out' conservatively rather than risk overselling","Post-sale reconciliation: verify inventory decremented equals orders placed"], idealSolution: "Separate read path from write path completely. The read path (browsing, prices, availability) is served entirely from CDN edge cache, 500,000 users browsing cannot hit the database. Product data pre-cached 30 minutes before sale. Sold out status updated via cache invalidation. The write path (checkout) uses a virtual waiting room queue: users enter the queue and are admitted at a controlled rate (e.g., 5,000 checkouts/minute). Cart additions trigger atomic inventory reservation: Redis DECR command atomically decrements stock and returns -1 if it hits 0. Reservations expire in 10 minutes via TTL if purchase isn't completed. Checkout write cluster is isolated from read traffic. Graceful degradation: if inventory service is slow, return sold out conservatively rather than risk overselling. Post-sale reconciliation verifies orders = inventory decremented.", hints: ["500,000 users loading the sale page at noon, how does your database survive that?","Two users click 'add to cart' on the last item simultaneously. What happens?","A user adds to cart but doesn't check out for 30 minutes. Is that item still reserved?","The checkout service is overwhelmed. Do you let requests through and risk overselling, or block them?","After the sale, how do you verify you didn't sell more units than you had?"] },
    ],
  },
  'Forward Deployed Product Manager': {
    'General': [
      { title: 'New Market Expansion', problem: "A B2B SaaS company (project management tool, 500 customers, $8M ARR) is considering expanding from SMB into enterprise. Enterprise deals are 10x larger but the product isn't enterprise-ready. You're embedded for 90 days. Walk me through how you'd evaluate this and what you'd recommend.", keyComponents: ["Pull vs push: are enterprise customers already coming bottom-up, or is this wishful thinking?","Product gap analysis: SSO, RBAC, audit logs, SLAs, procurement compliance, enumerate the gaps and their build cost","Sales motion is fundamentally different: SMB is product-led, enterprise is sales-led with 6-9 month cycles","Lighthouse account strategy: land 3-5 design partners to learn before building for everyone","ICP definition: which enterprise segment fits current product strengths?","Cannibalization risk: enterprise motion can slow down the core SMB business","Clear recommendation: go/no-go with specific conditions, not a vague 'it depends'"], idealSolution: "Start with the demand signal: are enterprise companies already using the product bottom-up? That's the strongest signal. Spend the first 2 weeks interviewing 10 of the largest current customers and 10 enterprise prospects who declined. Map product gaps: enterprise universally requires SSO, RBAC, audit logging, 99.9% SLA, procurement-approved security posture, and DPA agreements, typically 6-12 months of engineering work. The sales motion is the harder challenge: SMB is product-led (self-serve, trials), enterprise is sales-led (demos, security reviews, multi-stakeholder buying committees). This requires hiring enterprise sales reps, a completely different go-to-market muscle. Recommendation structure: define the target enterprise segment precisely, identify 3 lighthouse targets for month 1, list the 5 non-negotiable product gaps and build cost, and give a clear go/no-go with explicit conditions.", hints: ["How do you know if enterprise is a real opportunity vs founders just wanting bigger logos?","What does a company need to build before an enterprise security team will approve it?","If this company switches to selling enterprise, what happens to their existing SMB growth?","What's the difference in how you sell to SMB vs enterprise, and why does it matter?","What would a successful 90-day outcome look like, what specifically would you have proven or disproven?"] },
      { title: 'Pricing Strategy Overhaul', problem: "A developer tools SaaS company has flat-rate pricing at $99/month regardless of team size. A 1-person startup pays the same as a 200-person engineering team. Revenue has plateaued at $5M ARR despite strong user growth. You're embedded to redesign pricing. Walk me through your approach.", keyComponents: ["Value metric identification: what unit scales with the customer's benefit, seats, API calls, projects?","Segment analysis: which customers are over-paying (churn risk) and under-paying (expansion opportunity)?","Revenue modeling: project the MRR impact of each pricing scenario before committing","Competitive benchmarking: what do alternatives charge and on what metric?","Grandfathering strategy: existing customers get protected rates for 12 months with advance notice","A/B test new pricing on new customers for 60 days before migrating existing customers","Freemium tier consideration: does it accelerate or cannibalize growth?"], idealSolution: "The value metric is the most important decision. Interview 20 customers across size tiers, a 200-person team at $99/month is a massive expansion opportunity; a 1-person startup might churn if prices rise. Usage data shows where natural tiers cluster. Competitive analysis sets the market ceiling. Design 3 tiers: free/starter (PLG motion, individuals become enterprise advocates), team (per-seat or flat, covers the core market), enterprise (custom, annual, SLAs and security). Revenue model the change conservatively: project what each existing customer segment pays under new pricing, model upgrade and churn rates. For migration: grandfather at current rates for 12 months, then migrate with a 20-30% loyalty discount from new list prices. A/B test new pricing on new customers for 60 days before committing.", hints: ["What's the right unit to charge on, how do you figure that out?","You have 10,000 customers paying $99. If you raise prices, what happens?","A 1-person startup and a 200-person team use the same product, should they pay the same?","How do you test a new pricing model without risking your existing revenue base?","What does a free tier do to your business, does it help or hurt?"] },
    ],
    'Healthcare': [
      { title: 'Patient Engagement Product', problem: "A hospital system wants to reduce no-show rates (currently 25%) and improve post-visit care plan adherence (currently 35%) for 500,000 active patients. You're embedded as the product lead. Walk me through your strategy.", keyComponents: ["No-shows and non-adherence have different root causes, diagnose separately before building","Patient segmentation: a 70-year-old managing chronic disease has different needs than a 30-year-old one-time visit patient","Friction reduction: the best engagement feature has fewest barriers, SMS may outperform an app","EHR integration via FHIR: patient-facing tools must connect to real appointments and care plans","Health literacy: 40% of adults have low health literacy, design for this, not the 60%","Measure no-show rate and adherence rate, not app downloads","HIPAA applies to patient-facing apps touching PHI"], idealSolution: "Separate diagnosis for no-shows vs adherence. For no-shows: pull 6 months of data, segment by reason (forgotten, transport, cost, scheduling friction). The largest segment drives the first feature. For forgotten appointments: SMS reminders with 1-tap confirmation 48 and 2 hours before reduce no-shows 20-30% and can be built in 2 weeks, don't build an app when SMS solves 60% of the problem. For adherence: most non-adherence in chronic disease is forgetfulness and complexity, not lack of motivation, reminders and simplification, not education content. Patient segmentation is critical: design for a 65-year-old managing 4 conditions and the 30-year-old will be fine. EHR integration via FHIR is non-negotiable. Measure no-show rate and adherence rate from day 1, not DAU or downloads.", hints: ["No-shows have many causes, forgetting is just one. How do you figure out which cause is most common?","A 70-year-old managing diabetes and a 28-year-old for a sports physical, should you design one app for both?","Do you actually need to build an app to reduce no-shows?","The hospital wants to track app downloads as a success metric. What's wrong with that?","A patient's care plan in the app needs to match what their doctor prescribed in the EHR, how?"] },
      { title: 'Telehealth Platform Strategy', problem: "A regional health system launched a telehealth platform during COVID. Usage has dropped 60% since in-person care resumed. Leadership wants to invest to grow it or wind it down. You're embedded for 60 days to make the recommendation. Walk me through your approach.", keyComponents: ["Retention analysis: which patient cohorts kept using telehealth post-COVID and why?","Visit type fit: mental health and chronic disease follow-up retain well; urgent care and physicals don't","Unit economics: telehealth visit revenue vs fully-loaded cost, is it margin-positive at current volumes?","Payer reimbursement parity varies by state, this is a hard revenue ceiling","Patient and provider NPS by segment and specialty","Direct-to-consumer telehealth has massive scale advantage, positioning must be defensible","Clear recommendation: invest, divest, or maintain with explicit criteria and conditions"], idealSolution: "60-day analysis has three tracks. Track 1: data, pull utilization by visit type, patient segment, and provider. Mental health and chronic disease management typically retain strong post-COVID utilization, these are the defensible use cases. Track 2: economics, fully-loaded cost per telehealth visit vs reimbursement by payer. Many health systems find telehealth margin-negative at low volumes due to platform fixed costs. Track 3: NPS by patient segment and provider specialty. The strategic question: can this health system compete on convenience against Teladoc's national scale? Probably not for acute on-demand care. But for continuity within an existing patient-provider relationship, follow-ups, chronic disease, behavioral health, telehealth is a retention and access tool. Recommendation: maintain telehealth for 3 visit types where retention is strong and economics work, sunset the rest, frame as a care delivery feature not a standalone product.", hints: ["Usage dropped 60%, but is that uniform across all visit types, or concentrated in some?","Mental health telehealth usage stayed high post-COVID. Why, and what does it tell you?","Is this health system actually competing with Teladoc for the same patients?","A telehealth visit costs more to run than in-person but reimburses less, what does that mean?","Leadership wants a go/no-go. What specific evidence pushes you toward each direction?"] },
    ],
    'Fintech': [
      { title: 'B2B Payment Product Launch', problem: "A fintech company wants to launch a B2B payment product for mid-market companies to replace checks and ACH for vendor payments. They have 0 customers and 18 months of runway. Walk me through your product strategy and go-to-market.", keyComponents: ["ICP definition: not all mid-market, pick one segment and one vertical to win first","Two-sided network problem: payer-led model where vendors receive funds without signing up separately","Lead value proposition: same-day settlement at ACH cost, finance teams understand this immediately","Money transmission licenses required in each state, partner with a BaaS provider short-term","Distribution: accounting software integration (QuickBooks, NetSuite) is highest-leverage channel","18 months of runway demands brutal MVP scope: one vertical, one value prop, one channel","First 10 customers as design partners before building for anyone else"], idealSolution: "With 18 months of runway, focus is the constraint. Pick one vertical, professional services (law firms, accounting firms) because they have predictable recurring vendor payments and a reachable CFO. The two-sided network problem: use a payer-led model where mid-market companies sign up and vendors receive funds via the platform without needing to sign up separately. This breaks the chicken-and-egg problem. Lead value proposition: 'same-day settlement at ACH cost', finance teams understand this immediately and can calculate the benefit. Regulatory: money transmission licenses take 12-18 months per state; partner with a licensed BaaS provider in the short term. Distribution: accounting software integration is the highest-leverage channel. Focus means: one vertical, one value proposition, one distribution channel, first 10 customers as design partners.", hints: ["Mid-market is 50,000+ companies. What happens to your runway if you try to sell to all of them?","You need both payers AND receivers on the platform. Which do you acquire first?","Getting a money transmission license takes 12-18 months. How does that shape year one?","Faster vs cheaper payments, which do you lead with, and how do you decide?","How do you reach the CFO of a 200-person company with limited sales resources?"] },
      { title: 'Crypto Brokerage Feature', problem: "A traditional retail brokerage with 2 million customers wants to add cryptocurrency trading. 30% of customers have asked for it. Core business is stocks and ETFs. Walk me through product strategy, build vs buy decision, and rollout.", keyComponents: ["30% survey demand ≠ 30% actual intent, validate with revealed preference data before building","Crypto brokerage requires Money Transmission Licenses, different from broker-dealer license they have","Build vs partner vs acquire: build takes 2+ years, white-label partner is fastest, acquisition gets licenses","Custody should be delegated to a specialized provider, not built internally","Brand risk: a custody failure or hack damages the core brokerage brand significantly","Product integration: unified portfolio view (stocks + crypto together) is highest-value for crypto-curious customers","Start with BTC and ETH only, most demand, most regulatory clarity"], idealSolution: "Start by interrogating the 30% demand signal, expressed interest in surveys overstates actual behavior by 2-3x. Compare to revealed preference: do these customers already have Coinbase accounts? The regulatory question shapes build/buy/partner: crypto trading requires Money Transmission Licenses per state, different from the broker-dealer license they have, plus a robust AML/KYC program for crypto-specific typologies. Build from scratch is a 2+ year project. Partner path (white-labeling Coinbase or a crypto prime brokerage) trades margin for speed and transfers custody risk. Acquisition gets licenses and infrastructure but is expensive. Strategic question: is crypto retention/acquisition feature or new business line? For retention, minimum viable integration is crypto trading with unified portfolio view. Custody should be delegated, internal custody failure would damage the core brokerage brand. Rollout: waitlist existing customers, BTC and ETH only first, expand gradually.", hints: ["30% of customers asked for crypto. How confident are you that 30% would actually trade it?","Your brokerage has a broker-dealer license. Is that enough to offer crypto trading?","Building crypto custody in-house vs using a third party, what are you deciding between?","A crypto hack loses customer funds. What does that do to the core brokerage business?","Is crypto a feature that helps retain existing customers, or a new business line? Why does it matter?"] },
    ],
    'E-commerce': [
      { title: 'Subscription Commerce Strategy', problem: "A DTC skincare brand ($20M revenue, 300,000 customers) wants to add a subscription model. Currently 60% of revenue is from repeat customers buying ad hoc. Walk me through whether they should do it and how.", keyComponents: ["Subscription fit: does the product have natural replenishment cadence, verify with actual usage data","Cannibalization modeling: converting ad-hoc repeaters to discounted subscriptions can hurt short-term revenue","Subscriber LTV vs one-time LTV: subscriptions typically have higher LTV but more operational complexity","Pricing: 10-20% discount, enough to incentivize, not so deep it kills margin","Easy cancellation: dark patterns hurt brand; easy cancel improves trust and re-subscribe rate","Pilot with top 20% of customers by purchase frequency, they already demonstrate the behavior","Real question: is the problem low LTV or low acquisition efficiency? Subscriptions solve LTV."], idealSolution: "Start with the strategic question: what problem is subscription solving? If 60% of revenue is already repeat customers, the retention problem may be solved, the real problem might be acquisition cost or occasional buyer LTV. Subscriptions make sense if replenishment is regular (skincare typically 30-90 day cycle) and the primary barrier to repeat purchase is friction (having to remember to reorder) not price or satisfaction. Run the cannibalization model: if 40% of ad-hoc repeaters convert to subscription at 15% discount, what happens to short-term revenue? Subscription pricing: 10-20% discount with clear value communication. Operational complexity is underestimated: failed payment recovery, churn prediction, pause vs cancel, flexible frequency. Cancellation flow is a brand signal, make it easy. Start with a pilot to top 20% of customers by purchase frequency.", hints: ["60% repeat customers buying ad hoc, is that a problem? Does subscription actually solve anything?","If you convert your best customers to subscription at 15% discount, what happens to short-term revenue?","A skincare product lasts 45 days for some customers and 90 for others. How does your subscription handle that?","What's the cancellation experience, and why does it matter more than most teams think?","Which customers do you offer subscription to first, and how do you test whether it's working?"] },
      { title: 'International Expansion', problem: "A US e-commerce brand ($50M revenue) is considering expanding to the UK and Germany. They've received inbound European interest but have no international infrastructure. Walk me through how you'd evaluate this and structure the first 12 months.", keyComponents: ["Validate unit economics first: landed cost (product + shipping + customs + VAT) for a European consumer","UK and Germany are fundamentally different markets: language, consumer rights law, payment methods","GDPR compliance is a hard legal requirement, not optional","UK first: English, similar consumer behavior, lower regulatory barrier than Germany","Phased: UK months 1-6, evaluate, then Germany if UK works, don't split focus","Germany's consumer protection law: 30-day right of return by law, SEPA payment method common","Local 3PL or Amazon FBA for fulfillment to avoid customs complexity for UK launch"], idealSolution: "The inbound interest is a demand signal, not a go signal. First validate economics: what does the full landed cost (product + international shipping + customs + VAT) do to the effective price for a European consumer? If unit economics don't work, no localization fixes it. Market sequencing: start with UK not Germany. UK is English-language, similar consumer behavior, no product labeling changes required. Germany has stronger consumer protection laws (30-day return right by law), German-language content required, SEPA as common payment method. Regulatory baseline for both: GDPR compliance (data residency, consent mechanisms), VAT registration once revenue thresholds are hit. Phased plan: months 1-3, UK soft launch using UK 3PL or Amazon FBA, price in GBP, cards only. Months 4-6, evaluate UK economics. Months 7-12, if UK works, begin Germany planning. Don't split focus between two markets in year 1.", hints: ["Inbound interest from European customers, does that mean they'll buy once you make it easy?","UK and Germany, are those two similar bets, or fundamentally different markets?","What does customs duty and VAT do to your prices in Germany, and how do European consumers react?","GDPR is a legal requirement. When do you need to have it sorted?","A German customer returns a product 25 days after purchase. Under EU law, do they have the right to a refund?"] },
    ],
  },
  'Technical Program Manager': {
    'General': [
      { title: 'API Platform Migration', problem: "A company has 15 internal teams calling each other via 200+ point-to-point REST APIs. When one service changes, 10 teams break. You're asked to drive migration to a central API gateway in 9 months. Walk me through your program approach.", keyComponents: ["Dependency mapping: pull logs to find the real integration graph, not the architecture diagram","API gateway standards (versioning, auth, rate limiting, deprecation) must be defined before migration begins","Topological sort: migrate leaf services first (fewest dependents) to reduce blast radius","Migration support team: teams won't self-migrate, need either mandates, incentives, or dedicated help","Dual-run period: traffic shifts through both old and new path simultaneously before cutover","Automated contract testing: API changes that break consumers are caught in CI, not production","Decommission old integrations only after monitoring shows zero traffic for 30 days"], idealSolution: "Month 1 is foundational. Map the actual integration graph by pulling API logs, not the architecture diagram. This typically reveals 3x more integrations than documented. Simultaneously define API gateway standards with a working group: versioning policy, auth approach, rate limiting, deprecation process. Month 2: build migration tooling and contract testing (Pact or similar) so any API change that breaks a consumer is caught in CI. Month 3-7: migrate in topological order, leaf services first, then mid-tier, then core services. Each migration has a dual-run period with comparison testing. Teams won't self-migrate without pressure, get executive alignment on the deadline and a migration support team (2-3 engineers) who pair with teams. Month 8: core services migrate. Month 9: decommission old integrations after 30 days of zero traffic.", hints: ["You think there are 200 integrations. How do you find out if there are actually 350?","You need teams to migrate voluntarily. What happens if a team says they're too busy?","Which services do you migrate first, and why doesn't 'start with the most important ones' work?","How do you know when it's safe to decommission an old integration?","An API change in service A breaks teams B, C, and D. How does your post-migration architecture prevent this?"] },
      { title: 'Org Restructuring Program', problem: "A 300-person engineering organization is restructuring from functional teams to 12 product-aligned squads. A major product launch is in 45 days. The CTO wants restructuring complete in 60 days. Walk me through how you'd manage this.", keyComponents: ["45-day launch is inviolable, protect those engineers from any team movement until day 46","Announcement must include every individual's placement, leaving TBD causes attrition within a week","Restructure in two phases: non-launch teams first (days 1-45), launch team after day 46","Shared services ambiguity in squad model: infra, platform, security need explicit ownership","Simultaneous announcement to all of engineering, anyone not in the first meeting hears from a colleague","90-day knowledge transfer period after structural move, functional expertise takes months to distribute","Track morale and attrition weekly for 90 days post-restructure"], idealSolution: "The 45-day launch is inviolable. Identify every engineer on the launch critical path and exclude them from team movement until day 46. The restructuring effectively happens in two phases: phase 1 (days 1-45) reorganizes teams not involved in the launch; phase 2 (days 46-60) completes with the launch team. Communication timeline is the most sensitive element: announce to all of engineering simultaneously with full squad structure, leadership assignments, and individual placement for every engineer. Leaving 'TBD' on squad assignments for more than 1 week causes anxiety and attrition. Shared services (infra, platform, security) are the common failure point, need explicit ownership: either a shared services squad with internal SLAs, or embedded engineers with on-call rotation. Plan a 90-day knowledge transfer period. Track morale and attrition weekly for 90 days post-restructure.", hints: ["You have a major launch in 45 days and a restructuring in 60. What happens if you don't sequence carefully?","You announce a restructuring. Within 48 hours, 3 engineers have updated their LinkedIn. What went wrong?","In the new squad model, who owns cloud infrastructure? Every squad? A platform team?","An engineer moves from the backend team to a product squad. How long before they're effective?","You finish the 60-day restructuring. How do you know if it's working 90 days later?"] },
    ],
    'Healthcare': [
      { title: 'EHR Implementation Program', problem: "A 1,200-bed hospital system is implementing Epic EHR across 8 facilities, replacing 3 legacy systems. 3,000 clinical staff need training. Go-live is in 18 months and tied to a state reporting deadline. $40M budget. Walk me through your program approach.", keyComponents: ["Clinical workflow redesign before Epic build begins, you're configuring to workflows, not the other way","Physician champions: 2-3 per department participate in build and later advocate to peers","Training is the highest-risk phase: role-specific, not generic, with hands-on practice environment","Phased go-live: one facility per wave with 2-week command center embedded in each unit","Go-live requires 24/7 on-site clinical super-users and Epic analysts for first 2 weeks","15% contingency reserve, Epic implementations routinely encounter scope creep","State reporting deadline is immovable: back-plan every milestone from that date"], idealSolution: "Epic implementation follows Epic's defined methodology, the TPM's job is ensuring disciplined execution. Months 1-3: workflow redesign with clinical champions in every department before build begins. Physician champions (2-3 per department) participate in build decisions and advocate to peers, without physician buy-in, Epic go-lives fail because physicians route around the system. Months 4-8: system build and configuration. Months 9-12: parallel testing and training, training is highest-risk. 4-6 hours of role-specific training per person with hands-on practice in a training environment. Months 13-18: go-live in waves, one facility at a time, with a 2-week embedded command center per facility (Epic analysts and super-users in every unit 24/7). Hold 15% budget in contingency. State deadline is immovable, back-plan every milestone and surface risks monthly.", hints: ["Every Epic implementation has training as the highest-risk phase. Why, and what does your plan do about it?","A surgeon says she won't change how she documents because it takes twice as long. How do you handle that?","You have 8 facilities. Do you go live all at once or in waves?","Go-live is in 2 weeks and training completion is at 60%. What do you do?","The implementation is $5M over budget in month 12. What do you tell leadership?"] },
      { title: 'Value-Based Care Program', problem: "A health system is transitioning 50,000 attributed patients from fee-for-service to a value-based care contract. They'll be accountable for total cost of care and quality metrics in 12 months. No value-based care infrastructure exists today. Walk me through the program.", keyComponents: ["Claims data integration from the payer is foundational, you cannot manage what you cannot measure","Risk stratification: top 5% of patients drive 50% of costs, intervene proactively with this group","Care management team: nurse care managers and social workers focused on the high-risk cohort","Physician engagement: share attribution lists and performance data with every PCP","HEDIS quality metrics require specific workflow interventions built into clinical workflow","Set realistic expectations: 12 months builds infrastructure and closes quality gaps, doesn't bend the cost curve","Payer contract terms: understand exactly how savings and quality are calculated before building anything"], idealSolution: "First 90 days are infrastructure, not intervention. Negotiate claims data feeds from the payer immediately, this takes 60-90 days to establish. Without seeing where attributed patients get care across all facilities, you cannot manage cost of care. Build a risk stratification model combining claims data (prior utilization, chronic conditions, ER frequency) with clinical data to identify the top 5% driving 50% of costs. Month 3-6: stand up a care management team focused on this high-risk cohort, nurse care managers and social workers doing proactive outreach to prevent avoidable hospitalizations. Physician engagement: share attribution lists and performance data with every PCP, they need to know which patients are attributed and how they're performing on quality metrics. HEDIS measures require specific workflow interventions built into clinical workflow. Set realistic leadership expectations: 12 months builds infrastructure and closes quality gaps, not significantly bending the cost curve.", hints: ["You're accountable for total cost of care including care outside your system. How do you see that data?","The top 5% of your patients drive 50% of costs. How do you find them, and what do you do differently?","Your PCPs don't know which of their patients are in the value-based contract. Why does that matter?","A quality metric requires annual mammography for attributed women 50-74. How do you close that gap?","Leadership expects the program to be profitable in year 1. Is that realistic?"] },
    ],
    'Fintech': [
      { title: 'Core Banking Modernization', problem: "A mid-size bank is replacing its 30-year-old core banking system. The migration affects $8B in deposits, 400,000 accounts, and 200 downstream systems. Downtime must be under 4 hours. Walk me through the program.", keyComponents: ["Parallel run is non-negotiable: run old and new systems simultaneously with daily reconciliation before cutover","Account migration in tranches by account type, not all 400,000 at once","200 downstream systems all need to point to new core, dual-write period during migration","4-hour downtime window requires a choreographed cutover playbook rehearsed 3 times","Rollback plan must be fully executable within the 4-hour window","OCC/Fed require 90-day advance notification and a contingency plan","No proceeds to cutover until 30 consecutive days of 100% reconciliation match"], idealSolution: "Governing principle: no surprises, no irreversible steps. Four phases. Phase 1 (months 1-6): shadow mode, new core receives all transactions alongside the old, with daily reconciliation of every account balance, transaction, and ledger entry. Do not proceed to cutover until 30 consecutive days of 100% match. Phase 2 (months 7-9): downstream migration, update all 200 systems to support new core APIs with dual-write to both cores. Phase 3 (months 10-11): dress rehearsals, run the full cutover playbook 3 times in non-production with production data volumes, timed each time. If you can't complete in 4 hours in rehearsal, you can't in production. Phase 4 (month 12): production cutover at 3am Sunday. Freeze transactions, migrate in-flight items, flip all downstream connections, run validation suite. Rollback trigger: if any validation fails, rollback executes immediately (also rehearsed).", hints: ["How do you know the new core has the same balances as the old one before you cut over?","You have 200 downstream systems, ATMs, mobile app, wire transfers. How do you migrate them without everything breaking at once?","Your cutover window is 4 hours at 3am on a Sunday. How do you prove you can do it in 4 hours?","The cutover starts and at hour 3, a critical validation check fails. What do you do?","The OCC is your regulator. What do they need to know, and when?"] },
      { title: 'Open Finance Platform', problem: "A large bank has been ordered by regulators to implement open banking APIs in 18 months, allowing third-party apps to access customer account data with consent. This requires new API infrastructure, a consent management system, and changes to 12 core systems. Walk me through the program.", keyComponents: ["Regulatory deadline is hard, fines for non-compliance, not just reputational risk","Consent management is the most complex new component: explicit, auditable, and revocable","API security: OAuth2/FIDO standards, not basic auth","Developer sandbox must be ready at month 12 to allow 6 months of third-party testing and remediation","Data scope defined by regulators: start there, not with what's easiest to build","12 core systems need API adapters, prioritize by which data types are mandated first","Pen test at month 15: bugs found by external developers in production are the worst outcome"], idealSolution: "Regulatory deadline structures everything, work backward from month 18, identify what must be done by month 12 to allow 6 months of testing and remediation. Three parallel workstreams. Workstream 1: consent management, customer portal (authorize specific third parties for specific data scopes), consent API (third parties verify consent before accessing data), consent audit log (every access logged immutably). Workstream 2: API development, implement regulatory-mandated API specifications (FAPI 2.0 or equivalent). Each of 12 core systems needs an adapter layer, prioritized by mandated data types. Developer portal with sandbox at month 3. Workstream 3: security and compliance, OAuth2/FIDO auth, penetration testing, regulatory submission package. Third-party beta testing at month 12. Program governance: steering committee with CTO, CCO, and CRO meeting weekly, this is a legal and risk program, not just tech.", hints: ["The regulator says 'open banking APIs in 18 months.' How do you know exactly what they want built?","A customer authorizes App X to see their balance. Six months later, they change their mind. How does your system handle revocation?","You need third-party developers to test their integrations. How do they do that before production?","The core deposits system team says they can't deliver their API adapter for 14 months. You need it in 10.","Your pen test at month 15 finds a critical vulnerability. You have 3 months until the regulatory deadline."] },
    ],
    'E-commerce': [
      { title: 'Same-Day Delivery Launch', problem: "A major online retailer wants to launch same-day delivery in 10 cities in 6 months from zero same-day infrastructure. This requires fulfillment node placement, carrier partnerships, and order management changes. Ops, tech, and supply chain teams have never worked together at this scale. Walk me through your approach.", keyComponents: ["City sequencing: rank by existing warehouse proximity (within 20-30 miles), demand density, carrier availability","City 1 as learning lab: launch and validate economics before any other city","Carrier model: owned fleet takes 12+ months; gig delivery (DoorDash Drive, Uber Direct) is the only realistic 6-month option","Tech is the critical path: order management changes (cutoff logic, inventory reservation per city node) take 3-4 months of engineering","Single integrated plan across ops, tech, supply chain, not separate plans reconciled at weekly meetings","Go/no-go gate based on city 1 economics before cities 2-5 launch","Unit economics per city: if delivery costs more than revenue contribution, don't scale"], idealSolution: "Six months for 10 cities is aggressive, lives or dies on sequencing and a single integrated plan. City selection: rank all 10 by existing warehouse proximity, demand density, and carrier availability. Highest-ranked city becomes the learning lab in months 1-3 before any other city launches. Carrier model: building an owned fleet takes 12+ months. Gig delivery networks (DoorDash Drive, Uber Direct) can launch in 6-8 weeks but have higher per-delivery cost and less control, for a 6-month timeline, gig delivery is the only realistic option for initial launch. Tech is the critical path: order management changes (cutoff time logic, 2-hour delivery window selection, real-time inventory reservation at city-level fulfillment node) typically take 3-4 months. Start immediately. Program structure: one integrated plan with ops, tech, and supply chain in a single program review, no separate plans. City 1 go-live month 4. Go/no-go gate based on city 1 economics before cities 2-5.", hints: ["Which city do you launch first, and what does that decision depend on?","Same-day needs a fulfillment center within 20 miles. Your nearest warehouse is 60 miles away, what do you do?","Building a delivery fleet takes 12 months. You have 6. What's your carrier strategy?","Ops, tech, and supply chain have never worked together like this. What breaks first?","You launch in city 1. Unit economics are $12 revenue and $18 cost per delivery. What do you do?"] },
      { title: 'Marketplace Trust and Safety Program', problem: "A marketplace has a growing problem: 3% of 5 million sellers are bad actors, counterfeits, fraud, policy violations, causing $200M in annual losses and declining trust. You're leading a cross-functional trust and safety program. Walk me through the approach.", keyComponents: ["ML-powered risk scoring at scale: 5 million sellers can't be manually reviewed","Enforcement spectrum: warning → listing removal → account suspension → legal, graduated, not binary","Pre-publication review for high-risk categories: don't wait for buyer complaints","Rights holder brand portal for DMCA-style counterfeit takedown requests","Appeals process: wrongly suspended legitimate sellers need 48-hour expedited resolution","Measure by buyer complaint rate per 1,000 transactions and GMV at risk, not accounts banned","Cross-functional governance: policy, legal, engineering, and operations in weekly program review"], idealSolution: "Tiered approach: automation handles volume, humans handle edge cases. Three layers. Layer 1: prevention, risk-score every new seller at onboarding by business type, category intent, and document quality. Apply proportional friction. Cheaper than enforcement after harm is done. Layer 2: detection, ML-based listing risk scoring running on every new listing before it goes live in high-risk categories (electronics, luxury goods, pharmaceuticals). Rights holders get a brand portal for DMCA-style takedown requests, they're your best counterfeit detection partners. Layer 3: enforcement, graduated response (warning → listing removal → suspension → permanent ban + legal). Wrongly banning legitimate sellers is expensive: 48-hour expedited appeals with a dedicated team. Governance: weekly cross-functional meeting with policy, legal, engineering, and operations. Measure by buyer complaint rate and GMV at risk, not accounts actioned.", hints: ["You have 5 million sellers. You can't review them all manually. How do you find the bad actors?","Your enforcement wrongly suspends 5,000 legitimate sellers in one week. What's your response?","Luxury brands are your best counterfeit detection partners. How do you actually work with them?","Should you review listings before they go live or after? Does your answer change by category?","Leadership wants to know if the program is working. What metrics do you report?"] },
    ],
  },
}

/* ── Company interviewer personas for Mock Interview mode ── */
export const COMPANY_PERSONAS = {
  Anthropic: {
    color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA',
    icon: '',
    tagline: 'Safety-first, deeply reasoned',
    interviewerStyle: `You are a senior interviewer at Anthropic. Anthropic values: (1) careful, nuanced reasoning over speed, (2) explicitly acknowledging uncertainty and tradeoffs, (3) safety and alignment considerations in every system design, (4) intellectual honesty, push back hard on overconfident claims, (5) thinking about second-order effects and failure modes. You expect candidates to reason out loud, name their assumptions, and proactively identify risks in their own proposals. A great Anthropic answer is thoughtful and thorough, not fast and confident.`,
    scoringEmphasis: 'Weight reasoning quality and intellectual honesty heavily. Penalize overconfidence. Reward explicit acknowledgment of tradeoffs and failure modes.',
    nudgeStyle: 'Ask the candidate to consider what could go wrong with their approach, or what assumptions they might be making that could fail.',
  },
  OpenAI: {
    color: '#059669', bg: '#ECFDF5', border: '#A7F3D0',
    icon: '⚡',
    tagline: 'Move fast, ship impactful products',
    interviewerStyle: `You are a senior interviewer at OpenAI. OpenAI values: (1) speed and iteration, get something working and improve it, (2) strong opinions on what will have the most impact, (3) practical deployment thinking, not just research but how it gets to users, (4) comfort with ambiguity and rapid pivots, (5) thinking at scale, millions of users. Push candidates to make concrete decisions quickly rather than endlessly exploring options. A great OpenAI answer is decisive and focused on impact.`,
    scoringEmphasis: 'Weight decisiveness, practical thinking, and impact orientation. Penalize analysis paralysis. Reward concrete proposals with clear success metrics.',
    nudgeStyle: 'Push the candidate to commit to a specific approach and explain how they would ship it in the next 30 days.',
  },
  Google: {
    color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE',
    icon: '',
    tagline: 'Scale, rigor, and data-driven thinking',
    interviewerStyle: `You are a senior interviewer at Google. Google values: (1) systems thinking at massive scale, design for billions of users, (2) data-driven decisions, push for metrics and measurement plans, (3) technical depth and rigorous engineering, (4) structured problem-solving (STAR, structured frameworks), (5) cross-functional thinking, how does this interact with other systems? Push candidates to think about edge cases, scale bottlenecks, and measurement. A great Google answer is structured, data-informed, and scale-aware.`,
    scoringEmphasis: 'Weight structured thinking, scale considerations, and measurement plans. Penalize hand-wavy answers without metrics. Reward explicit edge case handling.',
    nudgeStyle: 'Ask the candidate how they would measure success and what happens when this system needs to handle 100x the current volume.',
  },
  Meta: {
    color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
    icon: '',
    tagline: 'Social impact, open source, moving fast',
    interviewerStyle: `You are a senior interviewer at Meta. Meta values: (1) social impact at scale, how does this affect real human behavior and communities, (2) open source mindset, would this be worth sharing with the world, (3) speed and pragmatism, done is better than perfect, (4) cross-platform thinking, mobile, web, AR/VR, (5) advertising and monetization awareness. Push candidates to think about user behavior, network effects, and real-world adoption. A great Meta answer is user-obsessed and pragmatic.`,
    scoringEmphasis: 'Weight user impact thinking, pragmatism, and adoption strategy. Penalize over-engineering. Reward network effect thinking and behavior change considerations.',
    nudgeStyle: 'Ask the candidate how real users will actually adopt and engage with this, and what the network effects look like.',
  },
  Microsoft: {
    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
    icon: '',
    tagline: 'Enterprise-grade, cloud-first, partner ecosystem',
    interviewerStyle: `You are a senior interviewer at Microsoft. Microsoft values: (1) enterprise readiness, security, compliance, SLAs, (2) Azure and cloud-native thinking, (3) integration with the existing Microsoft ecosystem (Teams, Office, Azure), (4) partner and customer obsession, long-term enterprise relationships, (5) responsible AI, governance, auditability, enterprise trust. Push candidates to think about enterprise procurement, compliance requirements, and how solutions integrate into existing customer environments. A great Microsoft answer is enterprise-grade and ecosystem-aware.`,
    scoringEmphasis: 'Weight enterprise readiness, compliance thinking, and ecosystem integration. Penalize consumer-only thinking. Reward governance and auditability considerations.',
    nudgeStyle: 'Ask the candidate how a Fortune 500 enterprise IT team would approve and deploy this solution, and what compliance requirements they need to consider.',
  },
  Amazon: {
    color: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
    icon: '',
    tagline: 'Customer obsession, leadership principles',
    interviewerStyle: `You are a senior interviewer at Amazon. Amazon values: (1) customer obsession, start with the customer and work backwards, (2) ownership, think like an owner, not a renter, (3) invent and simplify, the best solution is often simpler than you think, (4) dive deep, get into the details, don't stay at the surface, (5) deliver results, what are the measurable outcomes? Expect candidates to anchor every decision to the customer impact. Push them to be specific about metrics, owners, and timelines. A great Amazon answer starts with the customer problem and works backwards to the solution.`,
    scoringEmphasis: 'Weight customer-backward thinking, ownership mentality, and specificity about metrics and results. Penalize vague answers. Reward explicit customer impact framing.',
    nudgeStyle: 'Ask the candidate to start over from the customer perspective, who is the customer, what is their specific problem, and how does this solution measurably improve their life?',
  },
  Nvidia: {
    color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0',
    icon: '️',
    tagline: 'GPU-first, compute infrastructure, developer ecosystem',
    interviewerStyle: `You are a senior interviewer at Nvidia. Nvidia values: (1) deep technical expertise, compute, parallelism, hardware-software co-design, (2) developer ecosystem thinking, how do you make developers successful on Nvidia platforms, (3) performance obsession, what are the bottlenecks and how do you eliminate them, (4) platform thinking, CUDA, cuDNN, Triton, the full stack, (5) AI infrastructure at scale, training and inference pipelines for frontier models. Push candidates to think about compute efficiency, hardware constraints, and developer experience. A great Nvidia answer is technically deep and performance-aware.`,
    scoringEmphasis: 'Weight technical depth, compute efficiency thinking, and developer experience. Penalize hardware-ignorant solutions. Reward explicit performance bottleneck analysis.',
    nudgeStyle: 'Ask the candidate where the compute bottleneck is in their proposed solution and how they would profile and optimize it for GPU execution.',
  },
};
