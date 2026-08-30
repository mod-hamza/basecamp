create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'default_user',
  chat_id text,
  type text not null check (type in ('expense', 'income')),
  amount numeric not null check (amount >= 0),
  category text,
  description text,
  created_at timestamptz not null default now()
);
create index if not exists idx_transactions_user_id on transactions(user_id);
alter table transactions disable row level security;
grant all on table transactions to anon, authenticated, service_role;

