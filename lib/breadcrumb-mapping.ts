export const BREADCRUMB_MAPPING: Record<string, string> = {
  "chat-models": "Chat Models",
  logs: "Logs",
  feedbacks: "Feedbacks",
  overview: "Overview",
};

export function getBreadcrumbLabel(segment: string): string {
  return (
    BREADCRUMB_MAPPING[segment] ||
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}
