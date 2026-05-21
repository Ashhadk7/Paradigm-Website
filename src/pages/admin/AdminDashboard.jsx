import { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Image as ImageIcon, LogOut, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { publishContentUpdate } from '../../lib/useContent';

const PAGES = [
  {
    key: 'home',
    label: 'Home',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'trust_stat_1_value', label: 'Trust Strip — Stat 1 Value', type: 'text' },
      { name: 'trust_stat_1_label', label: 'Trust Strip — Stat 1 Label', type: 'text' },
      { name: 'trust_stat_2_value', label: 'Trust Strip — Stat 2 Value', type: 'text' },
      { name: 'trust_stat_2_label', label: 'Trust Strip — Stat 2 Label', type: 'text' },
      { name: 'trust_stat_3_value', label: 'Trust Strip — Stat 3 Value', type: 'text' },
      { name: 'trust_stat_3_label', label: 'Trust Strip — Stat 3 Label', type: 'text' },
      { name: 'trust_stat_3_sub', label: 'Trust Strip — Stat 3 Sub-label', type: 'text' },
      { name: 'trust_stat_4_value', label: 'Trust Strip — Stat 4 Value', type: 'text' },
      { name: 'trust_stat_4_label', label: 'Trust Strip — Stat 4 Label', type: 'text' },
      { name: 'trust_stat_5_value', label: 'Trust Strip — Stat 5 Value', type: 'text' },
      { name: 'trust_stat_5_label', label: 'Trust Strip — Stat 5 Label', type: 'text' },
      { name: 'what_we_see_headline', label: 'What We See — Headline', type: 'textarea' },
      { name: 'obs_1', label: 'Observation 01', type: 'textarea' },
      { name: 'obs_2', label: 'Observation 02', type: 'textarea' },
      { name: 'obs_3', label: 'Observation 03', type: 'textarea' },
      { name: 'story_1', label: 'The Story — Paragraph 1', type: 'textarea' },
      { name: 'story_2', label: 'The Story — Paragraph 2', type: 'textarea' },
      { name: 'story_3', label: 'The Story — Paragraph 3', type: 'textarea' },
      { name: 'story_4', label: 'The Story — Paragraph 4', type: 'textarea' },
      { name: 'platform_text', label: 'The Platform — Body Text', type: 'textarea' },
      { name: 'proof_body', label: 'Proof — Body Text', type: 'textarea' },
      { name: 'proof_bridge', label: 'Proof — Bridge Text (gold italic)', type: 'textarea' },
      { name: 'cta_advisor_text', label: 'CTA — For Advisors Text', type: 'textarea' },
      { name: 'cta_institution_text', label: 'CTA — For Institutions Text', type: 'textarea' },
    ],
  },
  {
    key: 'advisors',
    label: 'For Advisors',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'hero_cta_label', label: 'Hero CTA Button', type: 'text' },
      { name: 'core_story_eyebrow', label: 'Core Story — Eyebrow', type: 'text' },
      { name: 'core_story_1', label: 'Core Story — Paragraph 1', type: 'textarea' },
      { name: 'core_story_2', label: 'Core Story — Paragraph 2', type: 'textarea' },
      { name: 'core_story_3', label: 'Core Story — Paragraph 3', type: 'textarea' },
      { name: 'core_story_4', label: 'Core Story — Paragraph 4', type: 'textarea' },
      { name: 'practice_eyebrow', label: 'Practice Consequences — Eyebrow', type: 'text' },
      { name: 'practice_headline', label: 'Practice Consequences — Headline', type: 'text' },
      { name: 'practice_sub', label: 'Practice Consequences — Subheading', type: 'text' },
      { name: 'consequence_1_label', label: 'Consequence 01 — Label', type: 'text' },
      { name: 'consequence_1_title', label: 'Consequence 01 — Title', type: 'text' },
      { name: 'consequence_1_body', label: 'Consequence 01 — Body', type: 'textarea' },
      { name: 'consequence_2_label', label: 'Consequence 02 — Label', type: 'text' },
      { name: 'consequence_2_title', label: 'Consequence 02 — Title', type: 'text' },
      { name: 'consequence_2_body', label: 'Consequence 02 — Body', type: 'textarea' },
      { name: 'consequence_3_label', label: 'Consequence 03 — Label', type: 'text' },
      { name: 'consequence_3_title', label: 'Consequence 03 — Title', type: 'text' },
      { name: 'consequence_3_body', label: 'Consequence 03 — Body', type: 'textarea' },
      { name: 'platform_eyebrow', label: 'Platform Capability — Eyebrow', type: 'text' },
      { name: 'platform_headline', label: 'Platform Capability — Headline', type: 'text' },
      { name: 'platform_para1', label: 'Platform Capability — Paragraph 1', type: 'textarea' },
      { name: 'platform_para2', label: 'Platform Capability — Paragraph 2', type: 'textarea' },
      { name: 'delivery_eyebrow', label: 'Delivery — Eyebrow', type: 'text' },
      { name: 'delivery_headline', label: 'Delivery — Headline', type: 'text' },
      { name: 'delivery_sub', label: 'Delivery — Subheading', type: 'text' },
      { name: 'delivery_1_tag', label: 'Delivery Option 01 — Tag', type: 'text' },
      { name: 'delivery_1_tagline', label: 'Delivery Option 01 — Tagline', type: 'text' },
      { name: 'delivery_1_body', label: 'Delivery Option 01 — Body', type: 'textarea' },
      { name: 'delivery_2_tag', label: 'Delivery Option 02 — Tag', type: 'text' },
      { name: 'delivery_2_tagline', label: 'Delivery Option 02 — Tagline', type: 'text' },
      { name: 'delivery_2_body', label: 'Delivery Option 02 — Body', type: 'textarea' },
      { name: 'proof_body', label: 'Proof — Body Text', type: 'textarea' },
      { name: 'proof_bridge', label: 'Proof — Bridge Text', type: 'textarea' },
      { name: 'cta_title', label: 'CTA — Headline', type: 'textarea' },
      { name: 'cta_contact_prefix', label: 'CTA — Contact Prefix', type: 'text' },
      { name: 'cta_email', label: 'CTA — Email', type: 'text' },
      { name: 'cta_phone', label: 'CTA — Phone', type: 'text' },
      { name: 'cta_button_label', label: 'CTA — Button Label', type: 'text' },
    ],
  },
  {
    key: 'familyoffice',
    label: 'For Family Offices',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'hero_cta_label', label: 'Hero CTA Button', type: 'text' },
      { name: 'core_story_eyebrow', label: 'Core Story — Eyebrow', type: 'text' },
      { name: 'core_story_1', label: 'Core Story — Paragraph 1', type: 'textarea' },
      { name: 'core_story_2', label: 'Core Story — Paragraph 2', type: 'textarea' },
      { name: 'core_story_3', label: 'Core Story — Paragraph 3', type: 'textarea' },
      { name: 'core_story_4', label: 'Core Story — Paragraph 4', type: 'textarea' },
      { name: 'offers_eyebrow', label: 'Family Office Offers — Eyebrow', type: 'text' },
      { name: 'offers_headline', label: 'Family Office Offers — Headline', type: 'text' },
      { name: 'offers_sub', label: 'Family Office Offers — Subheading', type: 'textarea' },
      { name: 'offer_1_label', label: 'Offer 01 — Label', type: 'text' },
      { name: 'offer_1_title', label: 'Offer 01 — Title', type: 'text' },
      { name: 'offer_1_body', label: 'Offer 01 — Body', type: 'textarea' },
      { name: 'offer_2_label', label: 'Offer 02 — Label', type: 'text' },
      { name: 'offer_2_title', label: 'Offer 02 — Title', type: 'text' },
      { name: 'offer_2_body', label: 'Offer 02 — Body', type: 'textarea' },
      { name: 'offer_3_label', label: 'Offer 03 — Label', type: 'text' },
      { name: 'offer_3_title', label: 'Offer 03 — Title', type: 'text' },
      { name: 'offer_3_body', label: 'Offer 03 — Body', type: 'textarea' },
      { name: 'platform_ops_title', label: 'Platform Operations — Title', type: 'text' },
      { name: 'platform_ops_body', label: 'Platform Operations — Body', type: 'textarea' },
      { name: 'platform_ops_body_2', label: 'Platform Operations — Body 2', type: 'textarea' },
      { name: 'proof_body', label: 'Proof — Body Text', type: 'textarea' },
      { name: 'proof_bridge', label: 'Proof — Bridge Text', type: 'textarea' },
      { name: 'cta_title', label: 'CTA — Headline', type: 'textarea' },
      { name: 'cta_email', label: 'CTA — Email', type: 'text' },
      { name: 'cta_phone', label: 'CTA — Phone', type: 'text' },
      { name: 'cta_button_label', label: 'CTA — Button Label', type: 'text' },
    ],
  },
  {
    key: 'institutions',
    label: 'For Institutions',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'platform_para1', label: 'The Platform — Paragraph 1', type: 'textarea' },
      { name: 'platform_para2', label: 'The Platform — Paragraph 2', type: 'textarea' },
    ],
  },
  {
    key: 'process',
    label: 'Our Process',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'data_foundation_text', label: 'Data Foundation — Paragraph 1', type: 'textarea' },
      { name: 'data_foundation_amd', label: 'Data Foundation — AMD Paragraph', type: 'textarea' },
      { name: 'step1_title', label: 'Step 01 — Title', type: 'text' },
      { name: 'step1_text', label: 'Step 01 — Body', type: 'textarea' },
      { name: 'step2_title', label: 'Step 02 — Title', type: 'text' },
      { name: 'step2_para1', label: 'Step 02 — Paragraph 1', type: 'textarea' },
      { name: 'step2_para2', label: 'Step 02 — Paragraph 2', type: 'textarea' },
      { name: 'step3_title', label: 'Step 03 — Title', type: 'text' },
      { name: 'step3_text', label: 'Step 03 — Body', type: 'textarea' },
      { name: 'step4_title', label: 'Step 04 — Title', type: 'text' },
      { name: 'step4_text', label: 'Step 04 — Body', type: 'textarea' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'james_title', label: 'James Francis — Title', type: 'text' },
      { name: 'james_bio_1', label: 'James Francis — Bio Paragraph 1', type: 'textarea' },
      { name: 'james_bio_2', label: 'James Francis — Bio Paragraph 2', type: 'textarea' },
      { name: 'james_bio_3', label: 'James Francis — Bio Paragraph 3', type: 'textarea' },
      { name: 'james_image_url', label: 'James Francis — Photo', type: 'image' },
    ],
  },
];

