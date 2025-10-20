import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  getJournals,
  deleteJournal,
  getJournalById,
  journalFavorite,
  journalPin,
} from "../services/api"; // Use your API
import type { JournalEntryDto, JournalEntryDetailDto } from "../models/journal"; // Use your types
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import JournalDialog from "../components/Viewer/EntryView"; // Use customized dialog
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import { Pin, Star } from "lucide-react";

export default function EntriesPage() {
  const [journals, setJournals] = useState<JournalEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<JournalEntryDetailDto | null>(null);
  const { username } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getJournals()
      .then((data) => {
        console.log("Fetched journals:", data);
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
            .sort((a, b) => Number(b.isPinned) - Number(a.isPinned)) // reorder pinned first
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to pin entry");
    }
  };

  const handleDelete = (id: number) => {
    toast("Are you sure you want to delete?", {
      description: "This action cannot be undone.",
      duration: 5000, // how long toast stays
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            await deleteJournal(id);
            setJournals((prev) => prev.filter((journal) => journal.id !== id));
            toast.success("Journal entry deleted successfully ✅");
          } catch (err) {
            console.error("Failed to delete journal entry", err);
            toast.error("Failed to delete journal entry ❌");
          }
        },
      },
    });
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

  if (loading) {
    return (
      <MainLayout>
        <p className="text-center mt-10">Loading...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10 flex-1 items-center justify-center">
        <div className="flex-col gap-5 items-center mb-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            {username}'s Journal Entries
          </h1>
          <div className="flex gap-4 items-center">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                className="text-base md:text-lg lg:text-[20px] font-bold bg-black text-white border-white w-full md:w-auto md:min-w-[200px] mt-5"
                aria-label="Filter journal entries by category"
              >
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
        <Separator className="mb-6 h-[3px] shadow bg-neutral-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.length > 0 ? (
            filteredJournals.map((entry) => (
              <Card
                key={entry.id}
                className="flex flex-col justify-between border-neutral-800 bg-zinc-800 dark:bg-white transform hover:scale-102 transition-transform duration-500"
              >
                <CardHeader className="text-white dark:text-black">
                  <CardTitle className="flex justify-between text-xl md:text-2xl font-semibold ">
                    <div>{entry.title}</div>
                    <div className="grid grid-cols-2 gap-5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={async () => handleFavorite(entry.id)}
                            className={`p-1 hover:opacity-100 transition ${
                              entry.isFavorite
                                ? "text-white dark:text-black" // ✅ white in light mode, black in dark mode
                                : "text-gray-400" // not favorited yet
                            }`}
                          >
                            <Star
                              className="w-7 h-7"
                              style={{
                                fill: entry.isFavorite
                                  ? "currentColor"
                                  : "none",
                                stroke: "currentColor",
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
                            onClick={async () => handlePin(entry.id)}
                            className={`p-1 hover:opacity-100 transition ${
                              entry.isPinned
                                ? "text-white dark:text-black"
                                : "text-gray-400"
                            }`}
                          >
                            <Pin
                              className="w-7 h-7"
                              strokeWidth={entry.isPinned ? 3 : 2}
                              style={{
                                fill: entry.isPinned ? "currentColor" : "none",
                                stroke: "currentColor",
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
                  </CardTitle>
                  <p className="text-sm ">{entry.category}</p>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-white dark:text-black">
                  <span>
                    Created: {new Date(entry.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
                    {/* 📌 Pin Button */}

                    <Button
                      className="bg-white text-black dark:bg-black dark:text-white hover:bg-muted min-h-[44px]"
                      onClick={() => handleOpen(true, entry.id)}
                      aria-label={`View journal entry: ${entry.title}`}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(entry.id)}
                      disabled={loading}
                      className="text-white dark:bg-destructive min-h-[44px]"
                      aria-label={`Delete journal entry: ${entry.title}`}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-2xl text-center text-gray-400">
              No journal entries found.
            </p>
          )}
        </div>
        <JournalDialog
          entry={detail}
          open={open}
          onOpenChange={(o) => handleOpen(o)}
        />
      </div>
      <Toaster richColors position="top-center" />
    </MainLayout>
  );
}
