import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "../components/layouts/main-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { updateJournal, getJournalById } from "../services/api"; // Use your API
import ShadcnTextEditor from "@/components/TextEditor/TextEditor";
import { toast, Toaster } from "sonner";

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
          toast.error("Failed to load journal ❌");
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
      // Trigger a Sonner toast for each missing field
      missingFields.forEach((msg) => {
        toast.error(msg, { duration: 3000 });
      });
      return;
    }

    try {
      setLoading(true);
      await updateJournal(Number(id), { title, category, content });
      toast.success("Journal entry updated successfully");
      navigate("/entries"); // Navigate back after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Toaster richColors position="top-center" />
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Card className="w-7xl shadow-xl bg-zinc-100 dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-gray-900 dark:text-white">
              Edit Journal Entry
            </CardTitle>
          </CardHeader>
          {/* <CardContent className="grid grid-cols-3 space-y-0 gap-10 mt-4 mx-4">
              <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Title
              </label>
              <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Category
              </label>
            </CardContent> */}
          <CardContent className="grid grid-cols-3 space-y-4 gap-10 mx-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`bg-white dark:bg-zinc-700 text-gray-900 dark:text-white ${
                error.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            <Select
              value={category}
              onValueChange={(val) => {
                if (val === "__clear__") {
                  setCategory(""); // reset to empty → shows placeholder
                } else {
                  setCategory(val);
                }
              }}
            >
              <SelectTrigger
                className={`w-full text-1xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${
                  error.category ? "border-red-500 focus:ring-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectItem
                  value="work"
                  className="text-gray-900 dark:text-white"
                >
                  Work
                </SelectItem>
                <SelectItem
                  value="personal"
                  className="text-gray-900 dark:text-white"
                >
                  Personal
                </SelectItem>
                <SelectItem
                  value="study"
                  className="text-gray-900 dark:text-white"
                >
                  Study
                </SelectItem>
                <SelectItem
                  value="travel"
                  className="text-gray-900 dark:text-white"
                >
                  Travel
                </SelectItem>

                <SelectSeparator />
                <SelectItem
                  value="__clear__"
                  className="text-red-500 font-bold flex justify-center"
                >
                  Clear
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardContent>
            {/* <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Content
              </label> */}
            <ShadcnTextEditor
              value={content}
              onChange={setContent}
              error={error.content}
            />
            {error.content && (
              <p className="text-red-500 dark:text-red-400">
                Content is required
              </p>
            )}
          </CardContent>
          <CardFooter className="mx-4 my-4 grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-600 dark:bg-white dark:hover:text-black"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={() => navigate("/entries")}
              className="bg-black hover:bg-gray-600 dark:bg-white dark:hover:text-black"
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
