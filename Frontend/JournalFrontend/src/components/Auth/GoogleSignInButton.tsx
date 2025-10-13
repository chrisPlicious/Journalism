import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "@/services/api";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function GoogleSignInButton({ text }: { text?: "signin_with" | "continue_with" | "signup_with" } = { text: "signin_with" }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: must have clientId configured
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set.");
      return;
    }

    // Wait for GIS script to load
    const ensureGoogleReady = () => {
      const g = (window as any).google;
      if (!g || !g.accounts || !g.accounts.id) {
        setTimeout(ensureGoogleReady, 100);
        return;
      }

      if (initialized) return;

      try {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            const idToken = response?.credential;
            if (!idToken) return;
            try {
              const data = await googleLogin(idToken);
              // Expected shape: { token, username, email, avatarUrl, isProfileComplete }
              login(data.token, data.username, data.email, data.avatarUrl, data.isProfileComplete);
              navigate("/home");
            } catch (err) {
              console.error("Google login exchange failed:", err);
            }
          },
          ux_mode: "popup",
          // Use browser-mediated FedCM dialog to avoid COOP/popup issues
          use_fedcm_for_button: true,
          use_fedcm_for_prompt: true,
        });

        if (buttonRef.current) {
          g.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            text: text ?? "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: 320,
          });
        }
        setInitialized(true);
      } catch (err) {
        console.error("Failed to initialize Google Identity Services:", err);
      }
    };

    ensureGoogleReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, initialized]);

  return <div ref={buttonRef} />;
}