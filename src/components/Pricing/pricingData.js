export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "For solo developers moving fast with clear task ownership.",
    monthlyPrice: 12,
    yearlyPrice: 10,
    highlight: false,
    included: "Tasks, docs, and boards for focused personal delivery.",
    features: [
      "1 workspace",
      "Up to 3 members",
      "Kanban boards and docs",
      "Activity history (30 days)",
      "Community support",
    ],
    cta: "Start Starter",
  },
  {
    id: "team",
    name: "Team",
    description: "For product teams that need shared visibility and fast handoffs.",
    monthlyPrice: 29,
    yearlyPrice: 23,
    highlight: true,
    included: "Roles, notifications, integrations, and deeper project controls.",
    features: [
      "5 workspaces",
      "Up to 25 members",
      "Unlimited boards and docs",
      "Activity history (1 year)",
      "Priority support",
    ],
    cta: "Start Team",
  },
  {
    id: "studio",
    name: "Studio",
    description: "For agencies and studios coordinating multiple client streams.",
    monthlyPrice: 59,
    yearlyPrice: 47,
    highlight: false,
    included: "Advanced governance and support for multi-team delivery.",
    features: [
      "Unlimited workspaces",
      "Unlimited members",
      "Granular roles and approvals",
      "Unlimited history retention",
      "Dedicated success support",
    ],
    cta: "Contact Sales",
  },
];

export const comparisonRows = [
  { feature: "Workspaces", starter: "1", team: "5", studio: "Unlimited" },
  { feature: "Boards", starter: "Unlimited", team: "Unlimited", studio: "Unlimited" },
  { feature: "Docs", starter: "Included", team: "Included", studio: "Included" },
  { feature: "Activity History", starter: "30 days", team: "1 year", studio: "Unlimited" },
  { feature: "Notifications", starter: "Basic", team: "Advanced", studio: "Advanced" },
  { feature: "Roles", starter: "Member/Admin", team: "Custom roles", studio: "Custom roles" },
  { feature: "Integrations", starter: "3", team: "15", studio: "Unlimited" },
  { feature: "Support", starter: "Community", team: "Priority", studio: "Dedicated" },
];

export const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade any time, and billing prorates automatically.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Every paid plan starts with a 14-day trial and no credit card is required.",
  },
  {
    q: "Do you offer discounts for students or open-source?",
    a: "Yes. We offer discounted Team plans for verified student and open-source maintainers.",
  },
  {
    q: "What counts as a member?",
    a: "Any person with edit access to workspaces, boards, or docs counts as a member.",
  },
  {
    q: "Do you support SSO?",
    a: "SSO is available on Studio with SAML-based providers.",
  },
  {
    q: "How do integrations work?",
    a: "Integrations connect notifications, commits, and issue activity directly into project context.",
  },
  {
    q: "Can I invite clients as read-only?",
    a: "Yes. Team and Studio support read-only collaborators for external visibility.",
  },
  {
    q: "How is billing handled for yearly plans?",
    a: "Yearly plans are billed once per year and include the published annual discount.",
  },
];

export const useCaseCards = [
  {
    id: "solo",
    icon: "User",
    title: "Solo developers",
    description: "Keep planning lean while you ship features without process overhead.",
    bestFit: "Best fit: Starter",
    bullets: ["Focused boards + docs in one workspace", "Enough history retention for weekly iteration"],
  },
  {
    id: "team",
    icon: "Users",
    title: "Product teams",
    description: "Coordinate handoffs across engineers, PMs, and designers with clear ownership.",
    bestFit: "Best fit: Team",
    bullets: ["Custom roles and richer notification controls", "Longer activity history for release traceability"],
  },
  {
    id: "studio",
    icon: "Building2",
    title: "Agencies / Studios",
    description: "Run multiple client tracks with stronger governance and integrations.",
    bestFit: "Best fit: Studio",
    bullets: ["Unlimited workspaces for multi-client delivery", "Higher integration limits and dedicated support"],
  },
];
