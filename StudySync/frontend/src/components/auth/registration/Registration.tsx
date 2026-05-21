import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import API from "@/api/api";

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // Map frontend field names to backend field names
    const registrationData = new FormData();
    registrationData.append("name", formData.get("fullName")?.toString() || "");
    registrationData.append("username", formData.get("userName")?.toString() || "");
    registrationData.append("varsity", formData.get("university")?.toString() || "");
    registrationData.append("varsityId", formData.get("studentId")?.toString() || "");
    registrationData.append("dept", formData.get("department")?.toString() || "");
    registrationData.append("batch", formData.get("batch")?.toString() || "");
    registrationData.append("email", formData.get("email")?.toString() || "");
    registrationData.append("phone", formData.get("phone")?.toString() || "");
    registrationData.append("password", formData.get("password")?.toString() || "");

    const profilePic = formData.get("profilePic") as File;
    if (profilePic && profilePic.size > 0) {
      registrationData.append("pic", profilePic);
    }

    try {
      await API.post("/auth/register", registrationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration successful! Please login.");
      // Redirect to login page
      window.location.href = "/login";
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f1f5f9] flex items-center justify-center p-6 lg:p-12 font-sans overflow-hidden">
      <div className="w-full max-w-[1500px] flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-20">
        <div className="w-full xl:w-[40%] flex justify-center">
          <img
            src="/images/Registration.png"
            alt="StudySync Registration"
            className="w-full max-w-[450px] xl:max-w-[500px] h-auto object-contain rounded-[2rem] shadow-sm"
          />
        </div>

        <div className="w-full xl:w-[50%] flex justify-center xl:justify-end">
          <Card className="w-full max-w-[850px] bg-white rounded-[2rem] shadow-xl border-none p-8 lg:p-12">
            <div className="flex flex-col items-center mb-8">
              <img
                src="/images/Logo.png"
                alt="Logo"
                className="w-20 h-20 object-contain mb-3"
              />
              <h2 className="text-[30px] font-bold text-slate-800">
                Join StudySync
              </h2>
              <p className="text-[15px] text-slate-500 font-medium mt-1 text-center">
                Create an account to start sharing notes and skills
              </p>
            </div>

            <CardContent className="p-0">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="userName"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      User Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      placeholder="Choose a username"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="university"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      University <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="university"
                      name="university"
                      placeholder="Enter your university name"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="studentId"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Student ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      placeholder="Enter your student ID"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="department"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g. Computer Science"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="batch"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Batch <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="batch"
                      name="batch"
                      placeholder="e.g. 2024"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="profilePic"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Profile Picture <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="profilePic"
                      name="profilePic"
                      type="file"
                      required
                      className="h-[46px] px-3 py-[9px] text-slate-500 file:text-[14px] file:font-semibold file:text-slate-700 file:bg-slate-100 file:border-0 file:mr-3 file:-ml-1 file:px-4 file:py-1 file:px-4 file:py-1 file:rounded-md border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-[14px] text-slate-700 font-semibold"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-[46px] border-slate-300 focus-visible:ring-indigo-500 rounded-xl text-[14px] placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-10 h-[50px] bg-gradient-to-r from-[#4f6bff] to-[#d43dff] hover:opacity-90 text-white font-bold rounded-xl text-[16px] border-0 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[15px] text-slate-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#4f6bff] hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
