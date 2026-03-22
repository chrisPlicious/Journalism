import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Field validation
    const errors = {
      firstName: formData.firstName.trim() ? "" : "First name is required",
      lastName: formData.lastName.trim() ? "" : "Last name is required",
      gender: formData.gender ? "" : "Gender is required",
      dateOfBirth: formData.dateOfBirth ? "" : "Date of birth is required",
      email: formData.email.trim()
        ? formData.email.includes("@")
          ? ""
          : "Invalid email"
        : "Email is required",
      username: formData.username.trim()
        ? formData.username.length >= 3
          ? ""
          : "Username must be at least 3 characters"
        : "Username is required",
      password: /^(?=.*\d)(?=.*[^a-zA-Z0-9])(.{8,})$/.test(formData.password)
        ? ""
        : "Password must be at least 8 characters long and contain at least one number and one non-alphanumeric character",
      confirmPassword: formData.confirmPassword
        ? formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match"
        : "Confirm password is required",
    };

    setFieldErrors(errors);

    // Check if any errors exist
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Gender: formData.gender,
          DateOfBirth: formData.dateOfBirth,
          Email: formData.email,
          Username: formData.username,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.username, data.email, data.avatarUrl, data.isProfileComplete);
        navigate("/avatar");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full bg-[var(--input)] border rounded-[10px] py-2.5 px-3.5 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] outline-none transition-colors ${
      hasError ? "border-[var(--destructive)]" : "border-[var(--border)]"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[#F0F5F1] dark:from-[#0F1A14] dark:to-[#0A120D]">
      {/* Subtle sage radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,152,133,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(124,152,133,0.04),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-[480px] w-full mx-auto bg-[var(--background)] border border-[var(--border)] rounded-[20px] shadow-lg p-8 my-8">
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
          Create your journal
        </h1>

        {/* Description */}
        <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
          Sign up to start capturing your thoughts
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClasses(!!fieldErrors.firstName)}
                required
                disabled={loading}
              />
              {fieldErrors.firstName && (
                <p className="text-sm text-[var(--destructive)]">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClasses(!!fieldErrors.lastName)}
                required
                disabled={loading}
              />
              {fieldErrors.lastName && (
                <p className="text-sm text-[var(--destructive)]">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Gender + Date of Birth */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="gender"
                className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClasses(!!fieldErrors.gender)}
                required
                disabled={loading}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.gender && (
                <p className="text-sm text-[var(--destructive)]">
                  {fieldErrors.gender}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dateOfBirth"
                className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={inputClasses(!!fieldErrors.dateOfBirth)}
                required
                disabled={loading}
              />
              {fieldErrors.dateOfBirth && (
                <p className="text-sm text-[var(--destructive)]">
                  {fieldErrors.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses(!!fieldErrors.email)}
              required
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-sm text-[var(--destructive)]">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={inputClasses(!!fieldErrors.username)}
              required
              disabled={loading}
            />
            {fieldErrors.username && (
              <p className="text-sm text-[var(--destructive)]">
                {fieldErrors.username}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses(!!fieldErrors.password)}
              required
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="text-sm text-[var(--destructive)]">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClasses(!!fieldErrors.confirmPassword)}
              required
              disabled={loading}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-[var(--destructive)]">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* General error banner */}
          {error && (
            <div className="bg-destructive/10 border-l-4 border-[var(--destructive)] rounded-r-lg p-3">
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white hover:bg-[var(--sage-500)] rounded-[10px] py-2.5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
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
          <GoogleSignInButton text="signup_with" />
        </div>

        {/* Switch link */}
        <p className="text-sm text-center mt-4 text-[var(--foreground)]">
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
