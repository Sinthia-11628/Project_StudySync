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
      try {
        const res = await fetch(`${API_SERVER}/api/notes`);
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
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

      setNotes((prev) => [result.note, ...prev]);

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

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch gap-6 border-b border-white/50 pb-10">
          <div className="flex-1 rounded-[2.5rem] bg-white/95 border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.08)] p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm mb-6">
              <Award size={16} /> Dashboard Summary
            </div>
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Welcome back, {user ? user.name.split(" ")[0] : "Student"}.
              </h1>
              <p className="text-slate-600 text-lg leading-8">
                Access your study materials, track your skills, and keep your campus workflow organized from one polished dashboard.
              </p>
              <div className="mt-6 text-slate-500 text-sm bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
                <p className="font-semibold text-slate-700">Signed in as</p>
                <p className="mt-2 text-base text-slate-900">
                  {user?.username} • {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                  Notes
                </p>
                <p className="text-3xl font-black text-slate-900">{notes.length}</p>
                <p className="text-slate-500 mt-2 text-sm">Total study files uploaded</p>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                  Skills
                </p>
                <p className="text-3xl font-black text-slate-900">{skills.length}</p>
                <p className="text-slate-500 mt-2 text-sm">Skill entries added</p>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                  Profile
                </p>
                <p className="text-3xl font-black text-slate-900">{user?.username}</p>
                <p className="text-slate-500 mt-2 text-sm">Your current campus identity</p>
              </div>
            </div>
          </div>

          <div className="xl:w-[28rem] rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-slate-900 to-indigo-700 p-8 shadow-2xl text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] font-semibold text-white/80 mb-6">
              Quick actions
            </div>
            <h2 className="text-3xl font-black tracking-tight">Professional growth hub</h2>
            <p className="mt-4 text-slate-200 leading-7">
              Stay on top of your study progress with a clear, modern workspace built for fast uploads, skill sharing, and academic collaboration.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-lg shadow-slate-900/10">
                <p className="text-sm text-slate-200 font-semibold">Next recommended step</p>
                <p className="mt-2 text-lg font-bold">Upload a new note to your course library</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10 shadow-lg shadow-slate-900/10">
                <p className="text-sm text-slate-200 font-semibold">Pro tip</p>
                <p className="mt-2 text-lg font-bold">Keep your profile details up to date for better peer matching</p>
              </div>
            </div>
          </div>
        </div>

          {/* Premium Tab Switcher */}
          <div className="flex p-1.5 bg-white/80 backdrop-blur-sm shadow-2xl shadow-blue-100 rounded-3xl border border-white">
            <button
              onClick={() => setActiveTab("notes")}
              className={
                activeTab === "notes"
                  ? "flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all duration-300 bg-blue-600 text-white shadow-xl shadow-blue-200"
                  : "flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all duration-300 text-slate-400 hover:text-slate-600"
              }
            >
              <BookOpen size={20} /> NOTES
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={
                activeTab === "skills"
                  ? "flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all duration-300 bg-emerald-500 text-white shadow-xl shadow-emerald-200"
                  : "flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all duration-300 text-slate-400 hover:text-slate-600"
              }
            >
              <Zap size={20} /> SKILLS
            </button>
          </div>
        </div>

        {/* --- NOTES AREA --- */}
        {activeTab === "notes" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Search in library..."
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                />
              </div>
              <Button
                onClick={() => setShowNoteUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl px-12 h-auto py-5 text-xl font-black shadow-xl shadow-blue-100 border-none"
              >
                <Plus size={24} className="mr-1" /> New Note
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes
                .filter((n) =>
                  n.title.toLowerCase().includes(noteSearchTerm.toLowerCase()),
                )
                .map((note) => (
                  <Card
                    key={note._id}
                    className="group bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText size={28} />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-400 rounded-full">
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

      {/* --- MODALS --- */}
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
                  {selectedFile ? selectedFile.name : "Select Document"}
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
