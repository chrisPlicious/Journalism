import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, var(--background), #F0F5F1)",
      }}
    >
      {/* Light mode background layers */}
      <div
        className="absolute inset-0 dark:hidden pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124, 152, 133, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Dark mode background */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #0F1A14, #0A120D)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124, 152, 133, 0.10) 0%, transparent 70%)",
        }}
      />

      {/* Subtle animated sage orb */}
      <div
        className="absolute pointer-events-none opacity-[0.05] rounded-full blur-3xl"
        style={{
          width: "36rem",
          height: "36rem",
          background: "rgba(124, 152, 133, 0.6)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "drift 20s ease-in-out infinite alternate",
        }}
      />

      {/* Keyframes for the drifting orb */}
      <style>{`
        @keyframes drift {
          0% { transform: translateX(-50%) translateY(0); }
          100% { transform: translateX(-45%) translateY(30px); }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        {/* Logo */}
        <img
          src="/MindNestLogoDark.png"
          alt="MindNest"
          className="h-16 md:h-20 dark:hidden"
        />
        <img
          src="/MindNestLogoLight.png"
          alt="MindNest"
          className="h-16 md:h-20 hidden dark:block"
        />

        {/* Heading */}
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-balance mt-4"
          style={{ color: "var(--foreground)" }}
        >
          Your thoughts deserve a beautiful home.
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg max-w-md mx-auto text-center mt-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          A calm, private space to journal your days, reflect on your journey,
          and grow.
        </p>

        {/* CTA Button */}
        <Link
          to="/signup"
          className="mt-8 inline-block bg-[var(--primary)] text-white hover:bg-[var(--sage-500)] rounded-[10px] py-3 px-8 text-base font-semibold transition-all active:scale-[0.98]"
        >
          Start Journaling
        </Link>

        {/* Login link */}
        <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--primary)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
