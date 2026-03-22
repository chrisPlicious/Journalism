import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    loginIdentifier: "",
    password: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = { loginIdentifier: "", password: "", general: "" };

    if (!formData.loginIdentifier.trim()) {
      newErrors.loginIdentifier = "Email or username is required";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ loginIdentifier: "", password: "", general: "" });

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data.token, data.username, data.email, data.avatarUrl, data.isProfileComplete);
      navigate("/home");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          general: "Username or password is incorrect",
        }));
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrors((prev) => ({
          ...prev,
          general: err.response!.data.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Network error. Please try again later.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[#F0F5F1] dark:from-[#0F1A14] dark:to-[#0A120D]">
      {/* Subtle sage radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,152,133,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(124,152,133,0.04),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[440px] w-full mx-auto bg-[var(--background)] border border-[var(--border)] rounded-[20px] shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/MindNestLogoLight.png"
            alt="MindNest Logo"
            className="h-12 w-auto dark:hidden"
          />
          <img
            src="/MindNestLogoDark.png"
            alt="MindNest Logo"
            className="h-12 w-auto hidden dark:block"
          />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-2xl font-semibold text-center text-[var(--foreground)]">
          Welcome back
        </h1>

        {/* Description */}
        <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
          Sign in to continue your journal
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="loginIdentifier"
              className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
            >
              Email or Username
            </label>
            <input
              id="loginIdentifier"
              type="text"
              value={formData.loginIdentifier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  loginIdentifier: e.target.value,
                })
              }
              className={`w-full bg-[var(--input)] border rounded-[10px] py-2.5 px-3.5 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] outline-none transition-colors ${
                errors.loginIdentifier
                  ? "border-[var(--destructive)]"
                  : "border-[var(--border)]"
              }`}
              required
              disabled={loading}
            />
            {errors.loginIdentifier && (
              <p className="text-sm text-[var(--destructive)]">
                {errors.loginIdentifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full bg-[var(--input)] border rounded-[10px] py-2.5 px-3.5 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] outline-none transition-colors ${
                errors.password
                  ? "border-[var(--destructive)]"
                  : "border-[var(--border)]"
              }`}
              required
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-[var(--destructive)]">
                {errors.password}
              </p>
            )}
          </div>

          {/* General error banner */}
          {errors.general && (
            <div className="bg-destructive/10 border-l-4 border-[var(--destructive)] rounded-r-lg p-3">
              <p className="text-sm text-[var(--destructive)]">
                {errors.general}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white hover:bg-[var(--sage-500)] rounded-[10px] py-2.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">
              or
            </span>
          </div>
        </div>

        {/* Google OAuth */}
        <div className="w-full flex justify-center">
          <GoogleSignInButton />
        </div>

        {/* Switch link */}
        <p className="text-sm text-center mt-4 text-[var(--foreground)]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
