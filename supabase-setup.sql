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
DROP POLICY IF EXISTS "Public can read content" ON page_content;
CREATE POLICY "Public can read content"
  ON page_content FOR SELECT
  USING (true);

-- 4. Restrict CMS mutations to explicit CMS administrators.
CREATE TABLE IF NOT EXISTS cms_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cms_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_cms_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM cms_admins
    WHERE user_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION is_cms_admin() FROM public;
GRANT EXECUTE ON FUNCTION is_cms_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS cms_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('content.save', 'presentation.save')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('page_content', 'page_presentation')),
  page_key TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cms_change_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CMS admins can read audit log" ON cms_change_log;
CREATE POLICY "CMS admins can read audit log"
  ON cms_change_log FOR SELECT
  TO authenticated
  USING ((SELECT is_cms_admin()));

DROP POLICY IF EXISTS "Admin can update content" ON page_content;
DROP POLICY IF EXISTS "Admin can insert content" ON page_content;
DROP POLICY IF EXISTS "CMS admins can update content" ON page_content;
DROP POLICY IF EXISTS "CMS admins can insert content" ON page_content;

CREATE POLICY "CMS admins can update content"
  ON page_content FOR UPDATE
  TO authenticated
  USING ((SELECT is_cms_admin()))
  WITH CHECK ((SELECT is_cms_admin()));

CREATE POLICY "CMS admins can insert content"
  ON page_content FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_cms_admin()));

CREATE OR REPLACE FUNCTION save_page_content(
  p_page_key TEXT,
  p_content JSONB
)
RETURNS page_content
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_before JSONB;
  v_saved page_content;
BEGIN
  IF NOT is_cms_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required'
      USING ERRCODE = '42501';
  END IF;

  SELECT content
    INTO v_before
    FROM page_content
    WHERE page_key = p_page_key;

  INSERT INTO page_content (page_key, content, updated_at)
    VALUES (p_page_key, p_content, now())
    ON CONFLICT (page_key) DO UPDATE
      SET content = excluded.content,
          updated_at = excluded.updated_at
    RETURNING * INTO v_saved;

  INSERT INTO cms_change_log (
    actor_user_id,
    action,
    resource_type,
    page_key,
    before_data,
    after_data
  ) VALUES (
    (SELECT auth.uid()),
    'content.save',
    'page_content',
    p_page_key,
    v_before,
    p_content
  );

  RETURN v_saved;
END;
$$;

REVOKE ALL ON FUNCTION save_page_content(TEXT, JSONB) FROM public;
GRANT EXECUTE ON FUNCTION save_page_content(TEXT, JSONB) TO authenticated;

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
}'::jsonb),

('site', '{
  "brand_name": "PARADIGM",
  "brand_descriptor": "Asset Management",
  "nav_institutions": "For Institutions",
  "nav_process": "Our Process",
  "nav_about": "About",
  "nav_contact": "Contact",
  "footer_strategies": "Strategies",
  "footer_process": "Process",
  "footer_team": "Team",
  "footer_legal": "Legal",
  "footer_contact": "Contact",
  "footer_copyright": "Copyright 2026 Paradigm Asset Management Co. LLC",
  "direct_email": "jef@paradigmasset.com",
  "direct_phone": "212.771.6100"
}'::jsonb)

ON CONFLICT (page_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS page_presentation (
  page_key TEXT PRIMARY KEY REFERENCES page_content(page_key) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_presentation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read presentation" ON page_presentation;
CREATE POLICY "Public can read presentation"
  ON page_presentation FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "CMS admins can update presentation" ON page_presentation;
CREATE POLICY "CMS admins can update presentation"
  ON page_presentation FOR UPDATE
  TO authenticated
  USING ((SELECT is_cms_admin()))
  WITH CHECK ((SELECT is_cms_admin()));

DROP POLICY IF EXISTS "CMS admins can insert presentation" ON page_presentation;
CREATE POLICY "CMS admins can insert presentation"
  ON page_presentation FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_cms_admin()));

CREATE OR REPLACE FUNCTION save_page_presentation(
  p_page_key TEXT,
  p_settings JSONB
)
RETURNS page_presentation
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_before JSONB;
  v_saved page_presentation;
