import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getImageUrl } from "../../lib/imageUtils";
import API from "../../api/api";
import {
  Camera,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  BookOpen,
  Shield,
  Bell,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

interface User {
  _id?: string;
  name: string;
  username: string;
  varsity: string;
  dept: string;
  batch: string;
  varsityId: string;
  email: string;
  phone: string;
  profilePic?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    varsity: "",
    varsityId: "",
    dept: "",
    batch: "",
    email: "",
    phone: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setFormData({
        name: parsedUser.name || "",
        username: parsedUser.username || "",
        varsity: parsedUser.varsity || "",
        varsityId: parsedUser.varsityId || "",
        dept: parsedUser.dept || "",
        batch: parsedUser.batch || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
      });
      if (parsedUser.profilePic) {
        setPreviewImage(getImageUrl(parsedUser.profilePic) ?? null);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updateData.append(key, value);
    });

    if (selectedFile) {
      updateData.append("pic", selectedFile);
    }

    try {
      const res = await API.put("/user/update", updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      }
    } catch (err: any) {
      console.error("Update error:", err);
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    // অতিরিক্ত py-10 সরিয়ে pt-4 (টপ প্যাডিং) ও pb-12 দেওয়া হয়েছে, ব্যাকগ্রাউন্ড একটু প্রিমিয়াম করা হয়েছে
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] pt-4 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* --- Left Sidebar --- */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {/* Header section in sidebar */}
          <div className="mt-2 lg:mt-4">
            <h2 className="text-[28px] font-extrabold text-slate-800 tracking-tight">
              Settings
            </h2>
            <p className="text-[15px] text-slate-500 mt-1">
              Manage your account.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-[15px] ${
                activeTab === "profile"
                  ? "bg-white text-[#4f6bff] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.08)] border border-slate-100/60"
                  : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 border border-transparent"
              }`}
            >
              <UserIcon
                size={18}
                strokeWidth={activeTab === "profile" ? 2.5 : 2}
              />{" "}
              Public Profile
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-[15px] ${
                activeTab === "academic"
                  ? "bg-white text-[#4f6bff] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.08)] border border-slate-100/60"
                  : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 border border-transparent"
              }`}
            >
              <BookOpen
                size={18}
                strokeWidth={activeTab === "academic" ? 2.5 : 2}
              />{" "}
              Academic Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-[15px] ${
                activeTab === "security"
                  ? "bg-white text-[#4f6bff] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.08)] border border-slate-100/60"
                  : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 border border-transparent"
              }`}
            >
              <Shield
                size={18}
                strokeWidth={activeTab === "security" ? 2.5 : 2}
              />{" "}
              Password & Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-[15px] ${
                activeTab === "notifications"
                  ? "bg-white text-[#4f6bff] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.08)] border border-slate-100/60"
                  : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 border border-transparent"
              }`}
            >
              <Bell
                size={18}
                strokeWidth={activeTab === "notifications" ? 2.5 : 2}
              />{" "}
              Notifications
            </button>
          </div>

          {/* Premium Info Box */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 border border-blue-100/60 p-5 rounded-2xl">
            <div className="bg-white p-2 rounded-xl inline-block mb-3 shadow-sm border border-slate-50">
              <LayoutDashboard size={20} className="text-[#4f6bff]" />
            </div>
            <h4 className="font-bold text-slate-800 text-[15px]">
              StudySync Pro
            </h4>
            <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
              Keep your profile updated to seamlessly connect and sync with your
              peers.
            </p>
          </div>
        </aside>

        {/* --- Right Main Content --- */}
        <main className="flex-1 lg:mt-4">
          <div className="mb-6">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 border-slate-200 hover:border-slate-300 rounded-xl transition-all"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </div>
          <Card className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <CardHeader className="border-b border-slate-100/80 pb-6 px-6 sm:px-10 pt-8">
              <CardTitle className="text-[22px] font-bold text-slate-800">
                {activeTab === "profile" && "Public Profile"}
                {activeTab === "academic" && "Academic Details"}
                {activeTab === "security" && "Password & Security"}
                {activeTab === "notifications" && "Notifications"}
              </CardTitle>
              <CardDescription className="text-[15px] text-slate-500 mt-1.5">
                Update your personal information and how others see you on the
                platform.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-10">
              {message.text && (
                <div
                  className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-medium text-[15px] transition-all ${
                    message.type === "success"
                      ? "bg-[#f0fdf4] text-green-700 border border-green-200"
                      : "bg-[#fef2f2] text-red-700 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : null}
                  {message.text}
                </div>
              )}

              {activeTab === "profile" || activeTab === "academic" ? (
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex-shrink-0">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserIcon className="w-10 h-10 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profileImage"
                        className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-slate-800">
                        Profile Picture
                      </h3>
                      <p className="text-[14px] text-slate-500 mb-3 mt-1">
                        PNG or JPG, max 5MB.
                      </p>
                      <label
                        htmlFor="profileImage"
                        className="inline-block px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-[14px] font-semibold rounded-xl cursor-pointer transition-all shadow-sm"
                      >
                        Change Photo
                      </label>
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-100/80"></div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                    {/* Dynamic Label styling based on active tab */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 pt-2">
                      <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <BookOpen size={16} className="text-[#d43dff]" />{" "}
                        Academic Detail
                      </h3>
                      <div className="h-px w-full bg-slate-100/80 mb-4"></div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="varsity"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        University
                      </Label>
                      <Input
                        id="varsity"
                        name="varsity"
                        value={formData.varsity}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="varsityId"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Student ID
                      </Label>
                      <Input
                        id="varsityId"
                        name="varsityId"
                        value={formData.varsityId}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="dept"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Department
                      </Label>
                      <Input
                        id="dept"
                        name="dept"
                        value={formData.dept}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="batch"
                        className="text-[14px] text-slate-700 font-semibold"
                      >
                        Batch
                      </Label>
                      <Input
                        id="batch"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        required
                        className="h-[46px] border-slate-200 focus-visible:ring-[#4f6bff] rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white transition-colors text-[15px] px-4 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-4 flex justify-end border-t border-slate-100/80">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 h-[48px] bg-gradient-to-r from-[#4f6bff] to-[#4f6bff]/90 hover:from-[#3f57db] hover:to-[#3f57db] text-white font-bold rounded-xl text-[15px] transition-all shadow-[0_4px_14px_0_rgba(79,107,255,0.25)] disabled:opacity-70 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Shield
                    size={56}
                    className="mb-5 opacity-40 text-slate-300"
                    strokeWidth={1.5}
                  />
                  <p className="text-[16px] font-medium text-slate-500">
                    This section is currently under development.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
