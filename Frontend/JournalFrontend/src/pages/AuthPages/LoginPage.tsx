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
import { cn } from "@/lib/utils"; // assuming you have a cn helper for conditional classes

export default function LoginPage() {
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    loginIdentifier: false,
    password: false,
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    if (!formData.loginIdentifier.trim()) {
      valid = false;
    }
    if (!formData.password.trim()) {
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ loginIdentifier: true, password: true });
    setError("");

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

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
        login(data.token, data.username, data.email);
        navigate("/home");
      } else if (response.status === 401) {
        // Generic message for wrong credentials
        setError("Username or password is incorrect");
      } else {
        // Any other error
        setError(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm scale-120">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, loginIdentifier: true }))
                  }
                  className={cn(
                    touched.loginIdentifier && !formData.loginIdentifier.trim()
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  )}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
                  className={cn(
                    touched.password && !formData.password.trim()
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  )}
                  required
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
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
          <Button variant="link">
            <Link to="/signup">No account? Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