BEGIN
  IF NOT is_cms_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required'
      USING ERRCODE = '42501';
  END IF;

  IF p_page_key = 'home' THEN
    IF p_settings IS NULL
      OR (p_settings - ARRAY[
        'hero_density',
        'hero_headline_width',
        'hero_headline_scale',
        'trust_band_density'
      ]) <> '{}'::JSONB
      OR coalesce(p_settings->>'hero_density', '') NOT IN ('compact', 'balanced', 'spacious')
      OR coalesce(p_settings->>'hero_headline_width', '') NOT IN ('tight', 'standard', 'wide')
      OR coalesce(p_settings->>'hero_headline_scale', '') NOT IN ('compact', 'standard', 'prominent')
      OR coalesce(p_settings->>'trust_band_density', '') NOT IN ('compact', 'balanced', 'spacious')
    THEN
      RAISE EXCEPTION 'Unsupported page presentation settings'
        USING ERRCODE = '22023';
    END IF;
  ELSIF p_page_key = 'site' THEN
    IF p_settings IS NULL
      OR (p_settings - ARRAY['shell_tone', 'shell_accent']) <> '{}'::JSONB
      OR coalesce(p_settings->>'shell_tone', '') NOT IN ('navy', 'charcoal', 'forest')
      OR coalesce(p_settings->>'shell_accent', '') NOT IN ('gold', 'copper', 'sage')
    THEN
      RAISE EXCEPTION 'Unsupported site shell settings'
        USING ERRCODE = '22023';
    END IF;
  ELSE
    RAISE EXCEPTION 'Unsupported page presentation target'
      USING ERRCODE = '22023';
  END IF;

  SELECT settings
    INTO v_before
    FROM page_presentation
    WHERE page_key = p_page_key;

  INSERT INTO page_presentation (page_key, settings, updated_at)
    VALUES (p_page_key, p_settings, now())
    ON CONFLICT (page_key) DO UPDATE
      SET settings = excluded.settings,
          updated_at = excluded.updated_at
    RETURNING * INTO v_saved;

  INSERT INTO cms_change_log (
    actor_user_id,
    action,
    resource_type,
    page_key,
    before_data,
    after_data
  ) VALUES (
    (SELECT auth.uid()),
    'presentation.save',
    'page_presentation',
    p_page_key,
    v_before,
    p_settings
  );

  RETURN v_saved;
END;
$$;

REVOKE ALL ON FUNCTION save_page_presentation(TEXT, JSONB) FROM public;
GRANT EXECUTE ON FUNCTION save_page_presentation(TEXT, JSONB) TO authenticated;

INSERT INTO page_presentation (page_key, settings) VALUES
('home', '{
  "hero_density": "balanced",
  "hero_headline_width": "standard",
  "hero_headline_scale": "standard",
  "trust_band_density": "balanced"
}'::jsonb),
('site', '{
  "shell_tone": "navy",
  "shell_accent": "gold"
}'::jsonb)
ON CONFLICT (page_key) DO NOTHING;

-- Bootstrap the current CMS account after it has been created in Authentication.
INSERT INTO cms_admins (user_id)
SELECT id
FROM auth.users
WHERE lower(email) = lower('admin@paradigmasset.com')
ON CONFLICT (user_id) DO NOTHING;

-- Persist assistant conversations and reversible prompt stages.
CREATE TABLE IF NOT EXISTS cms_agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_key TEXT NOT NULL DEFAULT 'home',
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_agent_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES cms_agent_sessions(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  prompt TEXT NOT NULL CHECK (char_length(prompt) BETWEEN 1 AND 4000),
  changes JSONB NOT NULL DEFAULT '[]'::JSONB,
  before_content JSONB,
  after_content JSONB,
  before_settings JSONB,
  after_settings JSONB,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reverted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reverted_at TIMESTAMPTZ,
  UNIQUE (session_id, sequence_number)
);

ALTER TABLE cms_agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_agent_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CMS admins can read own assistant sessions" ON cms_agent_sessions;
CREATE POLICY "CMS admins can read own assistant sessions"
  ON cms_agent_sessions FOR SELECT
  TO authenticated
  USING (owner_user_id = (SELECT auth.uid()) AND (SELECT is_cms_admin()));

DROP POLICY IF EXISTS "CMS admins can read own assistant stages" ON cms_agent_stages;
CREATE POLICY "CMS admins can read own assistant stages"
  ON cms_agent_stages FOR SELECT
  TO authenticated
  USING (
    (SELECT is_cms_admin())
    AND EXISTS (
      SELECT 1
      FROM cms_agent_sessions session
      WHERE session.id = session_id
        AND session.owner_user_id = (SELECT auth.uid())
    )
  );

