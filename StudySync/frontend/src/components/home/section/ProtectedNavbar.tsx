import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";

// shadcn UI imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

import { getImageUrl } from "../../../lib/imageUtils";

interface User {
  name: string;
  email: string;
  profilePic?: string;
}

const ProtectedNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-2xl border-b-2 border-indigo-100/50 shadow-lg sticky top-0 z-50">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">
          {" "}
          {/* Height ektu barano hoyeche */}
          {/* Logo Section */}
          <Link
            to="/dashboard"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-2.5 rounded-2xl shadow-indigo-200 shadow-lg group-hover:rotate-6 transition-all duration-300">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 tracking-tighter">
              StudySync
            </span>
          </Link>
          {/* User Profile Section */}
          <div className="flex items-center gap-6">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none group">
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 transition-transform group-hover:scale-110 active:scale-95 shadow-md">
                    <Avatar className="h-12 w-12 border-2 border-white cursor-pointer shadow-inner">
                      <AvatarImage
                        src={
                          user.profilePic
                            ? getImageUrl(user.profilePic)
                            : undefined
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white text-indigo-600 font-bold">
                        <UserIcon size={22} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-4 rounded-3xl border-indigo-50 shadow-2xl p-3 font-sans animate-in fade-in zoom-in duration-200"
                >
                  <DropdownMenuLabel className="p-3">
                    <p className="font-bold text-slate-900 text-lg leading-tight">
                      {user.name}
                    </p>
                    <p className="text-sm font-medium text-slate-500 truncate">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-100 my-2" />

                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:bg-indigo-50 text-slate-700 rounded-2xl p-3 flex gap-3 items-center transition-colors font-semibold"
                  >
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <Settings size={18} />
                    </div>
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-red-50 text-red-600 rounded-2xl p-3 flex gap-3 items-center transition-colors font-semibold mt-1"
                  >
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                      <LogOut size={18} />
                    </div>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProtectedNavbar;
