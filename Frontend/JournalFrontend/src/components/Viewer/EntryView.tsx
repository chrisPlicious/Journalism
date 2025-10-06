import { type ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { JournalEntryDetailDto } from "../../models/journal"; // Use your type
import { Link } from "react-router-dom"; // Use react-router-dom
import { Button } from "@/components/ui/button";
// import DOMPurify from 'dompurify';

interface JournalDialogProps {
  entry: JournalEntryDetailDto | null;
  trigger?: ReactNode; // optional trigger (button/icon/etc)
  // optional controlled API
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // you can add other props (size, className) as needed
}

export default function JournalDialog({
  entry,
  trigger,
  open,
  onOpenChange,
}: JournalDialogProps) {
  if (!entry) return null;

  const createdAt = entry.createdAt ? new Date(entry.createdAt) : null;
  const updatedAt = entry.updatedAt ? new Date(entry.updatedAt) : null;

  // Build props for Dialog: only pass open/onOpenChange if both provided
  const dialogProps =
    open !== undefined && typeof onOpenChange === "function"
      ? { open, onOpenChange }
      : {};

  return (
    // @ts-ignore — dialogProps typed as any to allow conditional spread
    <Dialog {...(dialogProps as any)}>
      {/* if trigger was provided, use it as the DialogTrigger */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-5xl w-full max-h-[80vh] overflow-y-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle className="flex justify-between text-3xl font-bold pr-10">
            {entry.title}
            <Link to={`/editjournal/${entry.id}`}>
              {/* Match your route */}
              <Button className="bg-zinc-800 text-white hover:bg-black text-lg">
                Edit
              </Button>
            </Link>
          </DialogTitle>
          {/* Hidden description for accessibility (avoids missing-description warning) */}
          <DialogDescription className="sr-only">   
            Journal entry details for {entry.title}
          </DialogDescription>
        </DialogHeader>
        {/* metadata moved outside DialogDescription to avoid invalid nesting */}
        <div className="flex justify-between text-lg mt-1">
          <span>Category: {entry.category ?? "—"}</span>
          <span>
            Created: {createdAt ? createdAt.toLocaleDateString() : "N/A"}
          </span>
          <span>
            Last updated: {updatedAt ? updatedAt.toLocaleDateString() : "N/A"}
          </span>
        </div>

        <Separator className="my-4" />
        {/* content - plain text, not HTML */}
        <div className="prose max-w-none text-black text-xl">
          {entry.content ? (
            <p dangerouslySetInnerHTML={{ __html: entry.content || ""}} />
          ) : (
            <p className="text-gray-400 italic">(No content)</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
