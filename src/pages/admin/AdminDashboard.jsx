import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, FileText, Image as ImageIcon, LogOut, Save } from 'lucide-react';
import { HOME_PRESENTATION_CONTROLS, SITE_PRESENTATION_CONTROLS, normalizePresentation } from '../../lib/presentationSchema';
import { supabase } from '../../lib/supabase';
import { publishContentUpdate } from '../../lib/useContent';
import { publishPresentationUpdate } from '../../lib/usePresentation';
import AgentPanel from './components/AgentPanel';

const PAGES = [
  {
    key: 'site',
    label: 'Site Shell',
    fields: [
      { name: 'brand_name', label: 'Brand Name', type: 'text' },
      { name: 'brand_descriptor', label: 'Brand Descriptor', type: 'text' },
      { name: 'nav_institutions', label: 'Navigation Institutions Label', type: 'text' },
      { name: 'nav_process', label: 'Navigation Process Label', type: 'text' },
      { name: 'nav_about', label: 'Navigation About Label', type: 'text' },
      { name: 'nav_contact', label: 'Navigation Contact Label', type: 'text' },
      { name: 'footer_strategies', label: 'Footer Strategies Label', type: 'text' },
      { name: 'footer_process', label: 'Footer Process Label', type: 'text' },
      { name: 'footer_team', label: 'Footer Team Label', type: 'text' },
      { name: 'footer_legal', label: 'Footer Legal Label', type: 'text' },
      { name: 'footer_contact', label: 'Footer Contact Label', type: 'text' },
      { name: 'footer_copyright', label: 'Footer Copyright', type: 'text' },
      { name: 'direct_email', label: 'Direct Email', type: 'text' },
      { name: 'direct_phone', label: 'Direct Phone', type: 'text' },
    ],
  },
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
      { name: 'hero_cta_label', label: 'Hero CTA Button', type: 'text' },
      { name: 'core_story_eyebrow', label: 'Core Story — Eyebrow', type: 'text' },
      { name: 'core_story_1', label: 'Core Story — Paragraph 1', type: 'textarea' },
      { name: 'core_story_2', label: 'Core Story — Paragraph 2', type: 'textarea' },
      { name: 'core_story_3', label: 'Core Story — Paragraph 3', type: 'textarea' },
      { name: 'core_story_4', label: 'Core Story — Paragraph 4', type: 'textarea' },
      { name: 'offers_eyebrow', label: 'Institution Offers — Eyebrow', type: 'text' },
      { name: 'offers_headline', label: 'Institution Offers — Headline', type: 'text' },
      { name: 'offers_sub', label: 'Institution Offers — Subheading', type: 'textarea' },
      { name: 'offer_1_label', label: 'Offer 01 — Label', type: 'text' },
      { name: 'offer_1_title', label: 'Offer 01 — Title', type: 'text' },
      { name: 'offer_1_body', label: 'Offer 01 — Body', type: 'textarea' },
      { name: 'offer_2_label', label: 'Offer 02 — Label', type: 'text' },
      { name: 'offer_2_title', label: 'Offer 02 — Title', type: 'text' },
      { name: 'offer_2_body', label: 'Offer 02 — Body', type: 'textarea' },
      { name: 'offer_3_label', label: 'Offer 03 — Label', type: 'text' },
      { name: 'offer_3_title', label: 'Offer 03 — Title', type: 'text' },
      { name: 'offer_3_body', label: 'Offer 03 — Body', type: 'textarea' },
      { name: 'platform_eyebrow', label: 'The Platform — Eyebrow', type: 'text' },
      { name: 'platform_para1', label: 'The Platform — Paragraph 1', type: 'textarea' },
      { name: 'platform_para2', label: 'The Platform — Paragraph 2', type: 'textarea' },
      { name: 'proof_eyebrow', label: 'Proof — Eyebrow', type: 'text' },
      { name: 'proof_body', label: 'Proof — Body Text', type: 'textarea' },
      { name: 'proof_bridge', label: 'Proof — Bridge Text', type: 'textarea' },
      { name: 'cta_title', label: 'CTA — Headline', type: 'textarea' },
      { name: 'cta_email', label: 'CTA — Email', type: 'text' },
      { name: 'cta_phone', label: 'CTA — Phone', type: 'text' },
      { name: 'cta_button_label', label: 'CTA — Button Label', type: 'text' },
    ],
  },
  {
    key: 'process',
    label: 'Our Process',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'data_foundation_eyebrow', label: 'Data Foundation — Eyebrow', type: 'text' },
      { name: 'data_foundation_text', label: 'Data Foundation — Paragraph 1', type: 'textarea' },
      { name: 'data_foundation_amd', label: 'Data Foundation — AMD Paragraph', type: 'textarea' },
      { name: 'process_eyebrow', label: 'Process — Eyebrow', type: 'text' },
      { name: 'process_intro', label: 'Process — Intro Text', type: 'textarea' },
      { name: 'step1_title', label: 'Step 01 — Title', type: 'text' },
      { name: 'step1_text', label: 'Step 01 — Body', type: 'textarea' },
      { name: 'step2_title', label: 'Step 02 — Title', type: 'text' },
      { name: 'step2_para1', label: 'Step 02 — Paragraph 1', type: 'textarea' },
      { name: 'step2_para2', label: 'Step 02 — Paragraph 2', type: 'textarea' },
      { name: 'step3_title', label: 'Step 03 — Title', type: 'text' },
      { name: 'step3_text', label: 'Step 03 — Body', type: 'textarea' },
      { name: 'step3_text_2', label: 'Step 03 — Body 2', type: 'textarea' },
      { name: 'step4_title', label: 'Step 04 — Title', type: 'text' },
      { name: 'step4_text', label: 'Step 04 — Body', type: 'textarea' },
      { name: 'step4_text_2', label: 'Step 04 — Body 2', type: 'textarea' },
      { name: 'black_box_eyebrow', label: 'No Black Box — Eyebrow', type: 'text' },
      { name: 'black_box_1', label: 'No Black Box — Paragraph 1', type: 'textarea' },
      { name: 'black_box_2', label: 'No Black Box — Paragraph 2', type: 'textarea' },
      { name: 'black_box_pullquote', label: 'No Black Box — Pull Quote', type: 'textarea' },
      { name: 'cta_intro', label: 'CTA — Intro Text', type: 'textarea' },
      { name: 'cta_advisor_eyebrow', label: 'CTA Advisor — Eyebrow', type: 'text' },
      { name: 'cta_advisor_text', label: 'CTA Advisor — Text', type: 'textarea' },
      { name: 'cta_advisor_button', label: 'CTA Advisor — Button', type: 'text' },
      { name: 'cta_institution_eyebrow', label: 'CTA Institution — Eyebrow', type: 'text' },
      { name: 'cta_institution_text', label: 'CTA Institution — Text', type: 'textarea' },
      { name: 'cta_institution_button', label: 'CTA Institution — Button', type: 'text' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'firm_eyebrow', label: 'Firm — Eyebrow', type: 'text' },
      { name: 'firm_1', label: 'Firm — Paragraph 1', type: 'textarea' },
      { name: 'firm_2', label: 'Firm — Paragraph 2', type: 'textarea' },
      { name: 'firm_3', label: 'Firm — Paragraph 3', type: 'textarea' },
      { name: 'james_title', label: 'James Francis — Title', type: 'text' },
      { name: 'james_name', label: 'James Francis — Name', type: 'text' },
      { name: 'james_bio_1', label: 'James Francis — Bio Paragraph 1', type: 'textarea' },
      { name: 'james_bio_2', label: 'James Francis — Bio Paragraph 2', type: 'textarea' },
      { name: 'james_bio_3', label: 'James Francis — Bio Paragraph 3', type: 'textarea' },
      { name: 'james_image_url', label: 'James Francis — Photo', type: 'image' },
      { name: 'james_image_alt', label: 'James Francis — Photo Alt Text', type: 'text' },
      { name: 'james_placeholder_initials', label: 'James Francis — Placeholder Initials', type: 'text' },
      { name: 'james_placeholder_text', label: 'James Francis — Placeholder Text', type: 'text' },
      { name: 'team_eyebrow', label: 'Team — Eyebrow', type: 'text' },
      { name: 'previous_prefix', label: 'Team — Previous Prefix', type: 'text' },
      { name: 'team_1_name', label: 'Team 01 — Name', type: 'text' },
      { name: 'team_1_title', label: 'Team 01 — Title', type: 'text' },
      { name: 'team_1_prev', label: 'Team 01 — Previous', type: 'text' },
      { name: 'team_1_bio', label: 'Team 01 — Bio', type: 'textarea' },
      { name: 'team_2_name', label: 'Team 02 — Name', type: 'text' },
      { name: 'team_2_title', label: 'Team 02 — Title', type: 'text' },
      { name: 'team_2_prev', label: 'Team 02 — Previous', type: 'text' },
      { name: 'team_2_bio', label: 'Team 02 — Bio', type: 'textarea' },
      { name: 'team_3_name', label: 'Team 03 — Name', type: 'text' },
      { name: 'team_3_title', label: 'Team 03 — Title', type: 'text' },
      { name: 'team_3_prev', label: 'Team 03 — Previous', type: 'text' },
      { name: 'team_3_bio', label: 'Team 03 — Bio', type: 'textarea' },
      { name: 'team_4_name', label: 'Team 04 — Name', type: 'text' },
      { name: 'team_4_title', label: 'Team 04 — Title', type: 'text' },
      { name: 'team_4_prev', label: 'Team 04 — Previous', type: 'text' },
      { name: 'team_4_bio', label: 'Team 04 — Bio', type: 'textarea' },
      { name: 'team_5_name', label: 'Team 05 — Name', type: 'text' },
      { name: 'team_5_title', label: 'Team 05 — Title', type: 'text' },
      { name: 'team_6_name', label: 'Team 06 — Name', type: 'text' },
      { name: 'team_6_title', label: 'Team 06 — Title', type: 'text' },
      { name: 'advisory_eyebrow', label: 'Advisory Board — Eyebrow', type: 'text' },
      { name: 'advisor_1_name', label: 'Advisor 01 — Name', type: 'text' },
      { name: 'advisor_1_title', label: 'Advisor 01 — Title', type: 'text' },
      { name: 'advisor_1_bio', label: 'Advisor 01 — Bio', type: 'textarea' },
      { name: 'advisor_2_name', label: 'Advisor 02 — Name', type: 'text' },
      { name: 'advisor_2_title', label: 'Advisor 02 — Title', type: 'text' },
      { name: 'advisor_2_bio', label: 'Advisor 02 — Bio', type: 'textarea' },
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
  site: [
    {
      number: '01',
      title: 'Brand and Navigation',
      description: 'Shared navigation identity and public route labels.',
      fields: ['brand_name', 'brand_descriptor', 'nav_institutions', 'nav_process', 'nav_about', 'nav_contact'],
    },
    {
      number: '02',
      title: 'Footer',
      description: 'Shared footer labels, contact details, and copyright.',
      fields: ['footer_strategies', 'footer_process', 'footer_team', 'footer_legal', 'footer_contact', 'footer_copyright', 'direct_email', 'direct_phone'],
    },
  ],
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
  institutions: [
    {
      number: '01',
      title: 'Hero',
      description: 'Opening institutions page hero copy and primary button label.',
      fields: ['hero_eyebrow', 'hero_headline', 'hero_sub', 'hero_cta_label'],
    },
    {
      number: '02',
      title: 'Core Story',
      description: 'The four narrative paragraphs below the institutions hero.',
      fields: ['core_story_eyebrow', 'core_story_1', 'core_story_2', 'core_story_3', 'core_story_4'],
    },
    {
      number: '03',
      title: 'Institution Offers',
      description: 'Section heading and three institution offer cards.',
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
      title: 'The Platform',
      description: 'Platform section eyebrow and two body paragraphs.',
      fields: ['platform_eyebrow', 'platform_para1', 'platform_para2'],
    },
    {
      number: '05',
      title: 'Proof',
      description: 'Institutional proof block copy.',
      fields: ['proof_eyebrow', 'proof_body', 'proof_bridge'],
    },
    {
      number: '06',
      title: 'Closing CTA',
      description: 'Final institutional call-to-action and contact details.',
      fields: ['cta_title', 'cta_email', 'cta_phone', 'cta_button_label'],
    },
  ],
  process: [
    {
      number: '01',
      title: 'Hero',
      description: 'Process page staggered hero headline.',
      fields: ['hero_headline'],
    },
    {
      number: '02',
      title: 'Data Foundation',
      description: 'Data foundation eyebrow and two body paragraphs.',
      fields: ['data_foundation_eyebrow', 'data_foundation_text', 'data_foundation_amd'],
    },
    {
      number: '03',
      title: 'Four Steps',
      description: 'Process section intro and all four process steps.',
      fields: [
        'process_eyebrow',
        'process_intro',
        'step1_title',
        'step1_text',
        'step2_title',
        'step2_para1',
        'step2_para2',
        'step3_title',
        'step3_text',
        'step3_text_2',
        'step4_title',
        'step4_text',
        'step4_text_2',
      ],
      compact: true,
    },
    {
      number: '04',
      title: 'Why No Black Box',
      description: 'No black box section eyebrow, body copy, and pull quote.',
      fields: ['black_box_eyebrow', 'black_box_1', 'black_box_2', 'black_box_pullquote'],
    },
    {
      number: '05',
      title: 'Closing CTA',
      description: 'Advisor and institution call-to-action blocks.',
      fields: [
        'cta_intro',
        'cta_advisor_eyebrow',
        'cta_advisor_text',
        'cta_advisor_button',
        'cta_institution_eyebrow',
        'cta_institution_text',
        'cta_institution_button',
      ],
    },
  ],
  about: [
    {
      number: '01',
      title: 'Hero',
      description: 'About page staggered hero headline.',
      fields: ['hero_headline'],
    },
    {
      number: '02',
      title: 'The Firm',
      description: 'Firm section eyebrow and three body paragraphs.',
      fields: ['firm_eyebrow', 'firm_1', 'firm_2', 'firm_3'],
    },
    {
      number: '03',
      title: 'Founder',
      description: 'James Francis profile copy and image settings.',
      fields: [
        'james_title',
        'james_name',
        'james_bio_1',
        'james_bio_2',
        'james_bio_3',
        'james_image_url',
        'james_image_alt',
        'james_placeholder_initials',
        'james_placeholder_text',
      ],
    },
    {
      number: '04',
      title: 'Team',
      description: 'Team section heading and all team member cards.',
      fields: [
        'team_eyebrow',
        'previous_prefix',
        'team_1_name',
        'team_1_title',
        'team_1_prev',
        'team_1_bio',
        'team_2_name',
        'team_2_title',
        'team_2_prev',
        'team_2_bio',
        'team_3_name',
        'team_3_title',
        'team_3_prev',
        'team_3_bio',
        'team_4_name',
        'team_4_title',
        'team_4_prev',
        'team_4_bio',
        'team_5_name',
        'team_5_title',
        'team_6_name',
        'team_6_title',
      ],
      compact: true,
    },
    {
      number: '05',
      title: 'Advisory Board',
      description: 'Advisory board heading and advisor cards.',
      fields: [
        'advisory_eyebrow',
        'advisor_1_name',
        'advisor_1_title',
        'advisor_1_bio',
        'advisor_2_name',
        'advisor_2_title',
        'advisor_2_bio',
      ],
      compact: true,
    },
  ],
};

