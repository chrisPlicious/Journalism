import { Feather, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { ProfileCompletionDialog } from "@/components/dialog";
import MainLayout from "@/components/layouts/main-layout";
import { getJournals } from "@/services/api";
import type { JournalEntryDto } from "@/models/journal";
import { categoryColorMap } from "@/lib/categories";

const prompts = [
  "What is one thing that brought you unexpected joy this week?",
  "Describe a moment today when you felt truly present.",
  "What are three things you're grateful for right now?",
  "Write about a challenge you overcame recently.",
  "What would you tell your younger self?",
  "Describe your ideal day from start to finish.",
  "What's something new you learned this week?",
  "Write about someone who inspires you and why.",
  "What are you most looking forward to?",
  "Describe a place that makes you feel at peace.",
  "What is a belief you held that has changed over time?",
  "Write about a small act of kindness you witnessed or performed.",
  "What does success mean to you right now?",
  "Describe a sound that brings you comfort.",
  "What is something you've been putting off, and why?",
  "Write about a memory that always makes you smile.",
  "What would you do if you had no fear?",
  "Describe the last time you felt truly proud of yourself.",
  "What is one habit you'd like to build or break?",
  "Write a letter to your future self one year from now.",
  "What does your perfect morning routine look like?",
  "Describe a book, movie, or song that changed your perspective.",
  "What boundaries have you set recently that you're proud of?",
  "Write about a time you surprised yourself.",
  "What does rest look like for you?",
  "Describe something beautiful you noticed today.",
  "What is one thing you wish more people understood about you?",
  "Write about a lesson you learned the hard way.",
  "What brings you energy when you feel drained?",
  "Describe a conversation that stayed with you.",
  "What are you learning to let go of?",
];

function getGreeting(username: string | null): string {
  const hour = new Date().getHours();
  const name = username || "there";
  if (hour >= 5 && hour <= 11) return `Good morning, ${name}`;
  if (hour >= 12 && hour <= 16) return `Good afternoon, ${name}`;
  if (hour >= 17 && hour <= 20) return `Good evening, ${name}`;
  return `Good night, ${name}`;
}

export default function HomePage() {
  const { username, isProfileComplete } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntryDto[]>([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  useEffect(() => {
    const hasShownDialog = sessionStorage.getItem("profileDialogShown");
    if (isProfileComplete === false && !hasShownDialog) {
      setIsDialogOpen(true);
      sessionStorage.setItem("profileDialogShown", "true");
    }
  }, [isProfileComplete]);

  useEffect(() => {
    getJournals()
      .then((data: JournalEntryDto[]) => {
        setEntries(data);
      })
      .catch((err: unknown) => {
        console.error("Failed to load entries for dashboard:", err);
      })
      .finally(() => setEntriesLoaded(true));
  }, []);

  const todayPrompt = prompts[new Date().getDate() % prompts.length];
  const recentEntries = entries.slice(0, 3);
  const entryCount = entries.length;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MainLayout>
      <ProfileCompletionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="space-y-12">
          {/* Section 1 — Personalized Greeting */}
          <section>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--foreground)]">
              {getGreeting(username)}
            </h1>
            <p className="text-base text-[var(--muted-foreground)] mt-2">
              {entriesLoaded
                ? entryCount > 0
                  ? `You have ${entryCount} journal ${entryCount === 1 ? "entry" : "entries"}.`
                  : "Ready to start your journaling journey?"
                : "\u00A0"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {formattedDate}
            </p>
          </section>

          {/* Section 2 — Quick Actions */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/newentry"
                className="bg-gradient-to-br from-[var(--primary)] to-[var(--sage-500)] text-white rounded-2xl p-6 min-h-[140px] flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg transition-all duration-250 active:scale-[0.98]"
              >
                <Feather size={28} />
                <div>
                  <h2 className="font-serif text-xl font-medium">
                    Start Writing
                  </h2>
                  <p className="text-sm opacity-90">
                    Capture what's on your mind
                  </p>
                </div>
              </Link>

              <Link
                to="/entries"
                className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 min-h-[140px] flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-lg transition-all duration-250 active:scale-[0.98]"
              >
                <BookOpen
                  size={28}
                  className="text-[var(--primary)]"
                />
                <div>
                  <h2 className="font-serif text-xl font-medium text-[var(--card-foreground)]">
                    Your Entries
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {entriesLoaded
                      ? `${entryCount} ${entryCount === 1 ? "entry" : "entries"}`
                      : "View all entries"}
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Section 3 — Writing Prompt of the Day */}
          <section>
            <div className="bg-[var(--sage-50)] dark:bg-[var(--accent)] rounded-2xl p-5 border border-[var(--sage-100)]">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-[var(--sage-500)]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sage-500)]">
                  Today's Prompt
                </span>
              </div>
              <p className="font-serif text-lg italic text-[var(--sage-700)] dark:text-[var(--sage-300)]">
                {todayPrompt}
              </p>
            </div>
          </section>

          {/* Section 4 — Recent Entries Preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-[var(--foreground)]">
                Recent Entries
              </h2>
              <Link
                to="/entries"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View All &rarr;
              </Link>
            </div>

            {entriesLoaded && recentEntries.length === 0 ? (
              <div className="flex items-center gap-3 py-8 justify-center text-[var(--muted-foreground)]">
                <BookOpen size={20} />
                <p className="text-sm">
                  Your recent entries will appear here once you start writing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    to="/entries"
                    className="block bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-250"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            categoryColorMap[entry.category] || "var(--muted-foreground)",
                        }}
                      />
                      <h3 className="font-serif text-base font-medium text-[var(--card-foreground)] line-clamp-1">
                        {entry.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                      {entry.content.length > 80
                        ? entry.content.slice(0, 80) + "..."
                        : entry.content}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
