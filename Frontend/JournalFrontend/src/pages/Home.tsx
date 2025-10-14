import { BookOpen, PenTool, Calendar } from "lucide-react"; // Assuming you have lucide-react for icons
import { useAuth } from "@/context/AuthContext";
import {useState, useEffect} from "react";
import {ProfileCompletionDialog} from "@/components/dialog";
import MainLayout from "@/components/layouts/main-layout";

export default function HomePage() {
  const { username, isProfileComplete } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Show dialog only once per session for incomplete profiles
    const hasShownDialog = sessionStorage.getItem('profileDialogShown')
    
    if (isProfileComplete === false && !hasShownDialog) {
      setIsDialogOpen(true)
      sessionStorage.setItem('profileDialogShown', 'true')
    }
  }, [isProfileComplete])

  return (
    <MainLayout>

      <ProfileCompletionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen  from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <img
              src="/MindNestLogoDark.png"
              alt="MindNest Logo"
              className="h-50 w-auto block dark:hidden"
            />
            <img
              src="/MindNestLogoLight.png"
              alt="MindNest Logo"
              className="h-50 w-auto hidden dark:block"
            />
          </div>
          <h1 className="text-3xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
            Hello {username}, <br /> Welcome to MindNest.
          </h1>
          <p className="text-md md:text-xl text-gray-600 dark:text-gray-300">
            Capture your thoughts, track your journey, and reflect on your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-zinc-800 dark:bg-white py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
            <BookOpen className="h-12 w-12 text-white dark:text-gray-900 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white dark:text-gray-900 mb-2">
              Read Entries
            </h3>
            <p className="text-gray-300 dark:text-gray-600">
              Browse and revisit your past journal entries.
            </p>
          </div>

          <div className="bg-zinc-800 dark:bg-white py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
            <PenTool className="h-12 w-12 text-white dark:text-gray-900 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white dark:text-gray-900 mb-2">Write New</h3>
            <p className="text-gray-300 dark:text-gray-600">
              Start writing your next journal entry today.
            </p>
          </div>

          <div className="bg-zinc-800 dark:bg-white py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
            <Calendar className="h-12 w-12 text-white dark:text-gray-900 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white dark:text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-300 dark:text-gray-600">
              See your journaling habits over time.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
