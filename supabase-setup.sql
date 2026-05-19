-- =============================================
-- PARADIGM CMS — Supabase Setup
-- Run this ONCE in the Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- =============================================

-- 1. Create the content table
CREATE TABLE IF NOT EXISTS page_content (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to READ content (public website needs this)
CREATE POLICY "Public can read content"
  ON page_content FOR SELECT
  USING (true);

-- 4. Only authenticated users can UPDATE/INSERT content
CREATE POLICY "Admin can update content"
  ON page_content FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert content"
  ON page_content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Seed initial content from current website copy
INSERT INTO page_content (page_key, content) VALUES

('home', '{
  "hero_eyebrow": "Institutional Portfolio Infrastructure for the Next Generation of Wealth Platforms",
  "hero_headline": "The collective intelligence of the market.\nBuilt into every portfolio.",
  "hero_sub": "Paradigm identifies where market leadership is forming — right now, within each mandate — and builds portfolios that reflect it. Portfolios that can move as leadership moves.",
  "trust_stat_1_value": "35 Years",
  "trust_stat_1_label": "Founded 1990",
  "trust_stat_2_value": "65 of the top 100",
  "trust_stat_2_label": "U.S. pension funds served",
  "trust_stat_3_value": "6",
  "trust_stat_3_label": "Equity strategies",
  "trust_stat_3_sub": "Funded — domestic, international, global",
  "trust_stat_4_value": "$7B+",
  "trust_stat_4_label": "Cumulative AUM",
  "trust_stat_5_value": "100%",
  "trust_stat_5_label": "Employee owned",
  "platform_text": "One platform. Three capabilities. Custom active strategies built to specification, SMA conversion of existing fund exposures into customizable tax-aware portfolios, and direct and custom indexing at scale. Customization, personalization, and tax-loss harvesting run across all three — at the individual client level. Built for advisors and institutions who want the full capability without splitting it across multiple vendors."
}'::jsonb),

('advisors', '{
  "hero_eyebrow": "For Advisors",
  "hero_headline": "The platform behind\nyour best portfolios.",
  "hero_sub": "Active management and direct indexing — built for advisors who want institutional investment intelligence and full client-level customization on a single platform.",
  "platform_headline": "One platform. Three capabilities.",
  "platform_para1": "Custom active strategies built to your specification, SMA conversion of existing fund exposures into customizable tax-aware portfolios, and direct and custom indexing at scale. Customization, personalization, and tax-loss harvesting run across all three — at the individual client level. You operate it. Paradigm enables it.",
  "platform_para2": "Most advisors manage these capabilities across multiple vendors, multiple processes, and multiple stories for clients. Paradigm consolidates them. One relationship. One interface. One coherent investment narrative for every client conversation."
}'::jsonb),

('familyoffice', '{
  "hero_eyebrow": "For Family Offices",
  "hero_headline": "Institutional infrastructure.\nFamily office control.",
  "hero_sub": "Multi-family offices and OCIOs get the investment intelligence, portfolio construction, and platform capability of a large institution — without building it themselves.",
  "platform_ops_title": "You operate it. Paradigm enables it.",
  "platform_ops_body": "Customization, personalization, and tax-loss harvesting run across custom active, SMA conversion, and direct indexing — at the individual client account level. Your investment team runs these tools. Paradigm provides the infrastructure and the investment intelligence."
}'::jsonb),

('institutions', '{
  "hero_eyebrow": "For Institutions",
  "hero_headline": "Collective intelligence.\nInstitutional scale.",
  "hero_sub": "For institutional allocators managing assets across multiple mandates and account types, Paradigm provides the investment intelligence and portfolio infrastructure on a single integrated platform.",
  "platform_para1": "One platform. Three capabilities. Custom active strategies, SMA conversion, and direct and custom indexing — fully integrated. Customization, personalization, and tax-loss harvesting run across all three — at the individual account level. Institutions operate the platform. Paradigm provides the investment intelligence and the infrastructure.",
  "platform_para2": "For institutions managing assets across multiple mandates and account types, the operational consequence is significant. One process. One relationship. One coherent investment narrative across every client, every committee, and every regulatory filing that asks how the portfolio is positioned and why."
}'::jsonb),

('process', '{
  "hero_eyebrow": "Our Process",
  "hero_headline": "Signal-driven.\nMandate-specific.\nEvaluated monthly.",
  "data_foundation_text": "Paradigm''s Active Market Data (AMD) covers more than 12,000 strategies across 45,000 securities in 75 global markets. It is the most comprehensive view of where active capital is positioned within any mandate at any given time. Updated continuously. Evaluated monthly for changes in regime leadership.",
  "step1_title": "Isolate the mandate universe.",
  "step1_text": "Every portfolio begins with a defined mandate. Large Cap Value. International Developed. A custom thematic strategy. Whatever the mandate, Paradigm isolates the relevant dataset from AMD — the universe of strategies operating within that specific space.",
  "step2_title": "Identify regime leadership.",
  "step2_para1": "CIPE — Paradigm''s Collective Intelligence Portfolio Engine — identifies which strategies within the mandate are in genuine market leadership right now. Not which strategies performed best over the last three years. Which are leading within the mandate today.",
  "step2_para2": "The distinction matters. Most manager searches are backward-looking by design — they evaluate trailing performance and hire the sub-style that just led the cycle. CIPE reads current market positioning.",
  "step3_title": "Generate the Portfolio Blueprint.",
  "step3_text": "The output is a Portfolio Blueprint — a rules-based construction that reflects where the mandate''s collective intelligence is pointing right now. Not a model portfolio. Not a static allocation. A living document that updates as leadership shifts.",
  "step4_title": "Implement and monitor.",
  "step4_text": "The portfolio is built to the Blueprint. Customization, personalization, and tax-loss harvesting are applied at the individual account level. Evaluated monthly. When leadership shifts, the Blueprint shifts. When the Blueprint shifts, the portfolio shifts."
}'::jsonb),

('about', '{
  "hero_eyebrow": "About",
  "hero_headline": "35 years of reading\nwhat the market knows.",
  "james_title": "Founder & CEO",
  "james_bio_1": "James Francis founded Paradigm in 1990 with a question that has driven the firm ever since: what does the market know collectively that no single strategy can know on its own?",
  "james_bio_2": "The answer became CIPE — the Collective Intelligence Portfolio Engine, a process that reads active market data across thousands of strategies to identify where leadership is forming within each mandate. It has run continuously for 35 years through the full cycle of market regimes, serving institutional clients across pension funds, endowments, and government entities.",
  "james_bio_3": "James is the author of Artificial Integrity: Leadership in an Age of Intelligent Systems."
}'::jsonb)

ON CONFLICT (page_key) DO NOTHING;
