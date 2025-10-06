import { useState } from "react";
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
import AppLayout from "@/components/layouts/app-sidebar"; // Use your AppLayout
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all fields"); // Replace with toast if added
      return;
    }

    try {
      setLoading(true);
      await createJournal({ title, category, content });
      toast.success("Journal entry created successfully"); // Replace with toast
      navigate("/entries"); // Navigate to entries after success
      // Reset form
      setTitle("");
      setCategory("");
      setContent("");
      setErrors({ title: false, category: false, content: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create journal"); // Replace with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppLayout>
        {" "}
        {/* Wrap with your AppLayout */}
        <Toaster richColors position="top-center" />
        <div className="flex flex-1 items-center justify-center min-h-screen">
          <Card className="w-7xl shadow-xl">
            <CardHeader>
              <CardTitle className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Add Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 space-y-0 gap-10 mt-4 mx-4">
              <label className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Title
              </label>
              <label className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Category
              </label>
            </CardContent>
            <CardContent className="grid grid-cols-3 space-y-4 gap-10 mx-4">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={
                  error.title ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className={`w-full text-1xl ${
                    error.category ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="bg-white w-full text-1xl">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardContent>
              <label className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Content
              </label>
              <ShadcnTextEditor
                value={content}
                onChange={setContent}
                error={error.content}
              />
              {error.content && (
                <p className="text-red-500">Content is required</p>
              )}
            </CardContent>
            <CardFooter className="mx-4 my-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    </SidebarProvider>
  );
}
