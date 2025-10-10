import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <h2 className="text-3xl font-semibold text-white mb-4">
        Choose your avatar
      </h2>
      <Card className="w-96 bg-white/10 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-5">
            {avatars.map((avatar) => (
              <div
                key={avatar}
                onClick={() =>
                  setSelected((prev) => (prev === avatar ? null : avatar))
                }
                className={`${
                  selected === avatar
                    ? "border-white transition-all duration-300 scale-110 shadow-lg"
                    : ""
                } border-transparent  transition-all duration-300`}
              >
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
