import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  BookOpen,
  Users,
  FileText,
  ArrowRight,
  Search,
  LogIn,
  UserPlus,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section (Link to Home) */}
            <Link
              to="/"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                <GraduationCap size={26} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 tracking-tight">
                StudySync
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-10 items-center">
              <a
                href="#notes"
                className="text-slate-600 hover:text-purple-600 font-semibold transition-colors"
              >
                Notes Sharing
              </a>
              <a
                href="#skills"
                className="text-slate-600 hover:text-purple-600 font-semibold transition-colors"
              >
                Skill Exchange
              </a>
            </div>

            {/* Auth Buttons with React Router Links */}
            <div className="flex items-center gap-4">
              {/* Login Button */}
              <Button
                asChild
                variant="ghost"
                className="text-purple-700 hover:text-purple-800 hover:bg-purple-100 hidden sm:flex gap-2 font-semibold text-md rounded-xl px-5 h-11"
              >
                <Link to="/login">
                  <LogIn size={20} />
                  Login
                </Link>
              </Button>

              {/* Register Button */}
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white shadow-xl shadow-purple-500/30 gap-2 border-0 rounded-xl px-6 h-11 text-md font-semibold transition-all hover:scale-105"
              >
                <Link to="/registration">
                  <UserPlus size={20} />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Colorful Hero Section with Image */}
      <section className="relative w-full overflow-hidden bg-slate-50 py-16 md:py-24">
        {/* Colorful Background Blobs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
        <div
          className="absolute top-20 -right-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & Buttons */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm text-purple-700 text-sm font-bold tracking-wide uppercase mb-6">
                <Sparkles size={16} className="text-pink-500" />
                Campus Knowledge Exchange Platform
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Learn Together, <br className="hidden lg:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                  Achieve More.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join your campus knowledge exchange platform. Seamlessly share
                organized PDF study notes, request academic help, and trade
                skills with your peers.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-2xl shadow-slate-900/20 h-14 px-8 text-lg rounded-2xl transition-transform hover:-translate-y-1"
                >
                  <Search size={20} /> Browse Notes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 gap-2 h-14 px-8 text-lg rounded-2xl bg-white/50 backdrop-blur-sm transition-transform hover:-translate-y-1"
                >
                  <Users size={20} /> Find Partners
                </Button>
              </div>
            </div>

            {/* Right Column: Project Image */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-pink-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating and sharing notes"
                className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-2xl border-4 border-white transform transition-transform duration-500 hover:scale-[1.02]"
              />
              {/* Floating Badge */}
              <div
                className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    New Notes
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    100+ Uploaded Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colorful Modules Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24" id="features">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            Features That Empower You
          </h2>
          <p className="text-slate-500 mt-4 text-xl">
            Everything you need to collaborate effectively
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Notes Sharing Card */}
          <div
            id="notes"
            className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl shadow-blue-500/30 transform -rotate-6 group-hover:rotate-0 transition-all duration-300">
              <FileText size={40} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Notes Sharing
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Centralized storage for your academic materials. Upload PDF notes,
              add course descriptions, and download resources seamlessly.
            </p>
            <ul className="space-y-4 mb-10 text-slate-700 font-semibold text-lg">
              <li className="flex items-center gap-4">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Secure PDF Upload & Download
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Search & Filter by Course Name
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Rating and Commenting System
              </li>
            </ul>
          </div>

          {/* Skill Exchange Card */}
          <div
            id="skills"
            className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-pink-900/5 border border-pink-50 hover:border-pink-200 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl shadow-pink-500/30 transform rotate-6 group-hover:rotate-0 transition-all duration-300">
              <BookOpen size={40} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Skill Exchange
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Struggling with a topic? Utilize our rule-based matching mechanism
              to find peers who can help, or offer your own expertise.
            </p>
            <ul className="space-y-4 mb-10 text-slate-700 font-semibold text-lg">
              <li className="flex items-center gap-4">
                <span className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Post Skills with Availability
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Submit & Accept Help Requests
              </li>
              <li className="flex items-center gap-4">
                <span className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                  <ArrowRight size={18} />
                </span>{" "}
                Automatic Course Matching Logic
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto py-10 text-center text-slate-500 font-medium border-t border-slate-200 bg-white">
        <p>
          © {new Date().getFullYear()} StudySync - A Cloud-Based Notes Sharing
          and Skill Exchange System, Built by Twin Cloud.
        </p>
      </footer>
    </div>
  );
};

export default Home;
