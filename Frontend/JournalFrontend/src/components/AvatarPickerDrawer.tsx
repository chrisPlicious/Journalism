import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface AvatarPickerDrawerProps {
  avatars: string[];
  onSelect: (avatarUrl: string) => void;
  triggerLabel?: string;
}

export default function AvatarPickerDrawer({
  avatars,
  onSelect,
  triggerLabel = "Choose Avatar",
}: AvatarPickerDrawerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (selected) {
      onSelect(selected);
      setOpen(false);
      setSelected(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] px-4 py-1.5 mt-3 transition-colors">
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="p-6 max-w-md bg-[var(--background)] border border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Select Your Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center">
          <Carousel className="w-full max-w-md mt-4">
            <CarouselContent>
              {avatars.map((src, i) => (
                <CarouselItem
                  key={i}
                  className="basis-full flex justify-center cursor-pointer"
                  onClick={() =>
                    setSelected((prev) => (prev === src ? null : src))
                  }
                >
                  <Card
                    className={`p-2 border-2 transition-all duration-300 ${
                      selected === src
                        ? "ring-2 ring-[var(--primary)] border-transparent scale-105"
                        : "border-transparent hover:ring-2 hover:ring-[var(--sage-200)] scale-100"
                    }`}
                  >
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <img
                        src={src}
                        alt={`Avatar ${i + 1}`}
                        className="w-40 h-40 rounded-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Button
            onClick={handleSave}
            className="mt-6 bg-[var(--primary)] hover:opacity-90 text-white font-semibold"
            disabled={!selected}
          >
            Save Avatar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
