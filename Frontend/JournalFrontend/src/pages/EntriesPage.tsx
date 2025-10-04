import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getJournals, deleteJournal, getJournalById } from "../services/api"; // Use your API
import type { JournalEntryDto, JournalEntryDetailDto } from "../models/journal"; // Use your types
import AppLayout from "../components/layouts/app-sidebar"; // Use AppLayout
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JournalDialog from "../components/Viewer/EntryView"; // Use customized dialog
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";

export default function EntriesPage() {
  const [journals, setJournals] = useState<JournalEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<JournalEntryDetailDto | null>(null);

  useEffect(() => {
    getJournals()
      .then((data) => {
        console.log("Fetched journals:", data);
        setJournals(data);
      })
      .catch((err) => console.error("Failed to load Journal", err))
      .finally(() => setLoading(false));
  }, []);

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

  const filteredJournals =
    selectedCategory === "all"
      ? journals
      : journals.filter((journal) => journal.category === selectedCategory);

  if (loading) {
    return (
      <AppLayout>
        <p className="text-center mt-10">Loading...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Toaster richColors position="top-center" />
      {" "}
      {/* Wrap with AppLayout */}
      <div className="py-10 px-25 flex-1">
        <div className="flex-cols gap-5 items-center mb-6">
          <h1 className="text-6xl font-bold">All Journal Entries</h1>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="text-[20px] font-bold bg-black text-white border-white w-50 mt-5">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="mb-6 h-[3px] shadow bg-neutral-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.length > 0 ? (
            filteredJournals.map((entry) => (
              <Card
                key={entry.id}
                className="flex flex-col justify-between border-neutral-800 bg-zinc-800 transform hover:scale-102 transition-transform duration-500"
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">
                    {entry.title}
                  </CardTitle>
                  <p className="text-sm text-gray-100">{entry.category}</p>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-gray-100">
                  <span>
                    Created: {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="bg-white text-black hover:bg-muted"
                      onClick={() => handleOpen(true, entry.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(entry.id)}
                      disabled={loading}
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
    </AppLayout>
  );
}
