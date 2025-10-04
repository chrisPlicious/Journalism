import { Routes, Route, BrowserRouter } from "react-router-dom";

import LoginPage from "./pages/AuthPages/LoginPage"
import LandinPage from "./pages/LandinPage"
import NewEntryPage from "./pages/NewEntryPage"
import SignupPage from "./pages/AuthPages/SignupPage"
import EntriesPage from "./pages/EntriesPage"
import HomePage from "./pages/Home"
import EditJournal from "./pages/EditJournal"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandinPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/entries" element={<EntriesPage />} />
        <Route path="/newentry" element={<NewEntryPage />} />
        <Route path="/editjournal" element={<EditJournal />} />
      </Routes>
    </BrowserRouter>
    
  );
}
export default App;