GRANT SELECT ON cms_agent_sessions, cms_agent_stages TO authenticated;

CREATE OR REPLACE FUNCTION create_cms_agent_session(
  p_title TEXT,
  p_page_key TEXT DEFAULT 'home'
)
RETURNS cms_agent_sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session cms_agent_sessions;
BEGIN
  IF NOT is_cms_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required' USING ERRCODE = '42501';
  END IF;

  IF p_page_key NOT IN ('site', 'home', 'advisors', 'familyoffice', 'institutions', 'process', 'about')
    OR char_length(trim(p_title)) NOT BETWEEN 1 AND 120
  THEN
    RAISE EXCEPTION 'Invalid assistant session details' USING ERRCODE = '22023';
  END IF;

  INSERT INTO cms_agent_sessions (owner_user_id, page_key, title)
  VALUES ((SELECT auth.uid()), p_page_key, trim(p_title))
  RETURNING * INTO v_session;

  RETURN v_session;
END;
$$;

CREATE OR REPLACE FUNCTION append_cms_agent_stage(
  p_session_id UUID,
  p_prompt TEXT,
  p_changes JSONB,
  p_before_content JSONB,
  p_after_content JSONB,
  p_before_settings JSONB,
  p_after_settings JSONB
)
RETURNS cms_agent_stages
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_sequence INTEGER;
  v_stage cms_agent_stages;
BEGIN
  IF NOT is_cms_admin()
    OR NOT EXISTS (
      SELECT 1 FROM cms_agent_sessions
      WHERE id = p_session_id AND owner_user_id = (SELECT auth.uid())
    )
  THEN
    RAISE EXCEPTION 'Assistant session access required' USING ERRCODE = '42501';
  END IF;

  IF char_length(trim(p_prompt)) NOT BETWEEN 1 AND 4000
    OR (p_after_content IS NULL AND p_after_settings IS NULL)
  THEN
    RAISE EXCEPTION 'Invalid prompt stage' USING ERRCODE = '22023';
  END IF;

  SELECT coalesce(max(sequence_number), 0) + 1
    INTO v_next_sequence
    FROM cms_agent_stages
    WHERE session_id = p_session_id;

  INSERT INTO cms_agent_stages (
    session_id,
    sequence_number,
    prompt,
    changes,
    before_content,
    after_content,
    before_settings,
    after_settings
  ) VALUES (
    p_session_id,
    v_next_sequence,
    trim(p_prompt),
    coalesce(p_changes, '[]'::JSONB),
    p_before_content,
    p_after_content,
    p_before_settings,
    p_after_settings
  )
  RETURNING * INTO v_stage;

  UPDATE cms_agent_sessions
  SET updated_at = now()
  WHERE id = p_session_id;

  RETURN v_stage;
END;
$$;

CREATE OR REPLACE FUNCTION revert_cms_agent_stages(
  p_session_id UUID,
  p_from_sequence INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_cms_admin()
    OR NOT EXISTS (
      SELECT 1 FROM cms_agent_sessions
      WHERE id = p_session_id AND owner_user_id = (SELECT auth.uid())
    )
  THEN
    RAISE EXCEPTION 'Assistant session access required' USING ERRCODE = '42501';
  END IF;

  UPDATE cms_agent_stages
  SET status = 'reverted',
      reverted_at = now()
  WHERE session_id = p_session_id
    AND sequence_number >= p_from_sequence
    AND status = 'applied';

  UPDATE cms_agent_sessions
  SET updated_at = now()
  WHERE id = p_session_id;
END;
$$;

REVOKE ALL ON FUNCTION create_cms_agent_session(TEXT, TEXT) FROM public;
REVOKE ALL ON FUNCTION append_cms_agent_stage(UUID, TEXT, JSONB, JSONB, JSONB, JSONB, JSONB) FROM public;
REVOKE ALL ON FUNCTION revert_cms_agent_stages(UUID, INTEGER) FROM public;

GRANT EXECUTE ON FUNCTION create_cms_agent_session(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION append_cms_agent_stage(UUID, TEXT, JSONB, JSONB, JSONB, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION revert_cms_agent_stages(UUID, INTEGER) TO authenticated;