const PAGE_DEFAULTS = {
  site: {
    brand_name: 'PARADIGM',
    brand_descriptor: 'Asset Management',
    nav_institutions: 'For Institutions',
    nav_process: 'Our Process',
    nav_about: 'About',
    nav_contact: 'Contact',
    footer_strategies: 'Strategies',
    footer_process: 'Process',
    footer_team: 'Team',
    footer_legal: 'Legal',
    footer_contact: 'Contact',
    footer_copyright: '© 2026 Paradigm Asset Management Co. LLC',
    direct_email: 'jef@paradigmasset.com',
    direct_phone: '212.771.6100',
  },
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
  institutions: {
    hero_eyebrow: "For Institutional Investors & Strategic Partners",
    hero_headline: "35 years of institutional investment process. The same intelligence that served General Motors, AMEX, and the US Treasury — now structured for the partnerships, mandates, and platforms that define what comes next.",
    hero_sub: "Paradigm reads active market data to identify where leadership is forming within each mandate — and builds portfolios from that signal. Transparent. Explainable. No black box.",
    hero_cta_label: "Start a Conversation",
    core_story_eyebrow: "The Core Story",
    core_story_1: "Every active strategy operates within the boundaries of its expertise. A manager running large cap value runs large cap value — with precision and pattern recognition built over years. That specialization is a genuine edge. It is also a structural constraint: when market leadership rotates outside those boundaries, the strategy lags. Not because of error. Because staying current with the rotation would mean operating outside the domain of real competence.",
    core_story_2: "Most institutional portfolios manage this by diversifying across managers and styles. It is a reasonable solution. It is also an expensive one — multiple management fees, multiple mandates to monitor, and a portfolio that reflects yesterday's allocation decisions more than today's market reality.",
    core_story_3: "Paradigm reads active market data to identify where leadership is forming within each mandate right now. From that signal Paradigm constructs portfolios not anchored to any single approach. Informed by the full picture of where returns are being found within each asset class today. Evaluated monthly. Rebalanced when the signal confirms a shift — not on a calendar schedule.",
    core_story_4: "The result is a portfolio built from collective market intelligence that no single strategy can replicate — because replicating it would require leaving the domain of its own expertise.",
    offers_eyebrow: "What Paradigm Offers Institutions",
    offers_headline: "Three distinct ways institutions work with Paradigm.",
    offers_sub: "Each is a different application of the same investment process.",
    offer_1_label: "Investment Mandates",
    offer_1_title: "Existing strategies. Institutional quality.",
    offer_1_body: "Large Cap Value. Domestic All-Cap All-Style. International Developed. World Value. Small Cap Domestic. Each strategy built from active market data. Each portfolio systematically positioned toward current market leadership within the mandate.",
    offer_2_label: "Custom Mandates",
    offer_2_title: "Any specification. Built to order.",
    offer_2_body: "Paradigm builds custom strategies to institutional specification. Any style, any geography, any thematic or ESG overlay. The same collective intelligence process — applied to the mandate the institution defines. No off-the-shelf products.",
    offer_3_label: "Strategic Partnerships",
    offer_3_title: "Platform. Sub-advisory. Distribution.",
    offer_3_body: "Paradigm is actively building strategic relationships with aggregators, OCIOs, and institutional platforms. Portfolio as a Service — product manufacturing, sub-advisory, and white-label delivery — at institutional scale.",
    platform_eyebrow: "The Platform",
    platform_para1: "One platform. Three capabilities. Custom active strategies, SMA conversion, and direct and custom indexing — fully integrated. Customization, personalization, and tax-loss harvesting run across all three — at the individual account level. Institutions operate the platform. Paradigm provides the investment intelligence and the infrastructure.",
    platform_para2: "For institutions managing assets across multiple mandates and account types, the operational consequence is significant. One process. One relationship. One coherent investment narrative across every client, every committee, and every regulatory filing that asks how the portfolio is positioned and why.",
    proof_eyebrow: "Proven Over 35 Years",
    proof_body: "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history. 65 of the nation's top 100 US pension funds have worked with Paradigm.",
    proof_bridge: "The same intelligence is now structured for the institutional partnerships that define what comes next.",
    cta_title: "Paradigm is actively building strategic relationships with institutional investors, pension funds, endowments, and platforms who want a different approach to portfolio construction.",
    cta_email: "jef@paradigmasset.com",
    cta_phone: "917-991-3348",
    cta_button_label: "Start a Conversation",
  },
  process: {
    hero_headline: "Systematic.\nTransparent.\nExplainable at every step.",
    data_foundation_eyebrow: "The Data Foundation",
    data_foundation_text: "Every Paradigm portfolio begins with data. Not analyst opinions. Not committee views. Market data — specifically the disclosed holdings of active investment strategies across the global equity universe. This data is public. What Paradigm does with it is not.",
    data_foundation_amd: "Paradigm's Active Market Data (AMD) covers more than 12,000 strategies across 45,000 securities in 75 global markets. It is the most comprehensive view of where active capital is positioned within any mandate at any given time. Updated continuously. Evaluated monthly for changes in regime leadership.",
    process_eyebrow: "The Process — Four Steps",
    process_intro: "The same four steps run for every mandate. Evaluated monthly. Signal-driven from start to finish.",
    step1_title: "Isolate the mandate universe.",
    step1_text: "Every portfolio begins with a defined mandate. Large Cap Value. International Developed. A custom thematic strategy. Whatever the mandate, Paradigm isolates the relevant dataset from AMD — the universe of strategies operating within that specific space.",
    step2_title: "Identify regime leadership.",
    step2_para1: "CIPE — Paradigm's Collective Intelligence Portfolio Engine — identifies which strategies within the mandate are in genuine market leadership right now. Not which strategies performed best over the last three years. Which are leading within the mandate today.",
    step2_para2: "The distinction matters. Most manager searches are backward-looking by design — they evaluate trailing performance and hire the sub-style that just led the cycle. CIPE reads current market positioning.",
    step3_title: "Generate the Portfolio Blueprint.",
    step3_text: "The strategies in regime leadership reveal a consensus view of the market — which sectors, factors, regions, and securities are concentrated in the leading positions. That consensus becomes the Portfolio Blueprint: a map of where the market's collective attention is focused within the mandate right now.",
    step3_text_2: "The Blueprint is not a replication of any single strategy. It is a new intelligence that emerges from the aggregate of many strategies each doing their job well within their own domain.",
    step4_title: "Build, optimize, and monitor.",
    step4_text: "Paradigm optimizes the portfolio toward the Blueprint — maximum return relative to risk within the mandate parameters. The model runs monthly from the beginning. A rebalance is triggered when the signal confirms a shift in regime leadership, not when a calendar date arrives.",
    step4_text_2: "Tax-loss harvesting runs on the active positions through the platform. The advisor or institution operates this capability. Paradigm enables it.",
    black_box_eyebrow: "Why No Black Box",
    black_box_1: "Systematic investment processes are often dismissed as black boxes — algorithms that produce outputs no one can explain or defend. Paradigm's process is the opposite.",
    black_box_2: "Every input to the Portfolio Blueprint is observable market data. Every output is a specific security position with a specific rationale: this position reflects where the collective market signal says leadership is forming within this mandate today. Every rebalance decision is traceable to a specific change in that signal. Every position can be explained to a client, a committee, or a regulator in plain language.",
    black_box_pullquote: "Transparent and explainable is not a feature. It is the architecture.",
    cta_intro: "The process is built to answer questions. If you have specific ones, a conversation is the right next step.",
    cta_advisor_eyebrow: "For Advisors",
    cta_advisor_text: "See what a portfolio built from collective intelligence looks like for your practice. Worth 20 minutes.",
    cta_advisor_button: "Book a 20-Minute Call",
    cta_institution_eyebrow: "For Institutions",
    cta_institution_text: "Paradigm is actively building strategic relationships with family offices, OCIOs, and institutional partners.",
    cta_institution_button: "Start a Conversation",
  },
  about: {
    hero_headline: "Built on a single conviction.\nRun for 35 years.\nNow accessible to the partners and platforms that need it most.",
    firm_eyebrow: "The Firm",
    firm_1: "Paradigm Asset Management was founded in 1990 on a specific conviction: that the collective intelligence embedded in active market data could be read, distilled, and expressed as portfolios that no individual strategy could construct on its own.",
    firm_2: "That conviction has not changed in 35 years. The data has grown. The process has been refined. The platform has been rebuilt for the scale and sophistication the market now requires. The conviction — that the collective signal of the market is more intelligent than any individual expression of it — is the same.",
    firm_3: "Paradigm is an SEC-registered investment adviser. One of the nation's oldest firms of its kind. Managing assets for institutional clients for 35 years before opening its platform to advisors and institutional partners.",
    james_title: "Founder & CEO",
    james_name: "James Francis",
    james_bio_1: "James Francis founded Paradigm in 1990 with a question that has driven the firm ever since: what does the market know collectively that no single strategy can know on its own?",
    james_bio_2: "The answer became CIPE — the Collective Intelligence Portfolio Engine, a process that reads active market data across thousands of strategies to identify where leadership is forming within each mandate. It has run continuously for 35 years through the full cycle of market regimes, serving institutional clients across pension funds, endowments, and government entities.",
    james_bio_3: "James is the author of Artificial Integrity: Leadership in an Age of Intelligent Systems.",
    james_image_url: "",
    james_image_alt: "James Francis",
    james_placeholder_initials: "JF",
    james_placeholder_text: "Photo Coming",
    team_eyebrow: "The Team",
    previous_prefix: "Previous:",
    team_1_name: "James Francis",
    team_1_title: "Founder & CEO",
    team_1_prev: "IBM, Shearson, Oppenheimer & Co.",
    team_1_bio: "Business development, portfolio management, and firm strategy. Founded Paradigm in 1990.",
    team_2_name: "Gregory Pai",
    team_2_title: "Investment Strategist",
    team_2_prev: "Price Waterhouse",
    team_2_bio: "Extensive portfolio management, data science, and computing experience.",
    team_3_name: "Chaoxie Liu",
    team_3_title: "Data Scientist",
    team_3_prev: "Australia and New Zealand Bank",
    team_3_bio: "Model and algorithm development, coding, and data infrastructure.",
    team_4_name: "Jeffrey Marcus",
    team_4_title: "Operations",
    team_4_prev: "Pension Investment Analyst, Warner Lambert",
    team_4_bio: "Portfolio construction, optimization, trading, and performance attribution and reporting.",
    team_5_name: "Odalisse Sosa",
    team_5_title: "Operations",
    team_6_name: "Jarius DeWalt",
    team_6_title: "Team Member",
    advisory_eyebrow: "Advisory Board",
    advisor_1_name: "Robert Capaldi",
    advisor_1_title: "Advisor",
    advisor_1_bio: "Former Senior Strategist to BlackRock's CEO.",
    advisor_2_name: "Natalie Turnow",
    advisor_2_title: "Advisor",
    advisor_2_bio: "Former CIO, Calvert Funds.",
  },
};

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window === 'undefined') return 'home';

    const hashPage = window.location.hash.replace('#', '');
    return PAGES.some(p => p.key === hashPage) ? hashPage : 'home';
  });
  const [content, setContent] = useState({});
  const [presentation, setPresentation] = useState(() => normalizePresentation('home'));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('');

  const page = PAGES.find(p => p.key === activePage);
  const fieldsByName = new Map(page?.fields.map(field => [field.name, field]) || []);
  const completedFields = page?.fields.filter(field => Boolean(content[field.name]?.trim?.() || content[field.name])).length || 0;
  const completionTotal = page?.fields.length || 0;

  const sectionList = activePage === 'home' ? HOME_SECTIONS : PAGE_SECTIONS[activePage];

  function getSectionId(prefix, title) {
    return `${prefix}-${title.toLowerCase().replaceAll(' ', '-')}`;
  }

  function scrollToSection(sectionId) {
    setActiveSectionId(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function selectPage(pageKey) {
    setActivePage(pageKey);
    setActiveSectionId('');
    window.history.replaceState(null, '', `${window.location.pathname}#${pageKey}`);
  }

  useEffect(() => {
    if (window.location.hash !== `#${activePage}`) {
      window.history.replaceState(null, '', `${window.location.pathname}#${activePage}`);
    }
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hashPage = window.location.hash.replace('#', '');
      if (PAGES.some(p => p.key === hashPage)) {
        setActivePage(hashPage);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(async () => {
      setLoading(true);
      setSaved(false);
      setSaveError('');
      const [contentResult, presentationResult] = await Promise.all([
        supabase
          .from('page_content')
          .select('content')
          .eq('page_key', activePage)
          .single(),
        ['home', 'site'].includes(activePage)
          ? supabase
              .from('page_presentation')
              .select('settings')
              .eq('page_key', activePage)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      if (!cancelled) {
        setContent({ ...(PAGE_DEFAULTS[activePage] || {}), ...(contentResult.data?.content || {}) });
        setPresentation(normalizePresentation(activePage, presentationResult.data?.settings));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activePage]);

  useEffect(() => {
    if (loading || !sectionList?.length) return undefined;

    const ids = sectionList.map(section => getSectionId(activePage, section.title));
    Promise.resolve().then(() => {
      setActiveSectionId(ids[0]);
    });

    const sections = ids
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.08, 0.18, 0.32, 0.5],
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [activePage, loading, sectionList]);

  function updateField(name, value) {
    setContent(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    setSaveError('');
  }

  function updatePresentationSetting(name, value) {
    setPresentation(prev => normalizePresentation(activePage, { ...prev, [name]: value }));
    setSaved(false);
    setSaveError('');
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    const operations = [
      supabase.rpc('save_page_content', {
        p_page_key: activePage,
        p_content: content,
      }),
    ];

    if (['home', 'site'].includes(activePage)) {
      operations.push(supabase.rpc('save_page_presentation', {
        p_page_key: activePage,
        p_settings: presentation,
      }));
    }

    const results = await Promise.all(operations);
    const error = results.find(result => result.error)?.error;

    if (!error) {
      publishContentUpdate(activePage, content);
      if (['home', 'site'].includes(activePage)) {
        publishPresentationUpdate(activePage, presentation);
      }
      setSaved(true);
    } else {
      setSaveError('Save failed. Your account may not have CMS publishing access.');
    }
    setSaving(false);
  }

  async function applyAgentProposal(proposal) {
    if (!proposal || proposal.pageKey !== activePage || (!proposal.content && !proposal.settings)) return false;

    setSaving(true);
    setSaveError('');
    const nextContent = proposal.content ? { ...proposal.content } : null;
    const nextPresentation = ['home', 'site'].includes(activePage) && proposal.settings
      ? normalizePresentation(activePage, proposal.settings)
      : null;
    const operations = [];

    if (nextContent) {
      operations.push(supabase.rpc('save_page_content', {
        p_page_key: activePage,
        p_content: nextContent,
      }));
    }

    if (nextPresentation) {
      operations.push(supabase.rpc('save_page_presentation', {
        p_page_key: activePage,
        p_settings: nextPresentation,
      }));
    }

    const results = await Promise.all(operations);
    const error = results.find(result => result.error)?.error;

    if (error) {
      setSaveError('Assistant change could not be published. Verify CMS publishing access.');
      setSaving(false);
      return false;
    }

    if (nextContent) {
      setContent(nextContent);
      publishContentUpdate(activePage, nextContent);
    }
    if (nextPresentation) {
      setPresentation(nextPresentation);
      publishPresentationUpdate(activePage, nextPresentation);
    }
    setSaved(true);
    setSaving(false);
    return true;
  }

  async function restoreAgentCheckpoint(checkpoint) {
    setSaving(true);
    setSaveError('');
    const restoredContent = checkpoint?.content ? { ...checkpoint.content } : null;
    const restoredPresentation = ['home', 'site'].includes(activePage) && checkpoint?.settings
      ? normalizePresentation(activePage, checkpoint.settings)
      : null;
    const operations = [];

    if (restoredContent) {
      operations.push(supabase.rpc('save_page_content', {
        p_page_key: activePage,
        p_content: restoredContent,
      }));
    }

    if (restoredPresentation) {
      operations.push(supabase.rpc('save_page_presentation', {
        p_page_key: activePage,
        p_settings: restoredPresentation,
      }));
    }

    if (!operations.length) {
      setSaveError('This saved request has no restorable checkpoint.');
      setSaving(false);
      return false;
    }

    const results = await Promise.all(operations);
    const error = results.find(result => result.error)?.error;

    if (error) {
      setSaveError('The previous content or appearance state could not be restored. Verify CMS publishing access.');
      setSaving(false);
      return false;
    }

    if (restoredContent) {
      setContent(restoredContent);
      publishContentUpdate(activePage, restoredContent);
    }
    if (restoredPresentation) {
      setPresentation(restoredPresentation);
      publishPresentationUpdate(activePage, restoredPresentation);
    }
    setSaved(true);
    setSaving(false);
    return true;
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
              <button
                key={section.title}
                type="button"
                onClick={() => scrollToSection(getSectionId('home', section.title))}
                style={{
                  ...styles.sectionNavLink,
                  ...(activeSectionId === getSectionId('home', section.title) ? styles.sectionNavLinkActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.sectionNavNumber,
                    ...(activeSectionId === getSectionId('home', section.title) ? styles.sectionNavNumberActive : {}),
                  }}
                >
                  {section.number}
                </span>
                <span>{section.title}</span>
              </button>
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

          <section style={styles.editorSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionNumber}>UI</span>
              <div style={styles.sectionHeaderCopy}>
                <p style={styles.sectionEyebrow}>Safe Appearance Controls</p>
                <h2 style={styles.sectionTitle}>Visual layout</h2>
                <p style={styles.sectionDescription}>
                  Approved spacing and typography settings that can later be operated by the AI assistant.
                </p>
              </div>
              <span style={styles.sectionCount}>{HOME_PRESENTATION_CONTROLS.length} controls</span>
            </div>
            <div style={styles.appearanceFields}>
              {HOME_PRESENTATION_CONTROLS.map(control => (
                <label key={control.name} style={styles.appearanceField}>
                  <span style={styles.label}>{control.label}</span>
                  <span style={styles.appearanceHelp}>{control.description}</span>
                  <select
                    value={presentation[control.name]}
                    onChange={event => updatePresentationSetting(control.name, event.target.value)}
                    style={styles.select}
                  >
                    {control.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

          {HOME_SECTIONS.map(section => (
            <section
              key={section.title}
              id={getSectionId('home', section.title)}
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
              <button
                key={section.title}
                type="button"
                onClick={() => scrollToSection(getSectionId(activePage, section.title))}
                style={{
                  ...styles.sectionNavLink,
                  ...(activeSectionId === getSectionId(activePage, section.title) ? styles.sectionNavLinkActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.sectionNavNumber,
                    ...(activeSectionId === getSectionId(activePage, section.title) ? styles.sectionNavNumberActive : {}),
                  }}
                >
                  {section.number}
                </span>
                <span>{section.title}</span>
              </button>
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

          {activePage === 'site' && (
            <section style={styles.editorSection}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionNumber}>UI</span>
                <div style={styles.sectionHeaderCopy}>
                  <p style={styles.sectionEyebrow}>Safe Theme Controls</p>
                  <h2 style={styles.sectionTitle}>Navigation and footer treatment</h2>
                  <p style={styles.sectionDescription}>Approved palette choices for shared public-site chrome.</p>
                </div>
                <span style={styles.sectionCount}>{SITE_PRESENTATION_CONTROLS.length} controls</span>
              </div>
              <div style={styles.appearanceFields}>
                {SITE_PRESENTATION_CONTROLS.map(control => (
                  <label key={control.name} style={styles.appearanceField}>
                    <span style={styles.label}>{control.label}</span>
                    <span style={styles.appearanceHelp}>{control.description}</span>
                    <select
                      value={presentation[control.name]}
                      onChange={event => updatePresentationSetting(control.name, event.target.value)}
                      style={styles.select}
                    >
                      {control.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>
          )}

          {sections.map(section => (
            <section
              key={section.title}
              id={getSectionId(activePage, section.title)}
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
              onClick={() => selectPage(p.key)}
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
            {saveError && (
              <span style={styles.errorBadge}>
                <AlertCircle size={14} />
                {saveError}
              </span>
            )}
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

      <AgentPanel
        key={activePage}
        activePage={activePage}
        content={content}
        fields={page?.fields || []}
        presentation={presentation}
        saving={saving}
        onApply={applyAgentProposal}
        onRestore={restoreAgentCheckpoint}
      />
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: '#F5F3EF',
  },
  sidebar: {
    width: 272,
    height: '100vh',
    background: '#1a2240',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 0',
    flexShrink: 0,
    overflowY: 'auto',
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
    padding: '0 clamp(1.25rem, 3vw, 3rem) 3rem',
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
    padding: '1.9rem 0 1rem',
    borderBottom: '1px solid rgba(52,65,109,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 5,
    background: '#F5F3EF',
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
  errorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    maxWidth: 300,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#9f3126',
    background: 'rgba(192,57,43,0.1)',
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
    width: '100%',
    padding: '0.55rem 0.5rem',
    borderRadius: 3,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#34416D',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease',
  },
  sectionNavLinkActive: {
    background: '#34416D',
    color: '#F5F3EF',
    boxShadow: 'inset 3px 0 0 #C4A25B, 0 8px 18px rgba(52,65,109,0.12)',
  },
  sectionNavNumber: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#C4A25B',
    minWidth: 24,
  },
  sectionNavNumberActive: {
    color: '#C4A25B',
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
  appearanceFields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '0.9rem',
    padding: '1.35rem',
  },
  appearanceField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.42rem',
    padding: '0.9rem',
    background: '#FBFAF7',
    border: '1px solid rgba(52,65,109,0.07)',
    borderRadius: 4,
  },
  appearanceHelp: {
    minHeight: 40,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.74rem',
    lineHeight: 1.45,
    color: '#637890',
  },
  select: {
    width: '100%',
    padding: '0.72rem 0.78rem',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.16)',
    borderRadius: 3,
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
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
