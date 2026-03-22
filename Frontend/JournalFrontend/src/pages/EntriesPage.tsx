import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import {
  getJournals,
  deleteJournal,
  getJournalById,
  journalFavorite,
  journalPin,
} from "../services/api";
import type { JournalEntryDto, JournalEntryDetailDto } from "../models/journal";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layouts/main-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import JournalDialog from "../components/Viewer/EntryView";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Pin, Star, BookOpen, PenLine, Filter, SearchX } from "lucide-react";
import { getCategoryColor } from "@/lib/categories";

function getCategoryChipStyle(category: string): React.CSSProperties {
  const color = getCategoryColor(category);
  return {
    backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
    color: color,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EntriesPage() {
  const [journals, setJournals] = useState<JournalEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<JournalEntryDetailDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { username } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getJournals()
      .then((data) => {
        setJournals(data);
      })
      .catch((err) => console.error("Failed to load Journal", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Prefer `q`; support legacy `search` then normalize URL to `q`
    const q = searchParams.get("q");
    const legacy = searchParams.get("search");
    const next = q ?? legacy ?? "";
    setSearchQuery(next);

    if (!q && legacy) {
      const sp = new URLSearchParams(searchParams);
      sp.set("q", legacy);
      sp.delete("search");
      setSearchParams(sp, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleFavorite = async (id: number) => {
    try {
      const res = await journalFavorite(id);
      setJournals((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, isFavorite: res.data.isFavorite } : j
        )
      );
    } catch (error: any) {
      toast.error("Failed to update favorite status");
    }
  };

  const handlePin = async (id: number) => {
    try {
      const res = await journalPin(id);
      setJournals(
        (prev) =>
          prev
            .map((j) =>
              j.id === id ? { ...j, isPinned: res.data.isPinned } : j
            )
            .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to pin entry");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteJournal(deleteTarget);
      setJournals((prev) => prev.filter((journal) => journal.id !== deleteTarget));
      toast.success("Journal entry deleted successfully");
    } catch (err) {
      console.error("Failed to delete journal entry", err);
      toast.error("Failed to delete journal entry");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleOpen = async (isOpen: boolean, id?: number) => {
    setOpen(isOpen);
    if (isOpen && id) {
      try {
        const fullEntry = await getJournalById(id);
        setDetail(fullEntry);
      } catch (err) {
        console.error("Failed to load entry details", err);
      }
    } else {
      setDetail(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    const sp = new URLSearchParams(searchParams);
    sp.delete("q");
    sp.delete("search");
    setSearchParams(sp, { replace: true });
  };

  const qText = searchQuery.trim().toLowerCase();
  const filteredJournals = journals.filter((journal) => {
    // Favorites filter
    if (selectedCategory === "favorites" && !journal.isFavorite) return false;

    // Category filter
    if (
      selectedCategory !== "all" &&
      selectedCategory !== "favorites" &&
      journal.category !== selectedCategory
    ) {
      return false;
    }

    // Search filter
    const matchesText =
      qText === "" ||
      journal.title.toLowerCase().includes(qText) ||
      journal.content.toLowerCase().includes(qText);

    return matchesText;
  });

  // Skeleton loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 flex-1">
          {/* Header skeleton */}
          <div>
            <div className="h-10 w-64 bg-[var(--muted)] rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-[var(--muted)] rounded mt-2 animate-pulse" />
          </div>
          {/* Filter skeleton */}
          <div className="mt-6 mb-8">
            <div className="h-10 w-44 bg-[var(--muted)] rounded-full animate-pulse" />
          </div>
          {/* Card grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--muted)] rounded-2xl h-[200px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 flex-1">
        {/* Page Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--foreground)]">
            Journal Entries
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {journals.length} {journals.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                className="rounded-full bg-[var(--muted)] px-4 py-2 text-sm font-medium border-none w-auto min-w-[180px] gap-2"
                aria-label="Filter journal entries by category"
              >
                <Filter size={16} className="shrink-0" />
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {journals.length === 0 ? (
          /* Empty state — user has zero entries */
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="h-12 w-12 text-[var(--sage-300)]" />
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mt-6">
              Your journal awaits
            </h2>
            <p className="text-base text-[var(--muted-foreground)] text-center max-w-sm mt-3">
              This is where your thoughts and reflections will live. Start your
              first entry to begin your journaling journey.
            </p>
            <Link
              to="/newentry"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white rounded-[10px] py-2.5 px-6 font-semibold mt-6 hover:bg-[var(--sage-500)] transition-all active:scale-[0.98]"
            >
              <PenLine className="h-5 w-5" />
              Write your first entry
            </Link>
          </div>
        ) : filteredJournals.length === 0 ? (
          /* No search results state */
          <div className="flex flex-col items-center justify-center py-20">
            <SearchX className="h-12 w-12 text-[var(--sage-300)]" />
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mt-6">
              No entries found
            </h2>
            <p className="text-base text-[var(--muted-foreground)] text-center max-w-sm mt-3">
              No entries match your search. Try a different term or check your
              filters.
            </p>
            <button
              onClick={clearSearch}
              className="text-[var(--primary)] text-sm font-medium mt-6 hover:underline transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Entry Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJournals.map((entry) => (
              <div
                key={entry.id}
                className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 border-l-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-250 cursor-pointer"
                style={{ borderLeftColor: getCategoryColor(entry.category) }}
                onClick={() => handleOpen(true, entry.id)}
              >
                {/* Pin indicator */}
                {entry.isPinned && (
                  <Pin className="absolute top-4 right-4 h-4 w-4 text-[var(--primary)]" />
                )}

                {/* Title */}
                <h3 className="font-serif text-lg font-medium text-[var(--card-foreground)] line-clamp-2 pr-6">
                  {entry.title}
                </h3>

                {/* Category chip */}
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mt-2"
                  style={getCategoryChipStyle(entry.category)}
                >
                  {entry.category}
                </span>

                {/* Date */}
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  {formatDate(entry.createdAt)}
                </p>

                {/* Card footer */}
                <div
                  className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left side — Favorite & Pin buttons */}
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleFavorite(entry.id)}
                          className="p-1 hover:opacity-100 transition"
                          aria-label={
                            entry.isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Star
                            className="h-5 w-5"
                            style={{
                              fill: entry.isFavorite ? "#D4A843" : "none",
                              stroke: entry.isFavorite
                                ? "#D4A843"
                                : "var(--muted-foreground)",
                              transition: "0.2s ease",
                            }}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {entry.isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handlePin(entry.id)}
                          className="p-1 hover:opacity-100 transition"
                          aria-label={
                            entry.isPinned ? "Unpin" : "Pin to top"
                          }
                        >
                          <Pin
                            className="h-5 w-5"
                            style={{
                              fill: entry.isPinned
                                ? "var(--primary)"
                                : "none",
                              stroke: entry.isPinned
                                ? "var(--primary)"
                                : "var(--muted-foreground)",
                              transition: "0.2s ease",
                            }}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{entry.isPinned ? "Unpin" : "Pin to top"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Right side — View & Delete */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpen(true, entry.id)}
                      className="text-[var(--primary)] text-sm font-medium hover:underline"
                      aria-label={`View journal entry: ${entry.title}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(entry.id)}
                      className="text-[var(--destructive)] text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
                      aria-label={`Delete journal entry: ${entry.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <JournalDialog
          entry={detail}
          open={open}
          onOpenChange={(o) => handleOpen(o)}
          isFavorite={
            detail
              ? journals.find((j) => j.id === detail.id)?.isFavorite ?? false
              : false
          }
          onToggleFavorite={() => {
            if (detail) handleFavorite(detail.id);
          }}
          onDelete={() => {
            if (detail) {
              setOpen(false);
              setDeleteTarget(detail.id);
            }
          }}
        />

        {/* Delete confirmation dialog */}
        <AlertDialog
          open={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent className="bg-[var(--background)] border border-[var(--border)] rounded-[20px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This journal entry will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-[var(--border)]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster richColors position="top-center" />
    </MainLayout>
  );
}
