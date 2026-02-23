export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 12,
    yearlyPrice: 10,
    highlight: false,
    bestFor: "Best for solo developers and early products",
    features: [
      "1 workspace",
      "Up to 3 members",
      "Unlimited boards and docs",
      "Timeline + workload view",
      "Activity history (30 days)",
      "3 native integrations",
      "Community support",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "team",
    name: "Team",
    monthlyPrice: 29,
    yearlyPrice: 23,
    highlight: true,
    bestFor: "Best for scaling product and engineering teams",
    features: [
      "5 workspaces",
      "Up to 25 members",
      "Unlimited boards and docs",
      "Custom workflows and automations",
      "Activity history (1 year)",
      "15 integrations + API access",
      "Priority support",
    ],
    cta: "Choose Team",
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: 59,
    yearlyPrice: 47,
    highlight: false,
    bestFor: "Best for agencies, studios, and enterprise programs",
    features: [
      "Unlimited workspaces",
      "Unlimited members",
      "Granular roles and approvals",
      "SSO and advanced permissions",
      "Unlimited history retention",
      "Unlimited integrations",
      "Dedicated success support",
    ],
    cta: "Contact Sales",
  },
];

export const comparisonCategories = [
  {
    id: "workspace",
    title: "Workspace & Planning",
    rows: [
      { feature: "Workspaces", starter: "1", team: "5", studio: "Unlimited" },
      { feature: "Boards and docs", starter: true, team: true, studio: true },
      { feature: "Timeline view", starter: true, team: true, studio: true },
      { feature: "Workload planning", starter: false, team: true, studio: true },
    ],
  },
  {
    id: "collaboration",
    title: "Collaboration & Controls",
    rows: [
      { feature: "Member limit", starter: "3", team: "25", studio: "Unlimited" },
      { feature: "Custom workflows", starter: false, team: true, studio: true },
      { feature: "Role permissions", starter: "Basic", team: "Advanced", studio: "Granular" },
      { feature: "Approvals", starter: false, team: true, studio: true },
    ],
  },
  {
    id: "security",
    title: "Security & Support",
    rows: [
      { feature: "SSO / SAML", starter: false, team: false, studio: true },
      { feature: "Audit history", starter: "30 days", team: "1 year", studio: "Unlimited" },
      { feature: "Integrations", starter: "3", team: "15", studio: "Unlimited" },
      { feature: "Support tier", starter: "Community", team: "Priority", studio: "Dedicated" },
    ],
  },
];

export const pricingBenefits = [
  {
    id: "launch",
    icon: "Rocket",
    title: "Ship Faster",
    description: "Teams move from planning to delivery with fewer status bottlenecks.",
  },
  {
    id: "visibility",
    icon: "Activity",
    title: "Real-Time Visibility",
    description: "Live progress, blockers, and ownership stay clear across every project.",
  },
  {
    id: "automation",
    icon: "Bot",
    title: "Automation Built-In",
    description: "Reduce repetitive updates with workflow automations and rules.",
  },
  {
    id: "security",
    icon: "ShieldCheck",
    title: "Secure by Default",
    description: "Role-based access and audit trails keep collaboration controlled.",
  },
  {
    id: "integration",
    icon: "Puzzle",
    title: "Connected Stack",
    description: "Bring commits, tickets, and team updates into one focused workspace.",
  },
  {
    id: "scale",
    icon: "TrendingUp",
    title: "Scales with Teams",
    description: "From startup sprinting to enterprise programs, Zyplo keeps pace.",
  },
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