const HOME_SECTIONS = [
  {
    number: '01',
    title: 'Hero',
    description: 'Opening headline, supporting copy, and eyebrow shown at the top of the homepage.',
    fields: ['hero_eyebrow', 'hero_headline', 'hero_sub'],
  },
  {
    number: '02',
    title: 'Trust Strip',
    description: 'The five proof points displayed immediately below the homepage hero.',
    compact: true,
    fields: [
      'trust_stat_1_value',
      'trust_stat_1_label',
      'trust_stat_2_value',
      'trust_stat_2_label',
      'trust_stat_3_value',
      'trust_stat_3_label',
      'trust_stat_3_sub',
      'trust_stat_4_value',
      'trust_stat_4_label',
      'trust_stat_5_value',
      'trust_stat_5_label',
    ],
  },
  {
    number: '03',
    title: 'What We See',
    description: 'Homepage observation headline and the three numbered observation blocks.',
    fields: ['what_we_see_headline', 'obs_1', 'obs_2', 'obs_3'],
  },
  {
    number: '04',
    title: 'The Story',
    description: 'Narrative paragraphs explaining specialization, market leadership, and rotation.',
    fields: ['story_1', 'story_2', 'story_3', 'story_4'],
  },
  {
    number: '05',
    title: 'Platform',
    description: 'Platform body copy shown in the off-white homepage section.',
    fields: ['platform_text'],
  },
  {
    number: '06',
    title: 'Proof',
    description: 'Institutional proof block and bridge statement.',
    fields: ['proof_body', 'proof_bridge'],
  },
  {
    number: '07',
    title: 'Closing CTA',
    description: 'Final advisor and institution call-to-action copy.',
    fields: ['cta_advisor_text', 'cta_institution_text'],
  },
];

