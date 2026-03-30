// src/components/ProfileCompletionDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function ProfileCompletionDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--background)] border border-[var(--border)] rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-semibold">
            Let's personalize your space
          </DialogTitle>
          <DialogDescription>
            Add your details and pick an avatar to make MindNest feel like yours.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/profile');
            }}
            className="bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Set Up Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
