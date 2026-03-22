import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/themeContext";
import MainLayout from "@/components/layouts/main-layout";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createJournal } from "../services/api";
import ShadcnTextEditor from "@/components/TextEditor/TextEditor";
import { CATEGORIES } from "@/lib/categories";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewEntryPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { username } = useAuth();

  const [error, setErrors] = useState({
    title: false,
    category: false,
    content: false,
  });

  const handleSubmit = async () => {
    const newErrors = {
      title: !title.trim(),
      category: !category.trim(),
      content: !content.trim(),
    };

    setErrors(newErrors);

    // Collect all missing fields
    const missingFields: string[] = [];
    if (newErrors.title) missingFields.push("Title is required");
    if (newErrors.category) missingFields.push("Category is required");
    if (newErrors.content) missingFields.push("Content is required");

    if (missingFields.length > 0) {
      // Trigger a Sonner toast for each missing field
      missingFields.forEach((msg) => {
        toast.error(msg, { duration: 3000 });
      });
      return;
    }

    try {
      setLoading(true);
      await createJournal({ title, category, content });
      toast.success("Journal entry created successfully");
      navigate("/entries");

      // Reset form
      setTitle("");
      setCategory("");
      setContent("");
      setErrors({ title: false, category: false, content: false });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400 && err.response.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to create journal");
      }
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <MainLayout>
      <Toaster richColors position="top-center" />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
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

        {/* Date display */}
        <div className="text-sm text-[var(--muted-foreground)] mt-3">
          {formatDate(new Date())}
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

        {/* Submit area */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white hover:bg-[var(--sage-500)] rounded-[10px] py-3 font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Entry"}
          </button>
          <button
            onClick={() => navigate("/entries")}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-center mt-3 block w-full transition-colors"
          >
            Discard and go back
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
