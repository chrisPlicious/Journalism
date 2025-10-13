import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layouts/main-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile, updateProfile } from "@/services/api";
import { useAuth,  } from "@/context/AuthContext";
import AvatarPickerDrawer from "@/components/AvatarPickerDrawer";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type UserProfile } from "@/models/user";
import { toast, Toaster } from "sonner";

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const { updateAvatar, updateUsername, setProfileComplete } = useAuth();
  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
  const [tempDateOfBirth, setTempDateOfBirth] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [tempGender, setTempGender] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setTempDateOfBirth(profile.dateOfBirth.split("T")[0]);
      setTempFirstName(profile.firstName);
      setTempLastName(profile.lastName);
    }
  }, [profile]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center min-h-screen p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center min-h-screen p-8">
          <Card className="w-full max-w-md">
            <CardContent className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, avatarUrl };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      updateAvatar(avatarUrl);
      setProfileComplete?.(true);
      sessionStorage.removeItem("profileDialogShown");
    } catch (err: any) {
      alert("Failed to update avatar: " + err.message);
    }
  };

  const handleEditDateOfBirth = () => {
    setIsEditingDateOfBirth(true);
  };

  const handleSaveDateOfBirth = async () => {
    if (!profile) return;
    if (tempDateOfBirth === "") {
      toast.error("Date of birth cannot be empty");
      return;
    }
    try {
      const updatedDate = new Date(tempDateOfBirth).toISOString();
      const updatedProfile: UserProfile = {
        ...profile,
        dateOfBirth: updatedDate,
      };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditingDateOfBirth(false);
      setProfileComplete?.(true);
      sessionStorage.removeItem("profileDialogShown");
    } catch (err: any) {
      alert("Failed to update date of birth: " + err.message);
    }
  };

  const handleCancelDateOfBirth = () => {
    if (!profile) return;
    setIsEditingDateOfBirth(false);
    setTempDateOfBirth(profile.dateOfBirth.split("T")[0]);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!profile) return;

    if (tempFirstName === "" || tempLastName === "") {
      toast.error("Please fill in both first and last name");
      return;
    }
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        firstName: tempFirstName,
        lastName: tempLastName,
      };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditingName(false);
      setProfileComplete?.(true);
      sessionStorage.removeItem("profileDialogShown");
    } catch (err: any) {
      alert("Failed to update name: " + err.message);
    }
  };

  const handleCancelName = () => {
    if (!profile) return;
    setIsEditingName(false);
    setTempFirstName(profile.firstName);
    setTempLastName(profile.lastName);
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  const handleSaveUsername = async () => {
    if (!profile) return;
    if (tempUsername === "") {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        userName: tempUsername,
      };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      updateUsername(tempUsername);
      setIsEditingUsername(false);
      setProfileComplete?.(true);
      sessionStorage.removeItem("profileDialogShown");
    } catch (err: any) {
      alert("Failed to update username: " + err.message);
    }
  };

  const handleCancelUsername = () => {
    if (!profile) return;
    setIsEditingUsername(false);
    setTempUsername(profile.userName);
  };

  const handleEditGender = () => {
    setIsEditingGender(true);
  };

  const handleSaveGender = async () => {
    if (!profile) return;
    if (tempGender === "") {
      toast.error("Gender cannot be empty");
      return;
    }
    try {
      const updatedProfile: UserProfile = { ...profile, gender: tempGender };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditingGender(false);
      setProfileComplete?.(true);
      sessionStorage.removeItem("profileDialogShown");
    } catch (err: any) {
      alert("Failed to update gender: " + err.message);
    }
  };

  const handleCancelGender = () => {
    if (!profile) return;
    setIsEditingGender(false);
    setTempGender(profile.gender);
  };

  if (!profile) return null;

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center min-h-screen p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.avatarUrl || "/placeholder.svg"}
                    alt={profile.userName}
                  />
                  <AvatarFallback>
                    {profile.firstName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <div className="flex items-center justify-start gap-1">
                  <p className="text-sm text-gray-500">Name</p>
                  <Button
                    variant="link"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={handleEditName}
                  >
                    <SquarePen className="h-10 w-10" />
                  </Button>
                </div>
                {isEditingName ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={tempFirstName}
                        onChange={(e) => setTempFirstName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={tempLastName}
                        onChange={(e) => setTempLastName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveName}>Save</Button>
                      <Button variant="outline" onClick={handleCancelName}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </div>
                )}
                {/* <p className="font-medium">
                  {profile.firstName} {profile.lastName}
                </p> */}
              </div>

              {/* Usernname */}
              <div className="space-y-1">
                <div className="flex items-center justify-start gap-1">
                  <p className="text-sm text-gray-500">Username</p>
                  <Button
                    variant="link"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={handleEditUsername}
                  >
                    <SquarePen className="h-10 w-10" />
                  </Button>
                </div>
                {isEditingUsername ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveUsername}>Save</Button>
                      <Button variant="outline" onClick={handleCancelUsername}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{profile.userName}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <div className="flex items-center justify-start gap-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <Button
                    variant="link"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={() => console.log("Edit email clicked")}
                  >
                    <SquarePen className="h-10 w-10" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <div className="flex items-center justify-start gap-1">
                  <p className="text-sm text-gray-500">Gender</p>
                  <Button
                    variant="link"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={handleEditGender}
                  >
                    <SquarePen className="h-10 w-10" />
                  </Button>
                </div>
                {isEditingGender ? (
                  <div className="space-y-2">
                    <select
                      value={tempGender}
                      onChange={(e) => setTempGender(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveGender}>Save</Button>
                      <Button variant="outline" onClick={handleCancelGender}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{profile.gender}</p>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <div className="flex items-center justify-start gap-1">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <Button
                    variant="link"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={handleEditDateOfBirth}
                  >
                    <SquarePen className="h-10 w-10" />
                  </Button>
                </div>
                {isEditingDateOfBirth ? (
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={tempDateOfBirth}
                      onChange={(e) => setTempDateOfBirth(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveDateOfBirth}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelDateOfBirth}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <AvatarPickerDrawer
                avatars={avatars}
                onSelect={handleAvatarSelect}
                triggerLabel="Change Avatar"
              />
            </CardContent>
          </Card>
          <Toaster richColors position="top-center" />
        </div>
    </MainLayout>
  );
}
