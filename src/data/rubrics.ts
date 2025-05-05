export const rubrics = {
  "product-sense": [
    {
      criterion: "Clarify the Prompt",
      emoji: "🧠",
      scores: [
        { score: 1, description: "Jumped straight into solutions without asking clarifying questions. Didn't consider broader business context or user needs." },
        { score: 2, description: "Asked some clarifying questions but stayed at the surface. Limited consideration of Discord's business or product stage." },
        { score: 3, description: "Asked thoughtful clarifying questions, understood the core business problem, and surfaced success criteria." },
        { score: 4, description: "Framed the overarching vision, translated the problem into company-wide goals, and challenged assumptions when appropriate." },
      ],
    },
    {
      criterion: "Understand Users and Their Problems",
      emoji: "👥",
      scores: [
        { score: 1, description: "Lacked user empathy. Focused on one segment only or relied on personal experience without broad consideration." },
        { score: 2, description: "Identified some user segments and their needs but didn't go deep or broad. Missed edge cases or complexity." },
        { score: 3, description: "Clearly articulated multiple user segments and their pain points. Considered 'day in the life' and jobs-to-be-done." },
        { score: 4, description: "Showed deep empathy, broke down complexity into primitives, and called out tradeoffs or unresolvable issues with elegance." },
      ],
    },
    {
      criterion: "Explore and Prioritize Solutions",
      emoji: "💡",
      scores: [
        { score: 1, description: "Presented ad-hoc ideas without structure. No clear prioritization or rationale behind solutions." },
        { score: 2, description: "Introduced a prioritization framework but used inconsistently. Limited user empathy in tradeoffs." },
        { score: 3, description: "Used structured thinking (e.g., 80/20, first principles) and identified tradeoffs thoughtfully." },
        { score: 4, description: "Considered multiple approaches with pros and cons, tied priorities to user problems, and did intuitive impact sizing." },
      ],
    },
    {
      criterion: "Execute on an MVP",
      emoji: "🚀",
      scores: [
        { score: 1, description: "Couldn't scope an MVP. Provided vague or incomplete solution without addressing user needs clearly." },
        { score: 2, description: "Proposed a basic MVP, but lacked UX clarity or failed to justify scope." },
        { score: 3, description: "Delivered a scoped solution with thoughtful UX. Communicated tradeoffs and success metrics clearly." },
        { score: 4, description: "Delivered an elegant, delightful MVP. Prioritized well, simplified UX, scoped dependencies, and called out risks." },
      ],
    },
  ],
}; 