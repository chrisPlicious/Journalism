import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage";
import LandinPage from "./pages/LandinPage";
import NewEntryPage from "./pages/NewEntryPage";
import SignupPage from "./pages/AuthPages/SignupPage";
import EntriesPage from "./pages/EntriesPage";
import HomePage from "./pages/Home";
import EditJournal from "./pages/EditJournal";
import SelectAvatar from "./pages/AvatarSelection";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandinPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/avatar"
            element={
              <ProtectedRoutes>
                <SelectAvatar />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoutes>
                <HomePage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/entries"
            element={
              <ProtectedRoutes>
                <EntriesPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/newentry"
            element={
              <ProtectedRoutes>
                <NewEntryPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/editjournal/:id"
            element={
              <ProtectedRoutes>
                <EditJournal />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <ProfilePage />
              </ProtectedRoutes>
            }
          />
          {/*  */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
