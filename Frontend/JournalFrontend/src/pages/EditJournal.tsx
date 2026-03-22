import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layouts/main-layout";
import { updateJournal, getJournalById } from "../services/api";
import ShadcnTextEditor from "@/components/TextEditor/TextEditor";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const CATEGORIES = [
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

export default function EditJournal() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setErrors] = useState({
    title: false,
    category: false,
    content: false,
  });

  const { id } = useParams<{ id: string }>();

  // Prefill data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      getJournalById(Number(id))
        .then((entry) => {
          setTitle(entry.title || "");
          setCategory(entry.category || "");
          setContent(entry.content || "");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load journal");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async () => {
    const newErrors = {
      title: !title.trim(),
      category: !category.trim(),
      content: !content.trim(),
    };

    setErrors(newErrors);

    const missingFields: string[] = [];
    if (newErrors.title) missingFields.push("Title is required");
    if (newErrors.category) missingFields.push("Category is required");
    if (newErrors.content) missingFields.push("Content is required");

    if (missingFields.length > 0) {
      missingFields.forEach((msg) => {
        toast.error(msg, { duration: 3000 });
      });
      return;
    }

    try {
      setLoading(true);
      await updateJournal(Number(id), { title, category, content });
      toast.success("Journal entry updated successfully");
      navigate("/entries");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update journal");
    } finally {
      setLoading(false);
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <MainLayout>
      <Toaster richColors position="top-center" />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Overline */}
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">
          Editing Entry
        </div>

        {/* Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className={`w-full bg-transparent border-0 border-b border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-0 font-serif text-3xl font-semibold placeholder:text-[var(--muted-foreground)] pb-3 text-[var(--foreground)] ${
            error.title ? "border-b-[var(--destructive)]" : ""
          }`}
        />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.value;
            const activeColor = isDark ? cat.darkColor : cat.color;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() =>
                  setCategory(isSelected ? "" : cat.value)
                }
                className="rounded-full py-1.5 px-4 text-sm font-medium border cursor-pointer transition-colors"
                style={
                  isSelected
                    ? {
                        backgroundColor: cat.bg,
                        borderColor: activeColor,
                        color: activeColor,
                      }
                    : {
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                        backgroundColor: "transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Text Editor */}
        <div className="mt-6">
          <ShadcnTextEditor
            value={content}
            onChange={setContent}
            error={error.content}
          />
          {error.content && (
            <p className="text-[var(--destructive)] text-sm mt-1">Content is required</p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[var(--primary)] text-white hover:bg-[var(--sage-500)] rounded-[10px] py-3 font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => navigate("/entries")}
              className="border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] rounded-[10px] py-3 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={() => {
              // Navigate back — deletion can be handled from the entries page
              toast.error("Delete functionality available from entries page");
            }}
            className="text-sm text-[var(--destructive)] hover:underline text-center mt-4 block w-full transition-colors"
          >
            Delete this entry
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
