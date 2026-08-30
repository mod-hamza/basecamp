# Student Partner Agent — Complete PRD
### All Things Agentic Hackathon | Google Cloud + Gemini | Deadline: Aug 31, 2026

---

## Table of Contents

1. [Project Overview & Pitch](#1-project-overview--pitch)
2. [Hackathon Requirements Mapping](#2-hackathon-requirements-mapping)
3. [Full Tech Stack & Rationale](#3-full-tech-stack--rationale)
4. [Supabase Schema (All Tables)](#4-supabase-schema-all-tables)
5. [Backend Architecture](#5-backend-architecture)
6. [Agent Architecture (All Agents, Full Prompts)](#6-agent-architecture-all-agents-full-prompts)
7. [Frontend — All Screens & Components](#7-frontend--all-screens--components)
8. [API Endpoints (Complete)](#8-api-endpoints-complete)
9. [Google Calendar Integration](#9-google-calendar-integration)
10. [Audio Pipeline (Study Agent)](#10-audio-pipeline-study-agent)
11. [Finance Agent Logic (All Features)](#11-finance-agent-logic-all-features)
12. [Environment Variables & Secrets](#12-environment-variables--secrets)
13. [Folder Structure](#13-folder-structure)
14. [Deployment (Cloud Run)](#14-deployment-cloud-run)
15. [Demo Script (Exact, 4 Minutes)](#15-demo-script-exact-4-minutes)
16. [Architecture Diagram Description](#16-architecture-diagram-description)
17. [Submission Checklist](#17-submission-checklist)
18. [10-Hour Build Timeline](#18-10-hour-build-timeline)
19. [Bonus Points Strategy](#19-bonus-points-strategy)

---

## 1. Project Overview & Pitch

### Problem Statement
University students manage four cognitively distinct domains every day:

- **Learning** — attending lectures, reviewing notes, studying for exams.
- **Finances** — tracking expenses, staying within budget, managing savings.
- **Time** — balancing classes, assignments, social events, deadlines.
- **Information** — answering ad-hoc questions, searching for things.

Today these are handled by four entirely separate tools (Notion, Splitwise/Excel, Google Calendar, ChatGPT) with zero coordination. The student is the only "integration layer" — which is exhausting and failure-prone.

### Solution
**Student Partner** is a single unified AI agent chat interface where one conversation handles all four domains. Under the hood, a Router Agent classifies intent and delegates to four specialized sub-agents (Study, Finance, Calendar, General) that share a persistent user profile and memory. The agent is *proactive* — it surfaces insights, asks clarifying questions, and takes action without being asked.

### One-liner for judges
> "An always-on student operating system: one chat, four specialized agents, zero tab-switching."

### Value Proposition
- **Study Agent**: Record → Transcribe → Structured Notes → Practice Questions → Q&A, all automated.
- **Finance Agent**: Track → Analyze → Predict → Alert, with natural language input.
- **Calendar Agent**: Read → Suggest → Book → Remind, proactively.
- **Router**: Routes intelligently, maintains a unified user profile across all agents.

---

## 2. Hackathon Requirements Mapping

### Mandatory Requirements

| Requirement | How We Meet It |
|---|---|
| Gemini 3.5 Flash or newer | All agents use `gemini-2.0-flash` via Gemini API |
| Google Agent Framework | Google ADK (Agent Development Kit) for router + sub-agent orchestration |
| Google Cloud Infrastructure | Cloud Run (backend), Cloud Run (frontend), Supabase on GCP (optional: Cloud SQL as alternative) |
| Agentic behavior (not just chat) | Multi-step autonomous pipelines: audio → transcribe → notes → quiz; spend monitoring → alert → calendar block |

### Track Fit

**Primary: Collaborative Partner** (judges this track for $20,000)
- Agent asks clarifying questions before routing (e.g., "Is that $80 in AED or USD?").
- Adapts profile over time (remembers courses, recurring expenses, study preferences).
- Captures feedback: "Was that quiz too hard?" → adjusts difficulty.
- Guides the user step-by-step for complex flows (e.g., setting up a savings goal).

**Secondary: Taskmaster**
- Automates entire multi-step workflows end-to-end:
  - Record audio → transcribe → generate notes → store → index for Q&A.
  - Monitor spend → detect overage → suggest cut → optionally create calendar reminder.
- No single step requires user intervention; the agent does the heavy lifting.

### Judging Criteria Alignment

| Criterion | Weight | Our Strategy |
|---|---|---|
| Innovation & Operational Utility | 40% | Solves real student friction. Proactive suggestions. Multi-domain unification. |
| Architectural Discipline & Tech Stack | 30% | Clean agent separation. ADK orchestration. Supabase for state. Error handling documented. |
| Demo & Production Readiness | 30% | Live Cloud Run URL. Unedited demo video. Clean README. Architecture diagram. |

---

## 3. Full Tech Stack & Rationale

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand (lightweight, no Redux overhead)
- **Audio**: Web Audio API + MediaRecorder API (browser-native, no library needed)
- **Charts**: Recharts (for Finance tab spending charts)
- **Deployment**: Cloud Run (containerized with Docker)

Why Next.js: SSR for fast initial load, API routes for BFF pattern if needed, file-based routing for tabs.

### Backend
- **Runtime**: Node.js 20 (TypeScript)
- **Framework**: Fastify (faster than Express, built-in schema validation)
- **Agent Orchestration**: Google ADK (`@google/adk`)
- **LLM**: Gemini 2.0 Flash via `@google/generative-ai` SDK
- **Transcription**: Gemini 2.0 Flash multimodal (audio input) — no separate Whisper needed
- **Deployment**: Cloud Run (containerized)

### Database
- **Supabase** (PostgreSQL under the hood):
  - Auth (user sessions)
  - All app data (transcripts, notes, finance, chat history, profile)
  - Row-Level Security (RLS) policies for user data isolation
  - Realtime subscriptions (optional: for live transcript streaming to frontend)

### Google Services
- **Gemini API**: All LLM inference (router, study, finance, calendar, general agents)
- **Google ADK**: Agent orchestration, tool registration, memory
- **Google Calendar API**: Read events, create events, set reminders
- **Cloud Run**: Hosting for both frontend and backend containers

### Why These Choices
- **ADK over LangChain**: Native Google integration, required by hackathon, simpler tool registration.
- **Supabase over Firestore**: SQL queries for finance analytics; better for structured data.
- **Gemini Flash over Pro**: Faster, cheaper, still capable — important for 10-hour build budget.
- **Fastify over Express**: Schema validation catches bugs fast; marginally faster.

---

## 4. Supabase Schema (All Tables)

Run all of these in the Supabase SQL editor under **Database → SQL Editor**.

### 4.1 users (extends Supabase auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  currency TEXT DEFAULT 'AED',        -- user's preferred currency
  timezone TEXT DEFAULT 'Asia/Dubai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 4.2 agent_profile (persistent memory across sessions)
```sql
CREATE TABLE public.agent_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  courses JSONB DEFAULT '[]',          -- [{ name, code, exam_date, typical_times }]
  monthly_budget NUMERIC DEFAULT 0,
  savings_goal_target NUMERIC DEFAULT 0,
  savings_goal_deadline DATE,
  known_recurring_expenses JSONB DEFAULT '[]', -- [{ name, amount, category, day_of_month }]
  study_preferences JSONB DEFAULT '{}',        -- { preferred_note_style, quiz_difficulty }
  calendar_connected BOOLEAN DEFAULT FALSE,
  gcal_refresh_token TEXT,             -- encrypted in production
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.agent_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their profile" ON public.agent_profile
  FOR ALL USING (auth.uid() = user_id);
```

### 4.3 chats
```sql
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',       -- auto-generated from first message
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their chats" ON public.chats
  FOR ALL USING (auth.uid() = user_id);
```

### 4.4 messages
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_tag TEXT CHECK (agent_tag IN ('router', 'study', 'finance', 'calendar', 'general')),
  metadata JSONB DEFAULT '{}',         -- { routing_note, sources, etc. }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
```

### 4.5 courses
```sql
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- e.g. "Advanced Mathematics"
  code TEXT,                           -- e.g. "MATH301"
  exam_date DATE,
  typical_class_times JSONB DEFAULT '[]', -- [{ day: "Monday", time: "09:00" }]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their courses" ON public.courses
  FOR ALL USING (auth.uid() = user_id);
```

### 4.6 lectures
```sql
CREATE TABLE public.lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number INTEGER,
  chapter TEXT,
  lecture_number INTEGER,
  title TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  audio_url TEXT,                      -- Cloud Storage or Supabase Storage URL
  duration_seconds INTEGER,
  processing_status TEXT DEFAULT 'pending' CHECK (
    processing_status IN ('pending', 'transcribing', 'generating_notes', 'complete', 'error')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their lectures" ON public.lectures
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_lectures_course_id ON public.lectures(course_id);
```

### 4.7 transcripts
```sql
CREATE TABLE public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,              -- full verbatim transcript
  word_count INTEGER,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their transcripts" ON public.transcripts
  FOR ALL USING (auth.uid() = user_id);
```

### 4.8 notes
```sql
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  structured_notes TEXT NOT NULL,      -- markdown-formatted notes
  summary TEXT NOT NULL,               -- short 3–5 sentence summary
  key_concepts JSONB DEFAULT '[]',     -- ["concept1", "concept2"]
  formulas JSONB DEFAULT '[]',         -- [{ name, formula, explanation }]
  definitions JSONB DEFAULT '[]',      -- [{ term, definition }]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);
```

### 4.9 practice_questions
```sql
CREATE TABLE public.practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_type TEXT CHECK (question_type IN ('mcq', 'short_answer', 'true_false')),
  question TEXT NOT NULL,
  options JSONB,                       -- for MCQ: ["A", "B", "C", "D"]
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their questions" ON public.practice_questions
  FOR ALL USING (auth.uid() = user_id);
```

### 4.10 transactions
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,              -- 'food', 'transport', 'rent', 'entertainment', 'education', 'other'
  subcategory TEXT,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_id UUID,                   -- FK to recurring_expenses if auto-logged
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(user_id, category);
```

### 4.11 budgets
```sql
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  monthly_limit NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  start_date DATE NOT NULL,            -- e.g. 2026-08-01
  end_date DATE NOT NULL,              -- e.g. 2026-08-31
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, start_date)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);
```

### 4.12 savings_goals
```sql
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- e.g. "New Laptop", "Holiday Trip"
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'AED',
  deadline DATE,
  daily_target NUMERIC,               -- computed: (target - current) / days_remaining
  weekly_target NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their goals" ON public.savings_goals
  FOR ALL USING (auth.uid() = user_id);
```

### 4.13 recurring_expenses
```sql
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- e.g. "Netflix", "Gym Membership"
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  category TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  day_of_month INTEGER,                -- for monthly: day the charge hits
  next_due DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their recurring expenses" ON public.recurring_expenses
  FOR ALL USING (auth.uid() = user_id);
```

### 4.14 calendar_events (local cache)
```sql
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  gcal_event_id TEXT,                  -- Google Calendar event ID
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_exam BOOLEAN DEFAULT FALSE,
  is_class BOOLEAN DEFAULT FALSE,
  agent_suggested BOOLEAN DEFAULT FALSE, -- true if agent created this
  reminder_set BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their calendar events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id);
```

---

## 5. Backend Architecture

### Overview
```
Frontend (Next.js) ──POST /chat──> Backend (Fastify + ADK)
                                        │
                              Router Agent (ADK)
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
              Study Agent         Finance Agent      Calendar Agent
                    │                   │                   │
                Supabase           Supabase           Google Calendar API
              (transcripts,      (transactions,       (events, reminders)
               notes, Q&A)        budgets, goals)
```

### Request Lifecycle
1. User sends message → `POST /api/chat`
2. Backend reads full conversation history from Supabase (last 20 messages of this chat)
3. Backend reads user `agent_profile` (courses, budget, prefs)
4. **Router Agent** receives: message + history + profile → classifies intent → returns `{ agent: 'study'|'finance'|'calendar'|'general', routing_note: string, confidence: number }`
5. Router note is streamed to frontend as a system message: `"Routing to Study Agent..."`
6. Sub-agent is called with: original message + relevant context (filtered from profile) + conversation history
7. Sub-agent may call tools (Supabase read/write, Google Calendar API, Gemini transcription)
8. Sub-agent response is streamed back to frontend
9. Full exchange is saved to `messages` table with `agent_tag`

### Streaming
- Use Server-Sent Events (SSE) for streaming agent responses to frontend.
- Endpoint: `GET /api/chat/:chatId/stream` with `?message=...`
- Alternatively: `POST /api/chat` returns a streaming response with `Content-Type: text/event-stream`

### Error Handling
- Every agent call wrapped in try/catch.
- On Gemini API failure: return fallback message + log error to Cloud Run logs.
- On Supabase failure: return error to user, do not crash.
- On audio transcription failure: return partial transcript if available, else error.
- Retry logic: 3 retries with exponential backoff for Gemini API calls.

---

## 6. Agent Architecture (All Agents, Full Prompts)

### 6.1 Router Agent

**Purpose**: Classify every user message and route to the correct sub-agent.

**ADK Tool Registration**:
```typescript
import { Agent, Tool } from '@google/adk';

const routerAgent = new Agent({
  name: 'router',
  model: 'gemini-2.0-flash',
  systemInstruction: ROUTER_SYSTEM_PROMPT,
  tools: [] // Router does not call external tools; it only classifies
});
```

**System Prompt (ROUTER_SYSTEM_PROMPT)**:
```
You are the Router Agent for a Student Partner assistant.

Your ONLY job is to classify the user's message into one of four categories and return a JSON object.

Categories:
- "study": Anything about lectures, notes, transcripts, studying, quizzes, practice questions, recording, uploading audio/video, academic content.
- "finance": Anything about money, expenses, income, budget, savings, affordability, transactions, spending.
- "calendar": Anything about scheduling, events, deadlines, reminders, alarms, free time, class times.
- "general": Everything else — general questions, explanations, web search, small talk.

User Profile (use this to improve classification):
{{PROFILE_JSON}}

Conversation history (last 5 messages):
{{HISTORY}}

Rules:
1. If the message is ambiguous between two categories, pick the most likely one but flag it.
2. If critical information is missing (e.g., "Can I afford this?" with no amount), set needs_clarification: true and provide a clarification_question.
3. Never route to "general" if the message could plausibly be study/finance/calendar.
4. Always respond with valid JSON only. No preamble, no explanation outside the JSON.

Response format:
{
  "agent": "study" | "finance" | "calendar" | "general",
  "routing_note": "Short human-readable note shown in chat, e.g. 'Routing to Finance Agent'",
  "confidence": 0.0–1.0,
  "needs_clarification": true | false,
  "clarification_question": "Question to ask user if needs_clarification is true, else null"
}
```

**Router Logic in Code**:
```typescript
async function route(message: string, profile: AgentProfile, history: Message[]) {
  const prompt = ROUTER_SYSTEM_PROMPT
    .replace('{{PROFILE_JSON}}', JSON.stringify(profile))
    .replace('{{HISTORY}}', history.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n'));

  const result = await gemini.generateContent(prompt + '\n\nUser message: ' + message);
  const json = JSON.parse(result.response.text());

  if (json.needs_clarification) {
    return { type: 'clarification', question: json.clarification_question };
  }
  return { type: 'route', agent: json.agent, note: json.routing_note };
}
```

---

### 6.2 Study Agent

**Purpose**: Handle everything related to lectures, transcription, notes, and Q&A.

**System Prompt (STUDY_AGENT_SYSTEM_PROMPT)**:
```
You are the Study Agent — an expert academic assistant embedded in a student's learning workflow.

You have access to the following tools:
- get_lecture_transcript(lecture_id): Returns the full transcript of a lecture.
- get_notes(lecture_id): Returns structured notes for a lecture.
- get_practice_questions(lecture_id, difficulty): Returns practice questions.
- search_transcripts(query, course_id?): Semantic search across all transcripts.
- list_lectures(course_id?): Lists all lectures for a course.
- save_notes(lecture_id, notes): Saves generated notes to the database.
- save_practice_questions(lecture_id, questions): Saves questions to the database.

User Profile:
{{PROFILE_JSON}}

Current conversation context:
{{HISTORY}}

Rules:
1. When asked to generate notes, ALWAYS use this exact structure:
   ## [Lecture Title]
   ### Summary
   [3–5 sentence summary]
   ### Key Concepts
   - [Concept]: [1-sentence explanation]
   ### Definitions
   - **[Term]**: [Definition]
   ### Formulas / Frameworks
   - [Name]: [Formula or framework], where [variable explanations]
   ### Practice Questions
   [Include 3 MCQs and 2 short-answer questions]

2. When quizzing the user:
   - Present ONE question at a time.
   - Wait for their answer before revealing the correct one.
   - Give encouraging, specific feedback.
   - Track score in the conversation.

3. When explaining a concept:
   - Use simple language first, then build complexity.
   - Give a real-world example if possible.
   - Ask "Does that make sense?" before moving on.

4. If no lecture context is specified, ask which course/lecture they mean.

5. Adapt difficulty based on user feedback. If they say "too easy", increase. If "too hard", simplify.
```

**Tools (ADK Tool Definitions)**:
```typescript
const studyTools = [
  {
    name: 'get_lecture_transcript',
    description: 'Retrieve the full transcript of a specific lecture',
    parameters: { lecture_id: { type: 'string', required: true } },
    handler: async ({ lecture_id }) => {
      const { data } = await supabase
        .from('transcripts')
        .select('raw_text')
        .eq('lecture_id', lecture_id)
        .single();
      return data?.raw_text || 'Transcript not found';
    }
  },
  {
    name: 'get_notes',
    description: 'Get the structured notes for a lecture',
    parameters: { lecture_id: { type: 'string', required: true } },
    handler: async ({ lecture_id }) => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('lecture_id', lecture_id)
        .single();
      return data || 'Notes not yet generated for this lecture';
    }
  },
  {
    name: 'get_practice_questions',
    description: 'Get practice questions for a lecture',
    parameters: {
      lecture_id: { type: 'string', required: true },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], required: false }
    },
    handler: async ({ lecture_id, difficulty = 'medium' }) => {
      const query = supabase
        .from('practice_questions')
        .select('*')
        .eq('lecture_id', lecture_id);
      if (difficulty) query.eq('difficulty', difficulty);
      const { data } = await query;
      return data || [];
    }
  },
  {
    name: 'search_transcripts',
    description: 'Search across all transcripts for a concept or keyword',
    parameters: {
      query: { type: 'string', required: true },
      course_id: { type: 'string', required: false }
    },
    handler: async ({ query, course_id }) => {
      // Full-text search using Supabase's built-in FTS
      let q = supabase
        .from('transcripts')
        .select('raw_text, lecture_id, lectures(title, course_id)')
        .textSearch('raw_text', query);
      if (course_id) q = q.eq('lectures.course_id', course_id);
      const { data } = await q.limit(5);
      return data || [];
    }
  }
];
```

**Audio Pipeline** (see Section 10 for full detail):
```
Browser MediaRecorder → POST /api/study/audio (multipart) → 
Gemini Flash (audio input) → raw transcript → 
Gemini Flash (text input) → structured notes + questions → 
Supabase storage
```

---

### 6.3 Finance Agent

**Purpose**: Track money, analyze spending, answer finance questions, run simulations.

**System Prompt (FINANCE_AGENT_SYSTEM_PROMPT)**:
```
You are the Finance Agent — a sharp, practical money manager for a university student.

You have access to these tools:
- log_transaction(amount, currency, type, category, description, date): Log income or expense.
- get_balance(): Returns current balance (total income - total expenses this month).
- get_spending_by_category(period): Returns spending breakdown. Period: 'week'|'month'|'all'.
- get_upcoming_expenses(): Returns all recurring expenses due in the next 30 days.
- can_afford(amount, currency?): Checks if user can afford an amount given balance and upcoming expenses.
- get_savings_goal(): Returns savings goal progress.
- update_savings_goal(name, target, deadline): Create or update savings goal.
- run_whatif(hypothetical_spend): Projects balance over next 30 days with the hypothetical spend included.
- get_spending_insights(): Analyze spending patterns and return insights.
- get_sos_budget(amount_left, days_remaining): Generate a survival budget.

User Profile (currency preference, monthly budget):
{{PROFILE_JSON}}

Conversation history:
{{HISTORY}}

Rules:
1. ALWAYS confirm the currency before logging. If user says "$80" and their currency is AED, ask: "Is that $80 USD or AED 80?"
2. When logging a transaction, confirm back: "Got it — I've logged AED 120 for food on Aug 30."
3. For "can I afford X":
   - Calculate: current_balance - upcoming_expenses_this_week - X
   - If result > 0: "Yes, you can afford it. You'd have [amount] left after."
   - If result < 0: "That would put you [amount] short. Here's what you could adjust: ..."
4. For SOS Mode:
   - Compute daily cap: amount_left / days_remaining
   - Suggest must-cut categories based on their spending history
   - Be direct and practical, not judgmental
5. Spending Detective: compare this week vs last week by category. Flag anomalies > 20% increase.
6. Never moralize about spending choices. Be practical and data-driven.
7. Always show numbers, not vague advice.

Categories to use: food, transport, rent, entertainment, education, health, subscriptions, other
```

**Tools**:
```typescript
const financeTools = [
  {
    name: 'log_transaction',
    description: 'Log an income or expense transaction',
    parameters: {
      amount: { type: 'number', required: true },
      currency: { type: 'string', required: true },
      type: { type: 'string', enum: ['income', 'expense'], required: true },
      category: { type: 'string', required: true },
      description: { type: 'string', required: false },
      date: { type: 'string', required: false } // ISO date, defaults to today
    },
    handler: async (params) => {
      const { data, error } = await supabase.from('transactions').insert({
        ...params,
        user_id: userId,
        transaction_date: params.date || new Date().toISOString().split('T')[0]
      });
      return error ? { success: false, error } : { success: true, transaction: data };
    }
  },
  {
    name: 'get_balance',
    description: 'Get current month income minus expenses',
    handler: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const { data } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', userId)
        .gte('transaction_date', startOfMonth.toISOString().split('T')[0]);
      
      const income = data?.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 0;
      const expenses = data?.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) || 0;
      return { balance: income - expenses, income, expenses };
    }
  },
  {
    name: 'can_afford',
    description: 'Check if the user can afford a purchase given current balance and upcoming expenses',
    parameters: {
      amount: { type: 'number', required: true },
      currency: { type: 'string', required: false }
    },
    handler: async ({ amount }) => {
      const { balance } = await getBalance();
      const { upcomingTotal } = await getUpcomingExpenses(7); // next 7 days
      const available = balance - upcomingTotal;
      return {
        can_afford: available - amount > 0,
        available_after: available - amount,
        current_balance: balance,
        upcoming_7_days: upcomingTotal
      };
    }
  },
  {
    name: 'get_sos_budget',
    description: 'Generate survival budget given amount left and days remaining',
    parameters: {
      amount_left: { type: 'number', required: true },
      days_remaining: { type: 'integer', required: true }
    },
    handler: async ({ amount_left, days_remaining }) => {
      const daily_cap = amount_left / days_remaining;
      const { data: recentSpending } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', userId)
        .eq('type', 'expense')
        .gte('transaction_date', new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]);
      
      return { daily_cap, recent_spending_by_category: recentSpending };
      // Agent then uses this data to reason about what to cut
    }
  }
];
```

---

### 6.4 Calendar Agent

**Purpose**: Read/write Google Calendar, make proactive scheduling suggestions.

**System Prompt (CALENDAR_AGENT_SYSTEM_PROMPT)**:
```
You are the Calendar Agent — a proactive scheduling assistant for a student.

You have access to these tools:
- get_upcoming_events(days): Get Google Calendar events for the next N days.
- create_event(title, start_time, end_time, description?): Create a new calendar event.
- set_reminder(event_id, minutes_before): Set a reminder for an existing event.
- suggest_study_blocks(exam_date, course_name): Suggest study time blocks given an exam date.

User Profile:
{{PROFILE_JSON}}

Rules:
1. When reading events, look for: exams, quizzes, assignment deadlines, lectures.
2. ALWAYS ask before creating or modifying events: "Shall I add this to your calendar?"
3. When user has a quiz/exam coming up, proactively ask: "Want an alarm the night before?"
4. When the user has many back-to-back classes, suggest: "You have 4 classes tomorrow. Want me to block 2h for review afterward?"
5. Be concise in suggestions. One suggestion per message.
6. Format times clearly: "Monday 14 Sep at 3:00 PM" not "2026-09-14T15:00:00".
```

---

### 6.5 General Agent

**Purpose**: Handle everything that doesn't fit study/finance/calendar.

**System Prompt (GENERAL_AGENT_SYSTEM_PROMPT)**:
```
You are a helpful, concise general assistant. The user is a university student.
Answer their questions directly. If they ask something that seems like it should be
routed to study, finance, or calendar, gently note that they can ask about those topics
and you'll connect them to the right agent.

Keep responses under 200 words unless the question requires more detail.
Be friendly, direct, and practical.
```

---

## 7. Frontend — All Screens & Components

### 7.1 Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + "Student Partner" + User avatar          │
├──────────┬──────────────────────────────────────────────┤
│ Sidebar  │ Main Content Area                            │
│          │                                              │
│ [Agent]  │  (changes based on active tab)              │
│ [Finance]│                                              │
│ [Study]  │                                              │
│ [Calendar│                                              │
│          │                                              │
│ ────────  │                                              │
│ Chat list │                                              │
│ (when in │                                              │
│ Agent tab)│                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 7.2 Agent Tab (Main Chat)

**Left Sidebar** (always visible when on Agent tab):
- `[+ New Chat]` button at top → creates new chat, focuses input
- Scrollable list of past chats (title + relative timestamp)
- Clicking a chat loads that chat's history
- Chat title auto-generated from first user message (first 40 chars)

**Main Chat Area**:
- Chat history scrolls from top to bottom (newest at bottom)
- Message types:
  - **User message**: Right-aligned, blue bubble
  - **Assistant message**: Left-aligned, white bubble with agent avatar
  - **System routing note**: Centered, small, gray italic text: `"↳ Study Agent"` or `"↳ Finance Agent"`
  - **Clarification prompt**: Left-aligned with a slightly different background, ends with `?`
- **Input bar** at bottom:
  - Text input (multiline, Shift+Enter for newline, Enter to send)
  - Mic button (press-and-hold to record directly in chat → triggers Study Agent with audio)
  - Send button

**Loading state**: Animated dots `...` while agent is thinking. For long operations (transcription), show `"Transcribing audio..."` progress note.

### 7.3 Finance Tab

**Top section — Overview cards** (horizontal row):
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Current Balance  │  │ Monthly Spent    │  │ Savings Goal    │
│ AED 1,240        │  │ AED 860 / 2,000  │  │ AED 400 / 1,000 │
│ ↑ AED 300 income │  │ 43% of budget    │  │ 40% — 45 days   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Add Transaction** section:
- Tab toggle: `[Chat]` | `[Form]`
- **Chat mode**: Input field with placeholder "I spent AED 35 on lunch today" → sends to Finance Agent
- **Form mode**:
  - Amount (number input) + Currency dropdown (AED/USD/EUR)
  - Type: Income / Expense (toggle)
  - Category dropdown: Food / Transport / Rent / Entertainment / Education / Health / Subscriptions / Other
  - Date picker (defaults to today)
  - Description (optional text input)
  - `[Add Transaction]` button → POST to `/api/finance/transaction`

**Upcoming Expenses** section:
- List of recurring expenses due in next 30 days
- Each row: Name | Amount | Due Date | Category
- `[+ Add Recurring]` button → opens modal

**Spending Charts** section (Recharts):
- Bar chart: Spending by category this month
- Line chart: Daily spending over last 30 days
- Toggle: Week / Month / All time

**Transactions History** section:
- Table: Date | Description | Category | Amount | Type
- Sortable by date, amount
- Search/filter by category

### 7.4 Study Tab

**Left panel — Course Tree** (file-system style):
```
📚 My Courses
  └── Advanced Mathematics (MATH301)
        └── Week 1
              └── Chapter 1 — Introduction
                    ├── 🎙️ Lecture 1 [Complete]
                    ├── 🎙️ Lecture 2 [Processing...]
                    └── 🎙️ Lecture 3 [Not recorded]
        └── Week 2
              └── ...
  └── Computer Science (CS401)
        └── ...
```
- Click a lecture node → opens right panel with that lecture's content
- Status indicators: Complete (green dot), Processing (spinner), Not recorded (gray)
- `[+ Add Course]` button at top

**Right panel — Lecture Viewer**:
- **Tabs**: Transcript | Notes | Practice Questions
- **Action buttons** at top:
  - `[🎙️ Record New]` → starts recording (shows waveform)
  - `[📤 Upload Audio/Video]` → file picker (accepts .mp3, .mp4, .m4a, .wav, .webm)
  - `[📝 Open Notes]` → scrolls to Notes tab
  - `[🧪 Quiz Me]` → sends "Quiz me on this lecture" to Agent chat

**Transcript tab**:
- Full scrollable transcript text
- Copy button (copies all)

**Notes tab**:
- Rendered markdown notes (react-markdown)
- Export button → downloads as .md file
- Key concepts listed as pills/tags

**Practice Questions tab**:
- Question cards with:
  - Question text
  - For MCQ: radio buttons for A/B/C/D
  - `[Check Answer]` button → reveals correct answer + explanation
  - Difficulty badge
- `[Generate More Questions]` button → calls Study Agent

**Recording UI** (appears as overlay when recording):
```
┌─────────────────────────────────────┐
│  🔴 Recording — 00:02:34            │
│  ∿∿∿∿∿∿∿∿∿ (audio waveform)        │
│                                     │
│  [⏸ Pause]  [⏹ Stop & Process]     │
└─────────────────────────────────────┘
```
- On `Stop & Process`: audio blob → POST `/api/study/transcribe` → progress states shown: Uploading → Transcribing → Generating Notes → Done

### 7.5 Calendar Tab

**Header**:
- Toggle: `[Proactive Suggestions ON/OFF]`
- `[Sync with Google Calendar]` button (OAuth flow)
- `[+ Add Event]` button → quick form

**Upcoming Events list**:
- Cards sorted by date/time
- Each card: Event title | Date & time | Duration | Type badge (Exam/Class/Personal)
- Exam/Quiz events highlighted in orange
- Agent-created events marked with a small robot icon 🤖

**Proactive Suggestion banner** (appears above events when suggestions are available):
```
┌──────────────────────────────────────────────────────────────────┐
│ 💡 You have a quiz on Friday (Sep 5). Want me to set an alarm   │
│    for Thursday night?                 [Yes, set alarm] [Dismiss] │
└──────────────────────────────────────────────────────────────────┘
```

**Quick Add Event form**:
- Title, Date, Start Time, End Time, Description
- `[Add to Google Calendar]` button

---

## 8. API Endpoints (Complete)

All endpoints require `Authorization: Bearer <supabase_jwt>` header.

### Chat Endpoints

```
POST   /api/chat
       Body: { chatId?: string, message: string }
       → Creates chat if chatId missing. Routes message. Returns streamed response.
       Response: SSE stream of { type: 'routing_note'|'chunk'|'done', content: string }

GET    /api/chats
       → List all chats for user
       Response: [{ id, title, updated_at, last_message }]

GET    /api/chats/:chatId/messages
       Query: ?limit=50&before=<message_id>
       → Paginated message history
       Response: [{ id, role, content, agent_tag, created_at }]

DELETE /api/chats/:chatId
       → Delete a chat and all its messages
```

### Study Endpoints

```
GET    /api/study/courses
       → List all courses
       Response: [{ id, name, code, exam_date, lecture_count }]

POST   /api/study/courses
       Body: { name, code, exam_date, typical_class_times }
       → Create a new course

GET    /api/study/courses/:courseId/lectures
       → List lectures for a course (with status)
       Response: [{ id, week_number, chapter, lecture_number, title, processing_status }]

POST   /api/study/transcribe
       Content-Type: multipart/form-data
       Body: { audio: File, course_id: string, week_number?: int, chapter?: string, lecture_number?: int }
       → Upload audio → trigger transcription pipeline
       Response: { lecture_id, status: 'processing' }
       (Frontend polls GET /api/study/lectures/:id/status)

GET    /api/study/lectures/:lectureId/status
       → Check processing status
       Response: { status: 'pending'|'transcribing'|'generating_notes'|'complete'|'error' }

GET    /api/study/lectures/:lectureId
       → Full lecture data (transcript + notes + questions)
       Response: { lecture, transcript, notes, questions }

POST   /api/study/lectures/:lectureId/questions/generate
       Body: { difficulty?: 'easy'|'medium'|'hard', count?: number }
       → Generate more practice questions for a lecture
```

### Finance Endpoints

```
GET    /api/finance/summary
       → Current balance, monthly budget, spent, upcoming expenses
       Response: { balance, monthly_limit, spent, remaining, upcoming_7_days }

POST   /api/finance/transactions
       Body: { amount, currency, type, category, description?, date? }
       → Log a transaction
       Response: { transaction }

GET    /api/finance/transactions
       Query: ?from=YYYY-MM-DD&to=YYYY-MM-DD&category=food&type=expense
       → Filtered transaction list

GET    /api/finance/spending-by-category
       Query: ?period=week|month|all
       → Spending totals grouped by category

GET    /api/finance/upcoming-expenses
       → List recurring expenses due in next 30 days

POST   /api/finance/savings-goals
       Body: { name, target_amount, current_amount?, deadline }
       → Create savings goal (computes daily/weekly targets)

PATCH  /api/finance/savings-goals/:id
       Body: { current_amount }
       → Update savings progress

GET    /api/finance/can-afford
       Query: ?amount=80&currency=AED
       → Can-afford check
       Response: { can_afford: bool, available_after, current_balance, upcoming_7_days }

GET    /api/finance/whatif
       Query: ?amount=80&currency=AED
       → 30-day balance projection with hypothetical spend
       Response: { projection: [{ date, balance }], with_spend, without_spend }

GET    /api/finance/insights
       → Spending Detective insights
       Response: { insights: [{ category, this_week, last_week, change_pct, message }] }
```

### Calendar Endpoints

```
GET    /api/calendar/events
       Query: ?days=7
       → Get upcoming Google Calendar events (reads from local cache + re-syncs)
       Response: [{ id, title, start_time, end_time, is_exam, is_class }]

POST   /api/calendar/events
       Body: { title, start_time, end_time, description? }
       → Create event in Google Calendar

POST   /api/calendar/events/:eventId/reminder
       Body: { minutes_before: 1440 }  // 1440 = 1 day before
       → Set reminder for event

GET    /api/calendar/suggestions
       → Get proactive suggestions based on upcoming events
       Response: { suggestions: [{ message, action, event_id }] }

GET    /api/calendar/auth
       → Initiate Google OAuth flow
POST   /api/calendar/auth/callback
       → Handle OAuth callback, store refresh token
```

### Profile Endpoints

```
GET    /api/profile
       → Get user profile + agent_profile
PATCH  /api/profile
       Body: { currency?, timezone?, monthly_budget? }
       → Update profile
```

---

## 9. Google Calendar Integration

### OAuth Setup
1. Create OAuth 2.0 credentials in Google Cloud Console for your Cloud Run service.
2. Redirect URI: `https://YOUR_BACKEND_URL/api/calendar/auth/callback`
3. Scopes required:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`

### OAuth Flow (Backend)
```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// GET /api/calendar/auth
app.get('/api/calendar/auth', async (req, reply) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    state: req.user.id // pass userId in state to link after callback
  });
  reply.redirect(authUrl);
});

// POST /api/calendar/auth/callback
app.get('/api/calendar/auth/callback', async (req, reply) => {
  const { code, state: userId } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  // Store tokens.refresh_token in agent_profile for userId
  await supabase.from('agent_profile').update({
    gcal_refresh_token: tokens.refresh_token, // encrypt in production
    calendar_connected: true
  }).eq('user_id', userId);
  reply.redirect('/calendar'); // back to frontend
});
```

### Reading Events
```typescript
async function getUpcomingEvents(userId: string, days: number = 7) {
  const profile = await getAgentProfile(userId);
  oauth2Client.setCredentials({ refresh_token: profile.gcal_refresh_token });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    timeMax: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });
  
  return response.data.items;
}
```

### Creating Events + Reminders
```typescript
async function createEvent(userId: string, { title, start_time, end_time, description }) {
  oauth2Client.setCredentials({ refresh_token: profile.gcal_refresh_token });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const event = {
    summary: title,
    description,
    start: { dateTime: start_time, timeZone: 'Asia/Dubai' },
    end: { dateTime: end_time, timeZone: 'Asia/Dubai' },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 60 }    // 1 hour before
      ]
    }
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
  
  return response.data;
}
```

---

## 10. Audio Pipeline (Study Agent)

### Browser-Side Recording
```typescript
// Frontend: useAudioRecorder hook
const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
  const chunks: Blob[] = [];
  
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    await uploadAudio(blob);
  };
  
  mediaRecorder.start(1000); // collect chunks every second
  setMediaRecorder(mediaRecorder);
};

const stopRecording = () => mediaRecorder.stop();

const uploadAudio = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('audio', blob, 'lecture.webm');
  formData.append('course_id', selectedCourseId);
  formData.append('week_number', weekNumber);
  
  const response = await fetch('/api/study/transcribe', {
    method: 'POST',
    body: formData,
    headers: { Authorization: `Bearer ${token}` }
  });
  const { lecture_id } = await response.json();
  pollStatus(lecture_id);
};
```

### Backend Transcription Pipeline
```typescript
// POST /api/study/transcribe
app.post('/api/study/transcribe', async (req, reply) => {
  const { audio, course_id, week_number, chapter, lecture_number } = req.files;
  
  // 1. Create lecture record with status 'pending'
  const { data: lecture } = await supabase.from('lectures').insert({
    user_id: userId, course_id, week_number, chapter, lecture_number,
    processing_status: 'pending'
  }).select().single();
  
  // Reply immediately with lecture_id so frontend can poll
  reply.send({ lecture_id: lecture.id, status: 'processing' });
  
  // 2. Background processing (don't await in the request handler)
  processAudio(lecture.id, audio.data, userId).catch(err => {
    supabase.from('lectures').update({ processing_status: 'error' }).eq('id', lecture.id);
    console.error('Audio processing failed:', err);
  });
});

async function processAudio(lectureId: string, audioBuffer: Buffer, userId: string) {
  // Step 1: Update status to 'transcribing'
  await supabase.from('lectures').update({ processing_status: 'transcribing' }).eq('id', lectureId);
  
  // Step 2: Transcribe with Gemini Flash (multimodal)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const audioPart = {
    inlineData: {
      data: audioBuffer.toString('base64'),
      mimeType: 'audio/webm'
    }
  };
  
  const transcriptResult = await model.generateContent([
    audioPart,
    'Transcribe this lecture audio verbatim. Preserve all words exactly as spoken. ' +
    'Format: plain text, no timestamps, no speaker labels unless multiple speakers are present.'
  ]);
  
  const rawTranscript = transcriptResult.response.text();
  
  // Step 3: Save transcript
  await supabase.from('transcripts').insert({
    lecture_id: lectureId, user_id: userId, raw_text: rawTranscript,
    word_count: rawTranscript.split(' ').length
  });
  
  // Step 4: Update status to 'generating_notes'
  await supabase.from('lectures').update({ processing_status: 'generating_notes' }).eq('id', lectureId);
  
  // Step 5: Generate structured notes
  const notesResult = await model.generateContent(
    NOTES_GENERATION_PROMPT.replace('{{TRANSCRIPT}}', rawTranscript)
  );
  const notesJson = JSON.parse(notesResult.response.text());
  
  await supabase.from('notes').insert({
    lecture_id: lectureId, user_id: userId,
    structured_notes: notesJson.structured_notes,
    summary: notesJson.summary,
    key_concepts: notesJson.key_concepts,
    formulas: notesJson.formulas,
    definitions: notesJson.definitions
  });
  
  // Step 6: Generate practice questions
  const questionsResult = await model.generateContent(
    QUESTIONS_GENERATION_PROMPT.replace('{{TRANSCRIPT}}', rawTranscript).replace('{{NOTES}}', notesJson.structured_notes)
  );
  const questionsJson = JSON.parse(questionsResult.response.text());
  
  await supabase.from('practice_questions').insert(
    questionsJson.questions.map(q => ({ ...q, lecture_id: lectureId, user_id: userId }))
  );
  
  // Step 7: Mark complete
  await supabase.from('lectures').update({ processing_status: 'complete' }).eq('id', lectureId);
}
```

### Notes Generation Prompt
```
NOTES_GENERATION_PROMPT = `
You are an expert academic note-taker. Given this lecture transcript, generate structured notes.

TRANSCRIPT:
{{TRANSCRIPT}}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "structured_notes": "## [Title]\n### Summary\n...\n### Key Concepts\n...",
  "summary": "3-5 sentence summary of the lecture",
  "key_concepts": ["concept1", "concept2"],
  "formulas": [{ "name": "...", "formula": "...", "explanation": "..." }],
  "definitions": [{ "term": "...", "definition": "..." }]
}
`
```

### Practice Questions Generation Prompt
```
QUESTIONS_GENERATION_PROMPT = `
Generate 5 practice questions (3 MCQ, 2 short answer) based on this lecture.

NOTES:
{{NOTES}}

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "question_type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": "medium"
    },
    {
      "question_type": "short_answer",
      "question": "...",
      "correct_answer": "...",
      "explanation": "...",
      "difficulty": "medium"
    }
  ]
}
`
```

---

## 11. Finance Agent Logic (All Features)

### Can I Afford?
```typescript
async function canAfford(userId: string, amount: number, currency: string) {
  const profile = await getAgentProfile(userId);
  
  // 1. Get current balance
  const { balance } = await getBalance(userId);
  
  // 2. Get upcoming expenses (next 7 days)
  const { data: recurring } = await supabase
    .from('recurring_expenses')
    .select('amount, next_due')
    .eq('user_id', userId)
    .eq('is_active', true)
    .lte('next_due', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  
  const upcomingTotal = recurring?.reduce((s, r) => s + r.amount, 0) || 0;
  const availableAfterPurchase = balance - upcomingTotal - amount;
  
  return {
    can_afford: availableAfterPurchase > 0,
    current_balance: balance,
    upcoming_commitments: upcomingTotal,
    available: balance - upcomingTotal,
    available_after_purchase: availableAfterPurchase
  };
}
```

### What-If Simulator
```typescript
async function whatIfProjection(userId: string, hypotheticalSpend: number) {
  const today = new Date();
  const projection = [];
  
  let runningBalance = await getBalance(userId).then(b => b.balance);
  runningBalance -= hypotheticalSpend; // apply hypothetical spend today
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // Check for recurring expenses on this date
    const { data: dueToday } = await supabase
      .from('recurring_expenses')
      .select('amount')
      .eq('user_id', userId)
      .eq('next_due', dateStr)
      .eq('is_active', true);
    
    const dueAmount = dueToday?.reduce((s, r) => s + r.amount, 0) || 0;
    runningBalance -= dueAmount;
    
    projection.push({ date: dateStr, balance: runningBalance });
  }
  
  return projection;
}
```

### SOS Mode
The Finance Agent receives: `{ daily_cap, recent_spending_by_category }` from the tool, then generates a natural language survival plan using this Gemini prompt:

```
The student has AED {{AMOUNT}} left for {{DAYS}} days.
Daily cap: AED {{DAILY_CAP}}.

Their recent spending by category:
{{SPENDING_JSON}}

Generate a specific, practical survival budget:
1. What is the absolute daily limit?
2. Which categories must be cut immediately?
3. What are 3 specific actions they can take today?
4. What are non-negotiable expenses they must still cover?

Be direct, specific, and practical. Use AED amounts. Do not moralize.
```

### Spending Detective
```typescript
async function getSpendingInsights(userId: string) {
  const thisWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const lastWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [thisWeek, lastWeek] = await Promise.all([
    supabase.from('transactions').select('category, amount').eq('user_id', userId)
      .gte('transaction_date', thisWeekStart).eq('type', 'expense'),
    supabase.from('transactions').select('category, amount').eq('user_id', userId)
      .gte('transaction_date', lastWeekStart)
      .lt('transaction_date', thisWeekStart).eq('type', 'expense')
  ]);
  
  const categories = ['food', 'transport', 'entertainment', 'education', 'health', 'subscriptions', 'other'];
  
  return categories.map(cat => {
    const thisTotal = thisWeek.data?.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0) || 0;
    const lastTotal = lastWeek.data?.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0) || 0;
    const changePct = lastTotal === 0 ? 100 : ((thisTotal - lastTotal) / lastTotal) * 100;
    
    return {
      category: cat,
      this_week: thisTotal,
      last_week: lastTotal,
      change_pct: changePct,
      flagged: changePct > 20 && thisTotal > 50 // only flag meaningful increases
    };
  }).filter(i => i.flagged);
}
```

---

## 12. Environment Variables & Secrets

Create `.env` files for both frontend and backend. **Never commit these.**

### Backend `.env`
```env
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server-side only
SUPABASE_ANON_KEY=your_anon_key

# Google OAuth (for Calendar)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://YOUR_BACKEND_URL/api/calendar/auth/callback

# App
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://YOUR_FRONTEND_URL
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL
```

### Cloud Run Secrets
Store sensitive values in Google Secret Manager, then reference them in Cloud Run:
```bash
# Create secrets
gcloud secrets create GEMINI_API_KEY --data-file=- <<< "your_key"
gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=- <<< "your_key"

# In Cloud Run deployment, reference them:
--set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

---

## 13. Folder Structure

```
student-partner/
├── frontend/                        # Next.js app
│   ├── app/
│   │   ├── layout.tsx               # Root layout (sidebar + tabs)
│   │   ├── page.tsx                 # Redirects to /agent
│   │   ├── agent/
│   │   │   └── page.tsx             # Agent chat tab
│   │   ├── finance/
│   │   │   └── page.tsx             # Finance tab
│   │   ├── study/
│   │   │   └── page.tsx             # Study tab
│   │   └── calendar/
│   │       └── page.tsx             # Calendar tab
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx       # Main chat UI
│   │   │   ├── MessageBubble.tsx    # Individual message
│   │   │   ├── ChatInput.tsx        # Text + mic input bar
│   │   │   ├── ChatSidebar.tsx      # List of chats
│   │   │   └── RoutingNote.tsx      # "Routing to X Agent" note
│   │   ├── finance/
│   │   │   ├── OverviewCards.tsx    # Balance/budget cards
│   │   │   ├── AddTransaction.tsx   # Chat+form toggle
│   │   │   ├── SpendingChart.tsx    # Recharts bar + line
│   │   │   └── TransactionTable.tsx # History table
│   │   ├── study/
│   │   │   ├── CourseTree.tsx       # File-system tree
│   │   │   ├── LectureViewer.tsx    # Tabs: transcript/notes/questions
│   │   │   ├── RecordingOverlay.tsx # Recording UI
│   │   │   └── QuestionCard.tsx     # MCQ + short answer card
│   │   ├── calendar/
│   │   │   ├── EventList.tsx        # Upcoming events
│   │   │   ├── SuggestionBanner.tsx # Proactive suggestions
│   │   │   └── QuickAddEvent.tsx    # Add event form
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/
│   │   ├── useAudioRecorder.ts      # MediaRecorder hook
│   │   ├── useChat.ts               # Chat state + SSE streaming
│   │   └── useFinance.ts            # Finance data fetching
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   └── api.ts                   # Fetch wrapper with auth headers
│   ├── store/
│   │   └── appStore.ts              # Zustand global state
│   ├── Dockerfile
│   └── package.json
│
├── backend/                         # Fastify + ADK
│   ├── src/
│   │   ├── index.ts                 # Fastify app entry
│   │   ├── routes/
│   │   │   ├── chat.ts              # /api/chat routes
│   │   │   ├── study.ts             # /api/study routes
│   │   │   ├── finance.ts           # /api/finance routes
│   │   │   ├── calendar.ts          # /api/calendar routes
│   │   │   └── profile.ts           # /api/profile routes
│   │   ├── agents/
│   │   │   ├── router.ts            # Router Agent
│   │   │   ├── study.ts             # Study Agent + tools
│   │   │   ├── finance.ts           # Finance Agent + tools
│   │   │   ├── calendar.ts          # Calendar Agent + tools
│   │   │   └── general.ts           # General Agent
│   │   ├── prompts/
│   │   │   ├── router.ts            # ROUTER_SYSTEM_PROMPT
│   │   │   ├── study.ts             # STUDY_AGENT_SYSTEM_PROMPT
│   │   │   ├── finance.ts           # FINANCE_AGENT_SYSTEM_PROMPT
│   │   │   ├── calendar.ts          # CALENDAR_AGENT_SYSTEM_PROMPT
│   │   │   ├── notes_generation.ts  # NOTES_GENERATION_PROMPT
│   │   │   └── questions.ts         # QUESTIONS_GENERATION_PROMPT
│   │   ├── services/
│   │   │   ├── supabase.ts          # Supabase client + helper functions
│   │   │   ├── gemini.ts            # Gemini client + helper functions
│   │   │   ├── audioProcessing.ts   # Full audio pipeline
│   │   │   └── googleCalendar.ts    # GCal OAuth + read/write
│   │   ├── middleware/
│   │   │   └── auth.ts              # JWT verification via Supabase
│   │   └── types/
│   │       └── index.ts             # Shared TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── architecture-diagram.png          # Required for submission
├── README.md                        # Setup instructions + submission info
└── docker-compose.yml               # Local dev (optional)
```

---

## 14. Deployment (Cloud Run)

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy Commands
```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy backend
cd backend
gcloud run deploy student-partner-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,SUPABASE_URL=..." \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest" \
  --memory 512Mi \
  --cpu 1 \
  --port 8080

# Deploy frontend
cd frontend
gcloud run deploy student-partner-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://student-partner-backend-xxx.run.app" \
  --memory 512Mi \
  --port 3000
```

### Proof of GCP Deployment (for judges)
Include in demo video:
1. Navigate to Cloud Run console → show both services running
2. Show the `.run.app` URL in browser address bar
3. Show Cloud Run logs tab with live requests

---

## 15. Demo Script (Exact, 4 Minutes)

**Pre-demo checklist:**
- [ ] Pre-recorded 60-second audio clip ready (a mock lecture on a topic you know well)
- [ ] At least one existing lecture with notes already in the DB (to skip processing wait)
- [ ] Finance tab has some transactions already loaded
- [ ] Google Calendar connected with at least 3–4 events (including one "Quiz" event this week)
- [ ] Cloud Run dashboard open in another browser tab (for GCP proof)

---

**[0:00 – 0:30] Introduction**

> "Students today manage four completely separate tools — notes apps, spreadsheet budgets, Google Calendar, and ChatGPT — with zero connection between them. The result is mental overhead, missed deadlines, and broken budgets. Student Partner is a single AI agent that unifies all four into one conversation. Under the hood, a Router Agent classifies every message and delegates to specialized Study, Finance, and Calendar agents — each with its own memory and tools. Let me show you how it works."

---

**[0:30 – 2:00] Study Flow (90 seconds)**

1. (0:30) Open Study tab. Show the course tree. Click on MATH301 → Week 1.
   > "I have my courses here in a file-system tree. Let me upload a lecture recording."

2. (0:40) Click `[Upload Audio/Video]`. Select the pre-recorded 60s clip. Watch the status bar:
   > "Watch the status: Uploading → Transcribing → Generating Notes. This is Gemini 2.0 Flash processing the audio multimodally."

3. (1:00) While waiting — switch to an already-complete lecture and show Notes tab.
   > "Here's a lecture I processed earlier. You can see the structured notes — key concepts, definitions, formulas, and a summary. All generated automatically from the raw audio."

4. (1:20) Click Practice Questions tab.
   > "And here are practice questions — MCQs and short-answer — generated from the transcript."

5. (1:35) Switch to Agent tab. Type: `"Quiz me on Chapter 1 of MATH301"`
   > "Now I can ask the agent to quiz me. Notice the routing note — 'Routing to Study Agent.'"
   (Agent responds with a question. Optionally answer it and show follow-up.)

---

**[2:00 – 3:30] Finance Flow (90 seconds)**

6. (2:00) Stay in Agent chat. Type: `"I received AED 300 from part-time work today"`
   > "Logging income. Watch the routing note."
   (Agent confirms: "Got it — I've logged AED 300 income on Aug 30.")

7. (2:20) Type: `"Can I afford to spend AED 80 on dinner tonight?"`
   (Agent runs can-afford check and responds with yes/no + remaining balance + upcoming expenses.)
   > "The agent checks current balance minus upcoming recurring expenses, then tells me if I can afford it — with actual numbers."

8. (2:45) Type: `"I only have AED 150 left for 10 days. SOS mode."`
   (Agent responds with daily cap, categories to cut, specific actions.)
   > "SOS Mode gives a practical survival budget — daily cap, what to cut, what's non-negotiable."

9. (3:00) Briefly switch to Finance tab.
   > "The Finance tab shows the same data visually — balance, budget progress, spending by category, upcoming recurring expenses."
   (Point at charts for 10 seconds.)

---

**[3:00 – 3:30] Calendar Flow (30 seconds)**

10. (3:00) Switch to Calendar tab.
    > "My Google Calendar is synced. I can see my upcoming events."
    (Show event list. One event should say "Quiz" or "Exam".)

11. (3:10) Show the Proactive Suggestion banner.
    > "The agent detected an upcoming quiz and is proactively asking: 'Want an alarm the night before?' I'll say yes."
    (Click `[Yes, set alarm]`. Show confirmation.)

12. (3:20) Type in chat: `"Add a 2-hour study block tomorrow at 7 PM for MATH301"`
    (Agent responds with confirmation, creates calendar event.)

---

**[3:30 – 4:00] Architecture + GCP Proof (30 seconds)**

13. (3:30) Switch to the architecture diagram slide/image.
    > "Here's the architecture: Router Agent using Google ADK, four specialized sub-agents, Gemini 2.0 Flash for all inference, Supabase for persistent state, and deployed on Cloud Run."

14. (3:45) Switch to Cloud Run console browser tab.
    > "Both services — frontend and backend — running on Cloud Run. You can see live logs and request counts here."
    (Show the `.run.app` URL. Show the logs streaming.)

15. (3:55) End.
    > "One agent. Four domains. No tab-switching. Thank you."

---

## 16. Architecture Diagram Description

Draw this in Excalidraw, Miro, or draw.io and export as PNG for submission.

```
┌───────────────────────────────────────────────────────────────┐
│                    Google Cloud Run                            │
│                                                               │
│  ┌─────────────────────┐     ┌─────────────────────────────┐ │
│  │   Frontend           │────>│   Backend (Fastify + ADK)   │ │
│  │   Next.js            │ API │                             │ │
│  │   Cloud Run          │<────│   ┌─────────────────────┐  │ │
│  └─────────────────────┘     │   │   Router Agent       │  │ │
│                               │   │   (Google ADK)       │  │ │
│                               │   └──────────┬──────────┘  │ │
│                               │              │              │ │
│                               │   ┌──────────┼──────────┐  │ │
│                               │   │          │          │  │ │
│                               │  ┌▼──────┐ ┌▼───────┐ ┌▼──────┐ │
│                               │  │Study  │ │Finance │ │Calendar│ │
│                               │  │Agent  │ │Agent   │ │Agent  │ │
│                               │  └───┬───┘ └───┬────┘ └───┬───┘ │
│                               └──────┼──────────┼──────────┼────┘
│                                      │          │          │
│  ┌───────────────────┐    ┌──────────▼──────────▼──────┐   │
│  │  Gemini 2.0 Flash │<───│        Supabase (Postgres) │   │
│  │  (All LLM calls)  │    │  transcripts, notes,       │   │
│  └───────────────────┘    │  transactions, chats,       │   │
│                            │  profile, calendar cache    │   │
│                            └────────────────────────────┘   │
│                                                               │
│                    ┌────────────────────┐                     │
│                    │ Google Calendar API│                     │
│                    └────────────────────┘                     │
└───────────────────────────────────────────────────────────────┘
```

Label in the diagram:
- **Google ADK** badge on Router Agent
- **Gemini 2.0 Flash** on the LLM box
- **Cloud Run** wrapping the whole backend + frontend
- **Supabase** for storage
- **Google Calendar API** as external integration

---

## 17. Submission Checklist

### Required
- [ ] **Demo video** (~4 minutes, unedited)
  - [ ] Shows the problem being solved
  - [ ] Shows all three core flows (study, finance, calendar)
  - [ ] Shows backend running on Google Cloud (Cloud Run dashboard visible)
  - [ ] Shows the `.run.app` URL in action
- [ ] **Code repository** (GitHub, public or shared with testing@devpost.com and cloudhackathons@google.com)
  - [ ] `README.md` with step-by-step local setup instructions
  - [ ] All environment variables documented (not the values — the names + descriptions)
  - [ ] Docker files present
- [ ] **Architecture diagram** (clear PNG/SVG showing Gemini, ADK, Cloud Run, Supabase, Calendar)
- [ ] **Text description** covering:
  - [ ] Features and functionality
  - [ ] Technologies used (Gemini 2.0 Flash, Google ADK, Cloud Run, Supabase, Google Calendar API)
  - [ ] Findings and learnings
- [ ] **Track selected**: The Collaborative Partner (or Taskmaster)
- [ ] **Hosted URL** (if possible — the Cloud Run frontend URL)

### Verification: Mandatory Tech Used
- [ ] **Gemini 3.5+**: Using `gemini-2.0-flash` ✓
- [ ] **Google Agent Framework**: Google ADK for agent orchestration ✓
- [ ] **Google Cloud Infrastructure**: Cloud Run for both frontend and backend ✓

### Bonus Points
- [ ] Blog post or video on Medium/dev.to/YouTube (mention "created for All Things Agentic Hackathon")
- [ ] Social post on LinkedIn/X with `#AllThingsAgenticHackathon`
- [ ] Use Gemma model (can use Gemma 3 for the General Agent as a cost-saving measure)

---

## 18. 10-Hour Build Timeline

### Hour 1 (Setup)
- [ ] Create Supabase project. Run all SQL from Section 4. Enable RLS.
- [ ] Create Google Cloud project. Enable Gemini API, Cloud Run API.
- [ ] Get Gemini API key.
- [ ] Scaffold Next.js frontend (`npx create-next-app@latest frontend --typescript --tailwind`)
- [ ] Scaffold Fastify backend (`npm init -y`, install fastify, @google/generative-ai, @supabase/supabase-js)
- [ ] Set up `.env` files.

### Hour 2 (Router Agent + Basic Chat)
- [ ] Implement Router Agent with Gemini (Section 6.1).
- [ ] Implement `POST /api/chat` endpoint with SSE streaming.
- [ ] Build basic Chat UI: input bar, message bubbles, routing note display.
- [ ] Test: send a message, see it route correctly.

### Hour 3 (Study Agent — Text Q&A)
- [ ] Implement Study Agent with tools (get_transcript, get_notes, get_questions).
- [ ] Insert a test lecture + transcript into Supabase manually.
- [ ] Test: "Quiz me on Lecture 1" → agent reads from Supabase, generates questions.

### Hour 4 (Audio Pipeline)
- [ ] Implement `useAudioRecorder` hook in frontend.
- [ ] Implement `POST /api/study/transcribe` endpoint with background processing.
- [ ] Implement `processAudio` function (transcribe → notes → questions).
- [ ] Build recording overlay UI with waveform.
- [ ] Test end-to-end: record 30 seconds, see transcript + notes appear.

### Hour 5 (Study Tab UI)
- [ ] Build CourseTree component.
- [ ] Build LectureViewer with Transcript / Notes / Questions tabs.
- [ ] Build QuestionCard with MCQ radio buttons and answer reveal.
- [ ] Connect to real Supabase data.

### Hour 6 (Finance Agent + Tools)
- [ ] Implement Finance Agent with all tools (Section 11).
- [ ] Implement `POST /api/finance/transactions`.
- [ ] Implement `GET /api/finance/can-afford`.
- [ ] Implement SOS mode (Gemini call with spending data).
- [ ] Test: "I spent AED 50 on food" → logged. "Can I afford AED 80?" → response with numbers.

### Hour 7 (Finance Tab UI)
- [ ] Build OverviewCards (balance, budget, savings).
- [ ] Build AddTransaction (chat input + form toggle).
- [ ] Build SpendingChart (Recharts bar chart by category).
- [ ] Build TransactionTable.
- [ ] Connect to `GET /api/finance/summary` and `GET /api/finance/transactions`.

### Hour 8 (Calendar Integration)
- [ ] Set up Google OAuth credentials.
- [ ] Implement OAuth flow (Section 9).
- [ ] Implement `getUpcomingEvents` and `createEvent`.
- [ ] Implement Calendar Agent.
- [ ] Implement `GET /api/calendar/suggestions` (proactive detection).
- [ ] Build Calendar tab UI: EventList + SuggestionBanner.
- [ ] Test: connect Google Calendar, see events, click "Yes" on suggestion.

### Hour 9 (Polish + Chat Sidebar)
- [ ] Build ChatSidebar (list of chats, new chat button).
- [ ] Implement chat title generation (take first 40 chars of first message).
- [ ] Fix any broken flows from integration.
- [ ] Add loading states and error states throughout.
- [ ] Test the complete demo script once.

### Hour 10 (Deploy + Submission)
- [ ] Write Dockerfiles for frontend and backend.
- [ ] Deploy backend to Cloud Run.
- [ ] Deploy frontend to Cloud Run.
- [ ] Set secrets in Cloud Run.
- [ ] Test deployed URL end-to-end.
- [ ] Create architecture diagram (Excalidraw, 15 minutes).
- [ ] Record demo video (one take, 4 minutes).
- [ ] Write README.md with setup instructions.
- [ ] Submit on Devpost.

---

## 19. Bonus Points Strategy

### Blog Post (Recommended — 1–2 hours, do this after submission)
Write on dev.to or Medium titled:
> "How I built a 4-in-1 AI student agent with Google ADK and Gemini in 10 hours"

Must include:
- The problem you solved
- Architecture walkthrough with diagram
- Key technical decisions (why ADK, why Supabase, why Fastify)
- Learnings and what you'd do differently
- Include: "I created this content for the purposes of entering the All Things Agentic Hackathon."

### Social Post (10 minutes)
Post on LinkedIn or X:
> "Just submitted my entry to @Google's All Things Agentic Hackathon! Built Student Partner — a 4-agent AI system that unifies lecture notes, budgeting, and calendar management into one chat. Powered by Gemini 2.0 Flash + Google ADK + Cloud Run. #AllThingsAgenticHackathon 🎓💰📅"

Include a screenshot of the app or architecture diagram.

### Gemma Integration (for extra credit)
Use Gemma 3 for the General Agent (low-stakes, high-volume queries like explanations and web questions). This:
- Reduces Gemini API costs
- Demonstrates awareness of the model ecosystem
- Earns bonus points for Gemma integration

Implementation:
```typescript
// Use Gemma via Vertex AI (Gemma 3 is available on Vertex AI)
// Or use Gemini Flash for everything for simplicity — Gemma adds complexity
```

---

*PRD Version 1.0 | Built for All Things Agentic Hackathon | Deadline: Aug 31, 2026*
