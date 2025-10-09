import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const avatars = [
  "/Avatars/BurstFade.jpg",
  "/Avatars/CocoMartin.jpg",
  "/Avatars/cocoMartin2.jpg",
  "/Avatars/fadenya.jpg",
  "/Avatars/kap.jpg",
  "/Avatars/kap2.jpg",
  "/Avatars/mullet.jpg",
  "/Avatars/nabunturan.jpg",
  "/Avatars/norwen.jpg",
  "/Avatars/taposna.jpg",
];

export default function SelectAvatar() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateAvatar } = useAuth();

  const handleSave = async () => {
    if (!selected) {
      alert("Please select an avatar!");
      return;
    }

    try {
      const currentProfile = await getProfile();
      const updatedProfile = {
        ...currentProfile,
        avatarUrl: selected,
      };

      await updateProfile(updatedProfile);
      updateAvatar(selected);
      navigate("/home");
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to save avatar. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-3xl font-semibold text-white mb-4">
        Choose your avatar
      </h2>

      <Carousel className="w-7xl max-w-lg">
        <CarouselContent className="-ml-1">
          {avatars.map((src, i) => (
            <CarouselItem
              key={i}
              className="pl-1 basis-full flex justify-center"
              onClick={() => setSelected((prev) => (prev === src ? null : src))}
            >
              <Card
                className={`p-2  transition-all duration-300 cursor-pointer ${
                  selected === src
                    ? "border-blue-500 scale-105"
                    : "border-transparent scale-100"
                }`}
              >
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={src}
                    alt={`Avatar ${i + 1}`}
                    className="w-70 h-70 rounded-full object-cover"
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
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition-all"
      >
        Save Avatar
      </Button>

      <Button>
        <Link to="/home">Maybe later</Link>
      </Button>
    </div>
  );
}
