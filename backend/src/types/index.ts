export type HistoryItem = { role: string; content: string };
export type Profile = Record<string, unknown>;
export type AgentResult = { reply: string; data?: object };
export type ClarificationResult = { type: "clarification"; question: string };
export type RouteResult = { type: "route"; agent: string; note: string };
export type RoutingResult = ClarificationResult | RouteResult;
