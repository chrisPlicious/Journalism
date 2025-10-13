import GoogleSignInButton from "@/components/Auth/GoogleSignInButton";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // utility for conditional classes
// import { getProfile } from "../../services/api";

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
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.username, data.email, data.avatarUrl, data.isProfileComplete);
        navigate("/home");
      } else if (response.status === 401) {
        // Wrong credentials
        setErrors((prev) => ({
          ...prev,
          general: "Username or password is incorrect",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: data.message || "Login failed. Try again.",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "Network error. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm scale-150">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <img
              src="/MindNestLogoDark.png"
              alt="MindNest Logo"
              className="h-20 w-auto"
            />
          </div>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email / Username */}
              <div className="grid gap-2">
                <Label htmlFor="loginIdentifier">Email or Username</Label>
                <Input
                  id="loginIdentifier"
                  value={formData.loginIdentifier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loginIdentifier: e.target.value,
                    })
                  }
                  className={cn(
                    errors.loginIdentifier
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  )}
                  required
                  disabled={loading}
                />
                {errors.loginIdentifier && (
                  <p className="text-red-500 text-sm">
                    {errors.loginIdentifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={cn(
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  )}
                  required
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* General error (wrong credentials, server issues, etc.) */}
              {errors.general && (
                <p className="text-red-500">{errors.general}</p>
              )}
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
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="w-full flex items-center mt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-2 text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="w-full flex justify-center mt-2">
            <GoogleSignInButton />
          </div>

          <Button variant="link">
            <Link to="/signup">No account? Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
