export const categoryColorMap: Record<string, string> = {
  personal: "var(--category-personal)",
  Personal: "var(--category-personal)",
  work: "var(--category-work)",
  Work: "var(--category-work)",
  study: "var(--category-study)",
  Study: "var(--category-study)",
  travel: "var(--category-travel)",
  Travel: "var(--category-travel)",
};

export function getCategoryColor(category: string): string {
  return categoryColorMap[category] || "var(--border)";
}

export function getCategoryChipStyle(category: string): React.CSSProperties {
  const color = getCategoryColor(category);
  return {
    backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
    color: color,
  };
}

export const CATEGORIES = [
  {
    value: "personal",
    label: "Personal",
    bg: "rgba(184,169,212,0.15)",
    color: "#B8A9D4",
    darkColor: "#8B7AB3",
  },
  {
    value: "work",
    label: "Work",
    bg: "rgba(169,196,212,0.15)",
    color: "#A9C4D4",
    darkColor: "#7AA3B8",
  },
  {
    value: "study",
    label: "Study",
    bg: "rgba(212,201,169,0.15)",
    color: "#D4C9A9",
    darkColor: "#B8AD7A",
  },
  {
    value: "travel",
    label: "Travel",
    bg: "rgba(169,212,184,0.15)",
    color: "#A9D4B8",
    darkColor: "#7AB88B",
  },
];
