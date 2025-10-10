import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layouts/main-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { createJournal } from "../services/api";
import ShadcnTextEditor from "@/components/TextEditor/TextEditor";

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

  return (
    <MainLayout>
      <Toaster richColors position="top-center" />
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <Card className="w-7xl shadow-xl bg-zinc-100 dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-gray-900 dark:text-white">
              What's on your mind, {username}?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 space-y-0 gap-10 mt-4 mx-4">
            <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Title
            </label>
            <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Category
            </label>
          </CardContent>
          <CardContent className="grid grid-cols-3 space-y-0 gap-10 mx-4">
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
                <SelectItem value="work" className="text-gray-900 dark:text-white">Work</SelectItem>
                <SelectItem value="personal" className="text-gray-900 dark:text-white">Personal</SelectItem>
                <SelectItem value="study" className="text-gray-900 dark:text-white">Study</SelectItem>
                <SelectItem value="travel" className="text-gray-900 dark:text-white">Travel</SelectItem>

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
            <label className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Content
            </label>
            <ShadcnTextEditor
              value={content}
              onChange={setContent}
              error={error.content}
            />
            {error.content && (
              <p className="text-red-500 dark:text-red-400">Content is required</p>
            )}
          </CardContent>
          <CardFooter className="mx-4 my-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
