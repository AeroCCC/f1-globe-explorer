CREATE TABLE IF NOT EXISTS circuits (
  circuit_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  grand_prix_name TEXT NOT NULL,
  display_grand_prix_name TEXT NOT NULL,
  short_grand_prix_name TEXT NOT NULL,
  short_display_grand_prix_name TEXT NOT NULL,
  country TEXT NOT NULL,
  display_country TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  track_type TEXT NOT NULL,
  track_type_label TEXT NOT NULL,
  length_km NUMERIC(6, 3) NOT NULL,
  turns INTEGER NOT NULL,
  first_grand_prix INTEGER NOT NULL,
  is_current_season BOOLEAN NOT NULL DEFAULT TRUE,
  season_round INTEGER,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  overview TEXT NOT NULL,
  characteristics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS races (
  race_id BIGSERIAL PRIMARY KEY,
  circuit_id TEXT NOT NULL REFERENCES circuits(circuit_id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  round INTEGER,
  race_name TEXT NOT NULL,
  date_range TEXT,
  race_date DATE,
  location TEXT,
  race_status TEXT NOT NULL DEFAULT 'scheduled',
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (circuit_id, season)
);

CREATE TABLE IF NOT EXISTS race_results (
  result_id BIGSERIAL PRIMARY KEY,
  race_id BIGINT NOT NULL REFERENCES races(race_id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  driver_name TEXT NOT NULL,
  constructor_name TEXT NOT NULL,
  position INTEGER,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (race_id, driver_name, position)
);

CREATE TABLE IF NOT EXISTS ai_insights (
  insight_id BIGSERIAL PRIMARY KEY,
  circuit_id TEXT NOT NULL REFERENCES circuits(circuit_id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL DEFAULT 'track_engineering_v1',
  content JSONB NOT NULL,
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (circuit_id, insight_type)
);

CREATE INDEX IF NOT EXISTS idx_circuits_current_region
  ON circuits (is_current_season DESC, region, display_grand_prix_name);

CREATE INDEX IF NOT EXISTS idx_races_circuit_season
  ON races (circuit_id, season);

CREATE INDEX IF NOT EXISTS idx_race_results_race
  ON race_results (race_id);
