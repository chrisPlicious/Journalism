import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-12 min-h-screen text-white
  bg-[radial-gradient(ellipse_at_top,_#374151,_#0f172a,_#000000)]"
    >
      <h1 className="scroll-m-20 text-center text-7xl font-extrabold tracking-tight text-balance">
        Welcome to MindNest
      </h1>
      <Link to="/login">
        <Button className="text-2xl font-bold h-full px-8">
          Start Making Journal
        </Button>
      </Link>
    </div>
  );
}
