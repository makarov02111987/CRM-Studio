CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  org TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  public_price TEXT NOT NULL DEFAULT 'от 10 000 ₽',
  internal_score INTEGER NOT NULL DEFAULT 0,
  internal_price INTEGER NOT NULL DEFAULT 10000,
  internal_level TEXT NOT NULL DEFAULT 'Старт',
  status TEXT NOT NULL DEFAULT 'Новая',
  prompt TEXT NOT NULL,
  form_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