const PAGE_SECTIONS = {
  advisors: [
    {
      number: '01',
      title: 'Hero',
      description: 'Opening advisor page hero copy and primary button label.',
      fields: ['hero_eyebrow', 'hero_headline', 'hero_sub', 'hero_cta_label'],
    },
    {
      number: '02',
      title: 'Core Story',
      description: 'The four narrative paragraphs below the advisor hero.',
      fields: ['core_story_eyebrow', 'core_story_1', 'core_story_2', 'core_story_3', 'core_story_4'],
    },
    {
      number: '03',
      title: 'Practice Consequences',
      description: 'Section heading and three consequence cards for advisors.',
      fields: [
        'practice_eyebrow',
        'practice_headline',
        'practice_sub',
        'consequence_1_label',
        'consequence_1_title',
        'consequence_1_body',
        'consequence_2_label',
        'consequence_2_title',
        'consequence_2_body',
        'consequence_3_label',
        'consequence_3_title',
        'consequence_3_body',
      ],
      compact: true,
    },
    {
      number: '04',
      title: 'Platform Capability',
      description: 'Platform heading and the two body paragraphs.',
      fields: ['platform_eyebrow', 'platform_headline', 'platform_para1', 'platform_para2'],
    },
    {
      number: '05',
      title: 'Delivery',
      description: 'Section heading and the two delivery option cards.',
      fields: [
        'delivery_eyebrow',
        'delivery_headline',
        'delivery_sub',
        'delivery_1_tag',
        'delivery_1_tagline',
        'delivery_1_body',
        'delivery_2_tag',
        'delivery_2_tagline',
        'delivery_2_body',
      ],
      compact: true,
    },
    {
      number: '06',
      title: 'Proof',
      description: 'Institutional proof block copy on the advisor page.',
      fields: ['proof_body', 'proof_bridge'],
    },
    {
      number: '07',
      title: 'Closing CTA',
      description: 'Final advisor call-to-action and contact details.',
      fields: ['cta_title', 'cta_contact_prefix', 'cta_email', 'cta_phone', 'cta_button_label'],
    },
  ],
  familyoffice: [
    {
      number: '01',
      title: 'Hero',
      description: 'Opening family office page hero copy and primary button label.',
      fields: ['hero_eyebrow', 'hero_headline', 'hero_sub', 'hero_cta_label'],
    },
    {
      number: '02',
      title: 'Core Story',
      description: 'The four narrative paragraphs below the family office hero.',
      fields: ['core_story_eyebrow', 'core_story_1', 'core_story_2', 'core_story_3', 'core_story_4'],
    },
    {
      number: '03',
      title: 'Family Office Offers',
      description: 'Section heading and three offer cards for family offices.',
      fields: [
        'offers_eyebrow',
        'offers_headline',
        'offers_sub',
        'offer_1_label',
        'offer_1_title',
        'offer_1_body',
        'offer_2_label',
        'offer_2_title',
        'offer_2_body',
        'offer_3_label',
        'offer_3_title',
        'offer_3_body',
      ],
      compact: true,
    },
    {
      number: '04',
      title: 'Operational Consequence',
      description: 'Operational consequence eyebrow and two body paragraphs.',
      fields: ['platform_ops_title', 'platform_ops_body', 'platform_ops_body_2'],
    },
    {
      number: '05',
      title: 'Proof',
      description: 'Institutional proof block copy on the family office page.',
      fields: ['proof_body', 'proof_bridge'],
    },
    {
      number: '06',
      title: 'Closing CTA',
      description: 'Final family office call-to-action and contact details.',
      fields: ['cta_title', 'cta_email', 'cta_phone', 'cta_button_label'],
    },
  ],
};

