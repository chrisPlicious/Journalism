import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn/ui Select is available

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
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
        // Adjust backend URL
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
        // On success, navigate to login or auto-login if token is returned
        login(data.token, data.username, data.email, data.avatarUrl, data.isProfileComplete);
        navigate("/avatar"); // Or use login(data.token) if backend returns token on register
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md scale-125">
        {" "}
        {/* Increased width for more fields */}
        <div className="flex justify-center mb-2">
          <img
            src="/MindNestLogoDark.png"
            alt="MindNest Logo"
            className="h-20 w-auto"
          />
        </div>
        <CardHeader>
          <CardTitle>Sign up now</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
          {/* <CardAction>
            
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={fieldErrors.firstName ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.firstName && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={fieldErrors.lastName ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger
                      className={fieldErrors.gender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.gender && (
                    <p className="text-red-500 text-sm">{fieldErrors.gender}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={fieldErrors.dateOfBirth ? "border-red-500" : ""}
                    required
                  />
                  {fieldErrors.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldErrors.email ? "border-red-500" : ""}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={fieldErrors.username ? "border-red-500" : ""}
                  required
                />
                {fieldErrors.username && (
                  <p className="text-red-500 text-sm">{fieldErrors.username}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={fieldErrors.password ? "border-red-500" : ""}
                  required
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm">{fieldErrors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={
                    fieldErrors.confirmPassword ? "border-red-500" : ""
                  }
                  required
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <div className="w-full flex items-center mt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-2 text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="w-full flex justify-center mt-2">
            <GoogleSignInButton text="signup_with" />
          </div>

          <Button variant="link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
