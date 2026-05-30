import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  BookOpen,
  Zap,
  Search,
  Plus,
  LayoutGrid,
  Award,
  FileText,
  UploadCloud,
  X,
  ArrowRight,
  Star,
  Trash2,
} from "lucide-react";
import { uploadFileInChunks } from "@/lib/uploadChunk";
import { API_SERVER } from "@/config";

// Interfaces
interface Note {
  _id: string;
  title: string;
  subject: string;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  status?: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
  description: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  // States
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [noteSearchTerm, setNoteSearchTerm] = useState("");
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [showNoteUpload, setShowNoteUpload] = useState(false);
  const [showSkillUpload, setShowSkillUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    username: string;
    profilePic?: string;
  } | null>(null);

  // Authentication Check
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    } catch (err) {
      console.error("Failed to parse saved user", err);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch notes on load
  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(`${API_SERVER}/api/notes`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Fetch notes failed: ${res.status} ${res.statusText} - ${txt}`,
          );
        }
        const data = await res.json();
        // backend returns an array of notes
        setNotes(Array.isArray(data) ? data : data.notes || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
      setLoadingNotes(false);
    };
    fetchNotes();
  }, []);

  // Handlers
  const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      const uploadResult = await uploadFileInChunks(selectedFile);

      const res = await fetch(`${API_SERVER}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          subject: formData.get("subject"),
          description: formData.get("description"),
          fileUrl: uploadResult.fileUrl,
          fileName: uploadResult.fileName,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Note save failed: ${res.status} ${res.statusText} - ${text}`,
        );
      }

      const result = await res.json();

      // backend creates and returns the created note object
      const createdNote = result && result._id ? result : result.note || result;
      setNotes((prev) => [createdNote, ...prev]);

      setShowNoteUpload(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Upload failed: ${message}`);
    }
  };

  const handleAddSkill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      level: formData.get("level") as string,
      description: formData.get("description") as string,
    };

    setSkills((prev) => [...prev, newSkill]);
    setShowSkillUpload(false);
  };

  // Persist skills to localStorage and load on mount
  useEffect(() => {
    const saved = localStorage.getItem("skills");
    if (saved) {
      try {
        setSkills(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved skills", e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("skills", JSON.stringify(skills));
    } catch (e) {
      console.error("Failed to persist skills", e);
    }
  }, [skills]);

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const res = await fetch(`${API_SERVER}/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] relative overflow-hidden font-sans">
      {/* Background Subtle Gradients */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-emerald-500/10 rounded-full blur-[100px] -z-0" />

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10 space-y-8">
        {/* Header Section */}
        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr] items-start">
          <div className="rounded-[2rem] bg-white/95 border border-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.08)] p-8 md:p-10 backdrop-blur-xl">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
                  Welcome back, {user ? user.name.split(" ")[0] : "Student"}!
                </h1>
                <p className="text-slate-500 text-sm md:text-base">
                  {user?.email}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[2rem] bg-slate-50 p-5 shadow-sm border border-slate-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                      <BookOpen size={20} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
                      notes
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {notes.length}
                    </p>
                  </div>
                  <div className="rounded-[2rem] bg-orange-50 p-5 shadow-sm border border-orange-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mb-4">
                      <Zap size={20} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-2">
                      skills
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {skills.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-slate-50 p-4 shadow-sm border border-slate-100 w-full sm:w-auto">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-4">
                    Profile Complete
                  </p>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="14"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="url(#profileGradient)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray="326"
                        strokeDashoffset="96"
                        transform="rotate(-90 60 60)"
                      />
                      <defs>
                        <linearGradient
                          id="profileGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                        mm
                      </span>
                      <span className="text-xl font-black text-slate-900">
                        {user ? user.username?.slice(0, 2).toUpperCase() : "MM"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/95 border border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-4 flex items-center justify-center">
            <div className="flex gap-2 bg-slate-100 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("notes")}
                className={
                  activeTab === "notes"
                    ? "flex items-center gap-2 px-8 py-4 rounded-full font-black transition-all duration-300 bg-blue-600 text-white shadow-md"
                    : "flex items-center gap-2 px-8 py-4 rounded-full font-black transition-all duration-300 text-slate-500 hover:text-slate-700"
                }
              >
                <BookOpen size={18} /> NOTES
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={
                  activeTab === "skills"
                    ? "flex items-center gap-2 px-8 py-4 rounded-full font-black transition-all duration-300 bg-white text-slate-900 shadow-md"
                    : "flex items-center gap-2 px-8 py-4 rounded-full font-black transition-all duration-300 text-slate-500 hover:text-slate-700"
                }
              >
                <Zap size={18} /> SKILLS
              </button>
            </div>
          </div>
        </div>

        {/* --- NOTES AREA --- */}
        {activeTab === "notes" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Search in library..."
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 shadow-lg shadow-slate-200/40 rounded-full focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                />
              </div>
              <Button
                onClick={() => setShowNoteUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-16 text-xl font-black shadow-xl shadow-blue-100 border-none"
              >
                <Plus size={24} className="mr-2" /> New Note
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingNotes && (
                <div className="col-span-full text-center py-8 text-slate-500 font-medium">
                  Loading notes...
                </div>
              )}
              {notes
                .filter((n) =>
                  n.title.toLowerCase().includes(noteSearchTerm.toLowerCase()),
                )
                .map((note) => (
                  <Card
                    key={note._id}
                    className="group border-none bg-gradient-to-br from-indigo-50 via-pink-50 to-emerald-50 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] p-8 hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="p-4 bg-white/60 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                          <FileText size={28} />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/70 text-slate-700 rounded-full border border-white/30">
                            {note.subject}
                          </span>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete note"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {note.description}
                      </p>
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-400">
                            {new Date(note.uploadedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded w-fit">
                            {note.status || "saved"}
                          </span>
                        </div>
                        <a
                          href={note.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-black flex items-center gap-1 group-hover:gap-3 transition-all hover:text-blue-700 cursor-pointer"
                        >
                          OPEN FILE <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              {notes.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/50 border-4 border-dashed border-white rounded-[3rem]">
                  <LayoutGrid
                    size={60}
                    className="mx-auto text-slate-200 mb-4"
                  />
                  <p className="text-slate-400 font-bold text-xl">
                    Your library is currently empty.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SKILLS AREA --- */}
        {activeTab === "skills" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Find specialized skill..."
                  onChange={(e) => setSkillSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white border-none shadow-xl shadow-emerald-100/50 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                />
              </div>
              <Button
                onClick={() => setShowSkillUpload(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl px-12 py-5 text-xl font-black shadow-xl shadow-emerald-200"
              >
                <Plus size={24} className="mr-1" /> Add Skill
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills
                .filter((s) =>
                  s.name.toLowerCase().includes(skillSearchTerm.toLowerCase()),
                )
                .map((skill) => (
                  <Card
                    key={skill.id}
                    className="bg-white border-none shadow-2xl rounded-[2rem] p-8 border-b-8 border-emerald-500 hover:scale-[1.03] transition-all"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <Award size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                      {skill.name}
                    </h4>
                    <div className="mt-3 inline-block px-4 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md shadow-emerald-100">
                      {skill.level}
                    </div>
                    <p className="text-slate-500 mt-6 font-medium text-sm leading-relaxed">
                      {skill.description}
                    </p>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      {showNoteUpload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <Card className="bg-white rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border-none animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                Post Note
              </h3>
              <button
                onClick={() => setShowNoteUpload(false)}
                className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="space-y-6">
              <input
                name="title"
                placeholder="Title of the note"
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
              />
              <input
                name="subject"
                placeholder="Course / Subject"
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
              />
              <textarea
                name="description"
                placeholder="Short summary..."
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none h-32 font-medium"
              />
              <div className="border-4 border-dashed border-blue-50 rounded-[2rem] p-10 text-center hover:bg-blue-50/50 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    e.target.files && setSelectedFile(e.target.files[0])
                  }
                />
                <UploadCloud
                  size={40}
                  className="mx-auto text-blue-300 group-hover:text-blue-500 transition-colors mb-2"
                />
                <p className="text-slate-500 font-black">
                  {selectedFile?.name ?? "Select Document"}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 text-xl font-black shadow-xl shadow-blue-100"
              >
                Upload Now
              </Button>
            </form>
          </Card>
        </div>
      )}

      {showSkillUpload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <Card className="bg-white rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border-none animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                <Star size={32} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                Add Skill
              </h3>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-6">
              <input
                name="name"
                placeholder="Skill Name"
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
              />
              <select
                name="level"
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg appearance-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <textarea
                name="description"
                placeholder="Quick overview of your expertise..."
                required
                className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none h-32 font-medium"
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-8 text-xl font-black shadow-xl shadow-emerald-100"
                >
                  Save Skill
                </Button>
                <button
                  type="button"
                  onClick={() => setShowSkillUpload(false)}
                  className="flex-1 bg-slate-100 text-slate-400 rounded-2xl font-black py-8"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
