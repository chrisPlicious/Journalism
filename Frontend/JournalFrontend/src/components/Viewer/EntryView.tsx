import { type ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { JournalEntryDetailDto } from "../../models/journal";
import { Link } from "react-router-dom";
import { Pencil, Star } from "lucide-react";

const categoryColorMap: Record<string, string> = {
  personal: "var(--category-personal)",
  Personal: "var(--category-personal)",
  work: "var(--category-work)",
  Work: "var(--category-work)",
  study: "var(--category-study)",
  Study: "var(--category-study)",
  travel: "var(--category-travel)",
  Travel: "var(--category-travel)",
};

function getCategoryColor(category: string): string {
  return categoryColorMap[category] || "var(--border)";
}

function getCategoryChipStyle(category: string): React.CSSProperties {
  const color = getCategoryColor(category);
  return {
    backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
    color: color,
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface JournalDialogProps {
  entry: JournalEntryDetailDto | null;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export default function JournalDialog({
  entry,
  trigger,
  open,
  onOpenChange,
  isFavorite = false,
  onToggleFavorite,
  onDelete,
}: JournalDialogProps) {
  if (!entry) return null;

  const dialogProps =
    open !== undefined && typeof onOpenChange === "function"
      ? { open, onOpenChange }
      : {};

  return (
    // @ts-ignore — dialogProps typed as any to allow conditional spread
    <Dialog {...(dialogProps as any)}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-[var(--background)] border border-[var(--border)] rounded-[20px] px-6 md:px-10 py-6 md:py-8"
      >
        <DialogHeader className="relative">
          {/* Edit icon button — top right */}
          <Link
            to={`/editjournal/${entry.id}`}
            className="absolute top-0 right-0 inline-flex items-center justify-center h-9 w-9 rounded-md text-[var(--primary)] hover:bg-[var(--muted)] transition-colors"
            aria-label="Edit entry"
          >
            <Pencil className="h-5 w-5" />
          </Link>

          <DialogTitle className="font-serif text-2xl font-semibold text-[var(--foreground)] pr-10">
            {entry.title}
          </DialogTitle>

          {/* Hidden description for accessibility */}
          <DialogDescription className="sr-only">
            Journal entry details for {entry.title}
          </DialogDescription>

          {/* Metadata row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {entry.category && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
                style={getCategoryChipStyle(entry.category)}
              >
                {entry.category}
              </span>
            )}
            <span className="text-sm text-[var(--muted-foreground)]">
              {entry.createdAt ? formatDate(entry.createdAt) : "N/A"}
            </span>
          </div>
        </DialogHeader>

        {/* Separator */}
        <div className="border-t border-[var(--border)] my-6" />

        {/* Content area */}
        <div className="text-[17px] leading-[1.7] text-[var(--foreground)] [&>p]:mb-5">
          {entry.content ? (
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          ) : (
            <p className="italic text-[var(--muted-foreground)]">
              This entry has no content.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] mt-6 pt-4">
          <div className="flex items-center justify-between">
            {/* Left: Favorite toggle */}
            <button
              onClick={onToggleFavorite}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                color: isFavorite ? "#D4A843" : "var(--muted-foreground)",
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className="h-5 w-5"
                style={{
                  fill: isFavorite ? "#D4A843" : "none",
                  stroke: isFavorite ? "#D4A843" : "currentColor",
                }}
              />
              Favorite
            </button>

            {/* Right: Edit + Delete */}
            <div className="flex items-center gap-3">
              <Link
                to={`/editjournal/${entry.id}`}
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                Edit Entry
              </Link>
              <button
                onClick={onDelete}
                className="text-sm font-medium text-[var(--destructive)] opacity-60 hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
