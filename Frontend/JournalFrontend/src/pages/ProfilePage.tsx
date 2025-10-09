import { useState, useEffect } from "react";
import AppSidebar from "@/components/layouts/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile, updateProfile } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import AvatarPickerDrawer from "@/components/AvatarPickerDrawer";

interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  avatarUrl: string;
}

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
  const [error, setError] = useState<string | null>(null);
  const { updateAvatar } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
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
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
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
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, avatarUrl };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      updateAvatar(avatarUrl);
    } catch (err: any) {
      alert("Failed to update avatar: " + err.message);
    }
  };

  if (!profile) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{profile.userName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{profile.gender}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {new Date(profile.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <AvatarPickerDrawer
                avatars={avatars}
                onSelect={handleAvatarSelect}
                triggerLabel="Change Avatar"
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
