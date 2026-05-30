import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../../api/api.ts";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const res = await API.post("/auth/login", payload);

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Animated Background Blobs (Matches Home Page Theme) */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div
        className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="text-slate-500 hover:text-purple-600 flex items-center gap-2 font-medium transition-colors"
        >
          <ArrowRight size={18} className="rotate-180" /> Back to Home
        </Link>
      </div>

      {/* Login Card Container */}
      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl shadow-purple-900/10 rounded-3xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white p-3 rounded-2xl shadow-lg">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back to StudySync
          </CardTitle>
          <CardDescription className="text-md text-slate-500">
            Enter your credentials to access your personalized study dashboard
            and connect with fellow students.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Form Begins */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">
                User name or Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="write your email or username"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-purple-500 bg-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-semibold"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-purple-500 bg-white"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Alternate Logins (Google & Facebook) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                ></path>
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                ></path>
              </svg>
              Google
            </Button>

            {/* Facebook Button */}
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="#1877F2"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-100 pt-6 pb-6">
          <p className="text-slate-600 text-sm font-medium">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="text-purple-600 hover:text-purple-700 font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