const PAGE_DEFAULTS = {
  advisors: {
    hero_eyebrow: "For Wealth Advisors & Independent RIAs",
    hero_headline: "Your clients are paying active management fees. Most of that capital is locked inside a single strategy's approach. There is a different way to invest it.",
    hero_sub: "Paradigm builds portfolios from active market data — not anchored to any single approach. Portfolios that can move as market leadership moves. Under your name.",
    hero_cta_label: "Book a 20-Minute Call",
    core_story_eyebrow: "The Core Story",
    core_story_1: "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is not a limitation — it is the source of their edge. It is also the boundary they cannot cross without leaving what they genuinely know how to do.",
    core_story_2: "When market leadership rotates outside those boundaries, the strategy lags. Not because of a mistake. Because following the rotation would mean leaving the domain of real competence. The clients who hired that strategy wait for the cycle to come back around.",
    core_story_3: "Paradigm reads active market data to identify where leadership is forming within each mandate right now — and constructs portfolios from that signal. Not anchored to any single approach. Not waiting for a cycle to reverse.",
    core_story_4: "The result is a portfolio that can move as leadership moves. Something no single strategy built around a defined approach can do — because doing it would mean abandoning the expertise that defines them.",
    practice_eyebrow: "What This Means for Your Practice",
    practice_headline: "Three specific consequences",
    practice_sub: "For independent advisors and wealth managers.",
    consequence_1_label: "Consequence 01",
    consequence_1_title: "A proprietary investment story",
    consequence_1_body: "Your clients receive something no other advisor on any platform can replicate. Built from the market's full signal. Not any single strategy's approach. Presented under your name.",
    consequence_2_label: "Consequence 02",
    consequence_2_title: "Better economics",
    consequence_2_body: "Replace active strategies charging 65 to 100 basis points with portfolios built from collective market intelligence at a fraction of that cost. The margin difference stays with you.",
    consequence_3_label: "Consequence 03",
    consequence_3_title: "Tax efficiency on active strategies",
    consequence_3_body: "Run tax-loss harvesting on the active sleeve using the same workflow you already use for direct indexing. You operate it. Paradigm enables it. Your clients get better after-tax outcomes from both sleeves simultaneously.",
    platform_eyebrow: "The Platform Capability",
    platform_headline: "One platform. Three capabilities.",
    platform_para1: "Custom active strategies built to your specification, SMA conversion of existing fund exposures into customizable tax-aware portfolios, and direct and custom indexing at scale. Customization, personalization, and tax-loss harvesting run across all three — at the individual client level. You operate it. Paradigm enables it.",
    platform_para2: "Most advisors manage these capabilities across multiple vendors, multiple processes, and multiple stories for clients. Paradigm consolidates them. One relationship. One interface. One coherent investment narrative for every client conversation.",
    delivery_eyebrow: "How It's Delivered",
    delivery_headline: "Two ways to work with Paradigm.",
    delivery_sub: "The capability is identical in both.",
    delivery_1_tag: "Self-Serve Platform",
    delivery_1_tagline: "You build it. You run it.",
    delivery_1_body: "Access Paradigm's platform directly. Customize portfolios to your specification. Run customization, personalization, and tax-loss harvesting across both the active and indexed sleeves from a single interface. Your custodian. Your brand. Your decisions at every step.",
    delivery_2_tag: "White Glove Service",
    delivery_2_tagline: "We build it. You run it.",
    delivery_2_body: "Paradigm builds the portfolio to your specification. It sits on the platform. You operate the personalization and tax-loss harvesting for your clients from there. The investment process is yours. The construction is Paradigm's. Your clients see your name on everything.",
    proof_body: "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.",
    proof_bridge: "The same investment intelligence is now available to independent advisors and multi-family offices.",
    cta_title: "Worth 20 minutes to see what this looks like for your practice?",
    cta_contact_prefix: "Or reach us directly:",
    cta_email: "jef@paradigmasset.com",
    cta_phone: "917-991-3348",
    cta_button_label: "Book a 20-Minute Call",
  },
  familyoffice: {
    hero_eyebrow: "For Multi-Family Offices & OCIOs",
    hero_headline: "Your clients expect portfolios built for them specifically. Most platforms offer portfolios built for everyone. There is a different approach.",
    hero_sub: "Paradigm builds portfolios to your specification for any client mandate — using collective intelligence to identify regime leadership within each mandate and qualify it through active market data. Your investment team operates the platform. Your clients see your process.",
    hero_cta_label: "Start a Conversation",
    core_story_eyebrow: "The Core Story",
    core_story_1: "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is a real edge. It is also a structural constraint: when market leadership shifts outside those boundaries, the strategy lags and waits.",
    core_story_2: "Most family offices manage this by diversifying across managers and styles. It is a reasonable approach. It is also operationally complex — multiple manager relationships, multiple mandates to monitor, multiple performance narratives to maintain for clients across the family structure.",
    core_story_3: "Paradigm identifies where regime leadership is forming within each mandate and qualifies that signal through collective intelligence. From that signal Paradigm builds a Portfolio Blueprint — a portfolio whose characteristics match what the market is rewarding within the mandate right now. Your investment team defines the parameters. Paradigm manufactures the portfolio. Your clients see your firm's process.",
    core_story_4: "The result is institutional-quality portfolio construction at the mandate level — without the overhead of building that capability in-house.",
    offers_eyebrow: "What Paradigm Offers Family Offices",
    offers_headline: "Three applications of the same capability.",
    offers_sub: "Each addresses a specific operational or investment challenge for multi-family offices.",
    offer_1_label: "Custom Mandates",
    offer_1_title: "Built to your specification.",
    offer_1_body: "Every portfolio starts with the mandate your investment team defines. Style, geography, factor tilts, ESG constraints, thematic exposure. Paradigm identifies regime leadership within that mandate and builds the Portfolio Blueprint from the qualified collective intelligence signal.",
    offer_2_label: "Platform Operations",
    offer_2_title: "You operate it. Paradigm enables it.",
    offer_2_body: "Customization, personalization, and tax-loss harvesting run across custom active, SMA conversion, and direct indexing — at the individual client account level. Your investment team runs these tools. Paradigm provides the infrastructure and the investment intelligence.",
    offer_3_label: "White Glove Build",
    offer_3_title: "We build it. You run it.",
    offer_3_body: "Paradigm builds the portfolio to your specification. It sits on the platform. Your team operates the personalization and tax-loss harvesting from there. The investment process is yours. The construction is Paradigm's. Your clients see your firm's name on everything.",
    platform_ops_title: "The Operational Consequence",
    platform_ops_body: "Most multi-family offices manage active mandates through relationships with multiple style-specific managers. Each brings genuine expertise within their domain. Each also brings coordination overhead — performance monitoring across multiple mandates, attribution reporting across multiple accounts, and a different investment rationale for each manager in every client review.",
    platform_ops_body_2: "Paradigm consolidates that into one process. One relationship. One coherent investment narrative across every client, every mandate, and every committee meeting that asks how the portfolio is positioned and why.",
    proof_body: "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.",
    proof_bridge: "The same investment intelligence is now available to multi-family offices and family office platforms.",
    cta_title: "Paradigm builds portfolios the way your clients expect them to be built — to their specific mandate, informed by current market intelligence, presented as your firm's own process.",
    cta_email: "jef@paradigmasset.com",
    cta_phone: "917-991-3348",
    cta_button_label: "Start a Conversation",
  },
};

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('home');
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const page = PAGES.find(p => p.key === activePage);
  const fieldsByName = new Map(page?.fields.map(field => [field.name, field]) || []);
  const completedFields = page?.fields.filter(field => Boolean(content[field.name]?.trim?.() || content[field.name])).length || 0;
  const completionTotal = page?.fields.length || 0;

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(async () => {
      setLoading(true);
      setSaved(false);
      const { data } = await supabase
        .from('page_content')
        .select('content')
        .eq('page_key', activePage)
        .single();

      if (!cancelled) {
        setContent({ ...(PAGE_DEFAULTS[activePage] || {}), ...(data?.content || {}) });
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activePage]);

  function updateField(name, value) {
    setContent(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page_key: activePage,
        content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_key' });

    if (!error) {
      publishContentUpdate(activePage, content);
      setSaved(true);
    }
    setSaving(false);
  }

  async function handleImageUpload(fieldName, file) {
    if (!file) return;
    const ext = file.name.split('.').pop();
    const fileName = `${fieldName}-${file.lastModified}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    updateField(fieldName, data.publicUrl);
  }

  async function handleImageRemove(fieldName) {
    const url = content[fieldName];
    if (url) {
      const path = url.split('/images/')[1];
      if (path) {
        await supabase.storage.from('images').remove([path]);
      }
    }
    updateField(fieldName, '');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  function renderField(field, compact = false) {
    const isLongText = field.type === 'textarea';

    return (
      <div key={field.name} style={compact ? styles.compactFieldGroup : styles.fieldGroup}>
        <div style={styles.labelRow}>
          <label style={styles.label}>{field.label}</label>
          <span style={styles.fieldType}>{field.type === 'image' ? 'Image' : isLongText ? 'Long text' : 'Short text'}</span>
        </div>
        {isLongText ? (
          <textarea
            value={content[field.name] || ''}
            onChange={e => updateField(field.name, e.target.value)}
            style={compact ? styles.compactTextarea : styles.textarea}
            rows={field.name.startsWith('story_') || field.name.startsWith('obs_') ? 5 : 4}
          />
        ) : field.type === 'image' ? (
          <div style={styles.imageField}>
            {content[field.name] ? (
              <div style={styles.imagePreviewWrap}>
                <img src={content[field.name]} alt={field.label} style={styles.imagePreview} />
                <button onClick={() => handleImageRemove(field.name)} style={styles.imageRemoveBtn}>Remove</button>
              </div>
            ) : (
              <label style={styles.imageUploadLabel}>
                <ImageIcon size={16} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImageUpload(field.name, e.target.files[0])}
                />
              </label>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={content[field.name] || ''}
            onChange={e => updateField(field.name, e.target.value)}
            style={compact ? styles.compactInput : styles.input}
          />
        )}
      </div>
    );
  }

  function renderHomeFields() {
    return (
      <div style={styles.homeEditorShell}>
        <aside style={styles.editorOverview}>
          <div style={styles.overviewCard}>
            <div style={styles.overviewIcon}>
              <FileText size={18} />
            </div>
            <h2 style={styles.overviewTitle}>Homepage CMS</h2>
            <p style={styles.overviewText}>
              Content is grouped in the same order it appears on the public homepage.
            </p>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: completionTotal ? `${(completedFields / completionTotal) * 100}%` : '0%',
                }}
              />
            </div>
            <div style={styles.progressMeta}>
              <span>{completedFields} filled</span>
              <span>{completionTotal} fields</span>
            </div>
          </div>

          <div style={styles.sectionNavCard}>
            <p style={styles.sectionNavLabel}>Sections</p>
            {HOME_SECTIONS.map(section => (
              <a key={section.title} href={`#home-${section.title.toLowerCase().replaceAll(' ', '-')}`} style={styles.sectionNavLink}>
                <span style={styles.sectionNavNumber}>{section.number}</span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </aside>

        <div style={styles.sectionStack}>
          <div style={styles.homeIntroPanel}>
            <div>
              <p style={styles.homeIntroKicker}>Paradigm Homepage</p>
              <h2 style={styles.homeIntroTitle}>Manage the homepage in the same sequence visitors experience it.</h2>
            </div>
            <div style={styles.homeIntroRule} />
          </div>

          {HOME_SECTIONS.map(section => (
            <section
              key={section.title}
              id={`home-${section.title.toLowerCase().replaceAll(' ', '-')}`}
              style={styles.editorSection}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{section.number}</span>
                <div style={styles.sectionHeaderCopy}>
                  <p style={styles.sectionEyebrow}>Homepage Section</p>
                  <h2 style={styles.sectionTitle}>{section.title}</h2>
                  <p style={styles.sectionDescription}>{section.description}</p>
                </div>
                <span style={styles.sectionCount}>{section.fields.length} fields</span>
              </div>
              <div style={section.compact ? styles.compactSectionFields : styles.sectionFields}>
                {section.fields.map(name => fieldsByName.get(name)).filter(Boolean).map(field => renderField(field, section.compact))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  function renderSectionedFields(sections) {
    return (
      <div style={styles.homeEditorShell}>
        <aside style={styles.editorOverview}>
          <div style={styles.overviewCard}>
            <div style={styles.overviewIcon}>
              <FileText size={18} />
            </div>
            <h2 style={styles.overviewTitle}>{page?.label} CMS</h2>
            <p style={styles.overviewText}>
              Content is grouped in the same order it appears on the public page.
            </p>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: completionTotal ? `${(completedFields / completionTotal) * 100}%` : '0%',
                }}
              />
            </div>
            <div style={styles.progressMeta}>
              <span>{completedFields} filled</span>
              <span>{completionTotal} fields</span>
            </div>
          </div>

          <div style={styles.sectionNavCard}>
            <p style={styles.sectionNavLabel}>Sections</p>
            {sections.map(section => (
              <a key={section.title} href={`#${activePage}-${section.title.toLowerCase().replaceAll(' ', '-')}`} style={styles.sectionNavLink}>
                <span style={styles.sectionNavNumber}>{section.number}</span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </aside>

        <div style={styles.sectionStack}>
          <div style={styles.homeIntroPanel}>
            <div>
              <p style={styles.homeIntroKicker}>Paradigm {page?.label}</p>
              <h2 style={styles.homeIntroTitle}>Manage every visible section from the page without changing its structure.</h2>
            </div>
            <div style={styles.homeIntroRule} />
          </div>

          {sections.map(section => (
            <section
              key={section.title}
              id={`${activePage}-${section.title.toLowerCase().replaceAll(' ', '-')}`}
              style={styles.editorSection}
            >
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>{section.number}</span>
                <div style={styles.sectionHeaderCopy}>
                  <p style={styles.sectionEyebrow}>Page Section</p>
                  <h2 style={styles.sectionTitle}>{section.title}</h2>
                  <p style={styles.sectionDescription}>{section.description}</p>
                </div>
                <span style={styles.sectionCount}>{section.fields.length} fields</span>
              </div>
              <div style={section.compact ? styles.compactSectionFields : styles.sectionFields}>
                {section.fields.map(name => fieldsByName.get(name)).filter(Boolean).map(field => renderField(field, section.compact))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoIcon}>P</div>
          <div>
            <div style={styles.logoTitle}>PARADIGM</div>
            <div style={styles.logoSub}>CMS</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <p style={styles.navLabel}>PAGES</p>
          {PAGES.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              style={{
                ...styles.navItem,
                ...(activePage === p.key ? styles.navItemActive : {}),
              }}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={14} />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.pageKicker}>Website Content</p>
            <h1 style={styles.pageTitle}>{page?.label}</h1>
          </div>
          <div style={styles.topBarActions}>
            {saved && (
              <span style={styles.savedBadge}>
                <CheckCircle2 size={14} />
                Saved
              </span>
            )}
            <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : (
          activePage === 'home' ? renderHomeFields() : PAGE_SECTIONS[activePage] ? renderSectionedFields(PAGE_SECTIONS[activePage]) : (
            <div style={styles.fields}>
              {page?.fields.map(renderField)}
            </div>
          )
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F5F3EF',
  },
  sidebar: {
    width: 272,
    background: '#1a2240',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 0',
    flexShrink: 0,
    borderRight: '1px solid rgba(196,162,91,0.22)',
    boxShadow: 'inset -1px 0 0 rgba(245,243,239,0.04)',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '0 1.35rem',
    marginBottom: '2.25rem',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 3,
    background: '#C4A25B',
    color: '#34416D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontWeight: 700,
    fontSize: '1.05rem',
  },
  logoTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.06em',
    color: '#F5F3EF',
    lineHeight: 1,
  },
  logoSub: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.18em',
    color: 'rgba(245,243,239,0.55)',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  nav: {
    flex: 1,
  },
  navLabel: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: 'rgba(245,243,239,0.38)',
    padding: '0 1.35rem',
    marginBottom: '0.7rem',
  },
  navItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '0.78rem 1.35rem',
    background: 'none',
    border: 'none',
    color: 'rgba(245,243,239,0.68)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(196,162,91,0.12)',
    color: '#C4A25B',
    fontWeight: 800,
    boxShadow: 'inset 3px 0 0 #C4A25B',
  },
  logoutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    margin: '1rem 1.35rem 0',
    padding: '0.65rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 3,
    color: 'rgba(245,243,239,0.62)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '1.65rem clamp(1.25rem, 3vw, 3rem) 3rem',
    overflowY: 'auto',
    maxHeight: '100vh',
    background:
      'linear-gradient(90deg, rgba(52,65,109,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(52,65,109,0.035) 1px, transparent 1px), #F5F3EF',
    backgroundSize: '56px 56px, 56px 56px, auto',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.4rem',
    padding: '0.25rem 0 1rem',
    borderBottom: '1px solid rgba(52,65,109,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 5,
    background: 'rgba(245,243,239,0.94)',
    backdropFilter: 'blur(14px)',
  },
  pageKicker: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#C4A25B',
    marginBottom: '0.2rem',
  },
  pageTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '2.1rem',
    color: '#34416D',
    margin: 0,
  },
  topBarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  savedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#27ae60',
    background: 'rgba(39,174,96,0.1)',
    padding: '0.35rem 0.75rem',
    borderRadius: '4px',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.72rem 1.35rem',
    background: '#C4A25B',
    color: '#34416D',
    border: 'none',
    borderRadius: 3,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.76rem',
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    boxShadow: '0 10px 24px rgba(196,162,91,0.22)',
  },
  loadingText: {
    fontFamily: 'Inter, sans-serif',
    color: '#637890',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    maxWidth: 720,
    background: '#ffffff',
    border: '1px solid rgba(52,65,109,0.08)',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  homeEditorShell: {
    display: 'grid',
    gridTemplateColumns: 'minmax(230px, 292px) minmax(0, 920px)',
    alignItems: 'start',
    gap: '1.35rem',
  },
  editorOverview: {
    position: 'sticky',
    top: 108,
    display: 'grid',
    gap: '0.85rem',
  },
  overviewCard: {
    background: '#34416D',
    color: '#ffffff',
    borderRadius: 4,
    padding: '1.25rem',
    border: '1px solid rgba(196,162,91,0.22)',
    boxShadow: '0 22px 46px rgba(52,65,109,0.16)',
    position: 'relative',
    overflow: 'hidden',
  },
  overviewIcon: {
    width: 36,
    height: 36,
    borderRadius: 3,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(196,162,91,0.15)',
    color: '#C4A25B',
    marginBottom: '0.85rem',
  },
  overviewTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.38rem',
    lineHeight: 1.2,
    margin: 0,
    color: '#ffffff',
  },
  overviewText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.72)',
    margin: '0.55rem 0 1rem',
  },
  progressTrack: {
    height: 7,
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#C4A25B',
    borderRadius: 999,
    transition: 'width 0.2s ease',
  },
  progressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.55rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.66)',
  },
  sectionNavCard: {
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(52,65,109,0.1)',
    borderRadius: 4,
    padding: '0.85rem',
    boxShadow: '0 12px 28px rgba(52,65,109,0.05)',
  },
  sectionNavLabel: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: 'rgba(52,65,109,0.45)',
    marginBottom: '0.45rem',
  },
  sectionNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    padding: '0.55rem 0.5rem',
    borderRadius: 3,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#34416D',
    textDecoration: 'none',
  },
  sectionNavNumber: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#C4A25B',
    minWidth: 24,
  },
  sectionStack: {
    display: 'grid',
    gap: '1.1rem',
  },
  homeIntroPanel: {
    background: '#1a2240',
    color: '#F5F3EF',
    borderRadius: 4,
    padding: '1.55rem 1.65rem',
    border: '1px solid rgba(196,162,91,0.24)',
    boxShadow: '0 24px 54px rgba(52,65,109,0.14)',
    display: 'grid',
    gap: '1.1rem',
    overflow: 'hidden',
  },
  homeIntroKicker: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.67rem',
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#C4A25B',
    marginBottom: '0.55rem',
  },
  homeIntroTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.65rem',
    lineHeight: 1.15,
    fontWeight: 700,
    maxWidth: 620,
    color: '#F5F3EF',
    margin: 0,
  },
  homeIntroRule: {
    width: 180,
    height: 2,
    background: 'linear-gradient(90deg, #C4A25B 0%, transparent 100%)',
  },
  editorSection: {
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(52,65,109,0.1)',
    borderRadius: 4,
    boxShadow: '0 14px 34px rgba(52,65,109,0.055)',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'grid',
    gridTemplateColumns: '3.25rem minmax(0, 1fr) auto',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1.1rem',
    padding: '1.25rem 1.35rem',
    background: '#ffffff',
    borderBottom: '1px solid rgba(52,65,109,0.08)',
  },
  sectionNumber: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.7rem',
    fontWeight: 700,
    lineHeight: 1,
    color: '#C4A25B',
  },
  sectionHeaderCopy: {
    minWidth: 0,
  },
  sectionEyebrow: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.61rem',
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(52,65,109,0.48)',
    marginBottom: '0.2rem',
  },
  sectionTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.38rem',
    lineHeight: 1.1,
    color: '#34416D',
    margin: 0,
  },
  sectionDescription: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.82rem',
    lineHeight: 1.55,
    color: '#637890',
    marginTop: '0.35rem',
    maxWidth: 620,
  },
  sectionCount: {
    flexShrink: 0,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#C4A25B',
    background: 'rgba(196,162,91,0.1)',
    border: '1px solid rgba(196,162,91,0.2)',
    padding: '0.32rem 0.55rem',
    borderRadius: 3,
  },
  sectionFields: {
    display: 'grid',
    gap: '1.05rem',
    padding: '1.35rem',
  },
  compactSectionFields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '0.9rem',
    padding: '1.35rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    padding: '0.9rem',
    background: '#FBFAF7',
    border: '1px solid rgba(52,65,109,0.07)',
    borderRadius: 4,
  },
  compactFieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    padding: '0.85rem',
    background: '#FBFAF7',
    border: '1px solid rgba(52,65,109,0.07)',
    borderRadius: 4,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 800,
    color: '#34416D',
    letterSpacing: '0.03em',
  },
  fieldType: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.62rem',
    fontWeight: 700,
    color: 'rgba(99,120,144,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  input: {
    width: '100%',
    padding: '0.78rem 0.85rem',
    fontSize: '0.92rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.16)',
    borderRadius: 3,
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    boxSizing: 'border-box',
  },
  compactInput: {
    width: '100%',
    padding: '0.7rem 0.78rem',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.16)',
    borderRadius: 3,
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: 122,
    padding: '0.85rem 0.9rem',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.16)',
    borderRadius: 3,
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    resize: 'vertical',
    lineHeight: 1.68,
    boxSizing: 'border-box',
  },
  compactTextarea: {
    width: '100%',
    minHeight: 108,
    padding: '0.75rem 0.8rem',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.16)',
    borderRadius: 3,
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    resize: 'vertical',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  imageField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  imagePreviewWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  imagePreview: {
    width: 160,
    height: 200,
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid rgba(52,65,109,0.15)',
  },
  imageRemoveBtn: {
    padding: '0.4rem 0.85rem',
    background: '#c0392b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  imageUploadLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    padding: '0.65rem 1.25rem',
    background: '#34416D',
    color: '#ffffff',
    borderRadius: '6px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: 'fit-content',
  },
};
