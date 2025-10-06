import { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookOpen, PenTool, Calendar } from "lucide-react"; // Assuming you have lucide-react for icons
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/api";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [username, setUsername] = useState<string>("Guest");

  useEffect(() => {
    if (isAuthenticated) {
      getUserProfile()
        .then((profile) => setUsername(profile.userName || "User"))
        .catch(() => setUsername("User"));
    } else {
      setUsername("Guest");
    }
  }, [isAuthenticated]);

  return (
    <SidebarProvider className="flex min-h-screen">
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen  from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Hello {username}, Welcome to Journal App.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Capture your thoughts, track your journey, and reflect on your
              life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Read Entries
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse and revisit your past journal entries.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <PenTool className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Write New
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start writing your next journal entry today.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <Calendar className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your journaling habits over time.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </SidebarProvider>
  );
}
