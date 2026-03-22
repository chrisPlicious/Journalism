import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/main-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile, updateProfile } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import AvatarPickerDrawer from "@/components/AvatarPickerDrawer";
import { Pencil, Lock } from "lucide-react";
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
        <div className="max-w-[600px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <div className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-32 mt-4" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="mt-10 space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-[600px] mx-auto px-4 md:px-8 py-6 md:py-10 text-center">
          <p className="text-[var(--destructive)] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
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

  const inputClasses =
    "w-full bg-[var(--input)] border border-[var(--border)] rounded-[10px] py-2 px-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] outline-none transition-colors";

  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-10">
          <Avatar className="h-24 w-24 ring-4 ring-[var(--sage-200)] dark:ring-[var(--accent)]">
            <AvatarImage
              src={profile.avatarUrl || "/placeholder.svg"}
              alt={profile.userName}
            />
            <AvatarFallback>
              {profile.firstName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <AvatarPickerDrawer
            avatars={avatars}
            onSelect={handleAvatarSelect}
            triggerLabel="Change Avatar"
          />

          <h1 className="font-serif text-2xl font-semibold text-center mt-4 text-[var(--foreground)]">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] text-center">
            {profile.email}
          </p>
        </div>

        {/* Profile fields */}
        <div>
          {/* Name */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Name
              </span>
              {!isEditingName && (
                <button
                  onClick={handleEditName}
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Edit name"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {isEditingName ? (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveName}
                    className="bg-[var(--primary)] text-white rounded-lg px-3 py-1 text-sm hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelName}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-[var(--foreground)] mt-1">
                {profile.firstName} {profile.lastName}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Username
              </span>
              {!isEditingUsername && (
                <button
                  onClick={handleEditUsername}
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Edit username"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {isEditingUsername ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className={inputClasses}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveUsername}
                    className="bg-[var(--primary)] text-white rounded-lg px-3 py-1 text-sm hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelUsername}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-[var(--foreground)] mt-1">
                {profile.userName}
              </p>
            )}
          </div>

          {/* Email (non-editable) */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Email
              </span>
              <Lock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-base font-medium text-[var(--foreground)] mt-1">
              {profile.email}
            </p>
          </div>

          {/* Gender */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Gender
              </span>
              {!isEditingGender && (
                <button
                  onClick={handleEditGender}
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Edit gender"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {isEditingGender ? (
              <div className="mt-2 space-y-2">
                <select
                  value={tempGender}
                  onChange={(e) => setTempGender(e.target.value)}
                  className={inputClasses}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveGender}
                    className="bg-[var(--primary)] text-white rounded-lg px-3 py-1 text-sm hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelGender}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-[var(--foreground)] mt-1">
                {profile.gender}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                Date of Birth
              </span>
              {!isEditingDateOfBirth && (
                <button
                  onClick={handleEditDateOfBirth}
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Edit date of birth"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {isEditingDateOfBirth ? (
              <div className="mt-2 space-y-2">
                <input
                  type="date"
                  value={tempDateOfBirth}
                  onChange={(e) => setTempDateOfBirth(e.target.value)}
                  className={inputClasses}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDateOfBirth}
                    className="bg-[var(--primary)] text-white rounded-lg px-3 py-1 text-sm hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelDateOfBirth}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base font-medium text-[var(--foreground)] mt-1">
                {new Date(profile.dateOfBirth).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </MainLayout>
  );
}
