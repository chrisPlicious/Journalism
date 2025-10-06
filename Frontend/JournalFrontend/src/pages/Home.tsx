import AppSidebar from "@/components/layouts/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BookOpen, PenTool, Calendar } from "lucide-react"; // Assuming you have lucide-react for icons

export default function HomePage() {
  return (
    <SidebarProvider className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen  from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white mb-4">
              Hello, Welcome to Journal App.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Capture your thoughts, track your journey, and reflect on your
              life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-zinc-800 py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
              <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white  mb-2">
                Read Entries
              </h3>
              <p className="text-gray-300 ">
                Browse and revisit your past journal entries.
              </p>
            </div>

            <div className="bg-zinc-800 py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
              <PenTool className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Write New
              </h3>
              <p className="text-gray-300 ">
                Start writing your next journal entry today.
              </p>
            </div>

            <div className="bg-zinc-800 py-12 px-10 rounded-lg shadow-lg text-center transform hover:scale-102 transition-transform duration-500">
              <Calendar className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-300 ">
                See your journaling habits over time.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
