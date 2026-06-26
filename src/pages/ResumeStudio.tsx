import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Upload, 
  Eye, 
  FileText, 
  BarChart3, 
  Download, 
  Plus, 
  Trash2, 
  Loader2, 
  Check, 
  Globe, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Interface for resume data
interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: Array<{ school: string; degree: string; year: string }>;
  experience: Array<{ company: string; role: string; duration: string; description: string }>;
  skills: string[];
}

const TEMPLATE_SAMPLES: Record<string, ResumeData> = {
  "Modern Professional": {
    fullName: "Chinedu Okafor",
    email: "chinedu.okafor@gmail.com",
    phone: "+234 803 123 4567",
    location: "Lagos, Nigeria",
    summary: "Dedicated Business Analyst with 2+ years of experience in market research, financial modeling, and strategic planning. Proven track record of helping startups optimize operations and scale growth.",
    education: [{ school: "University of Lagos", degree: "B.Sc. Business Administration", year: "2020 - 2024" }],
    experience: [
      { company: "Lagos Ventures", role: "Junior Analyst", duration: "Jun 2023 - Present", description: "Conducted market analysis for 12 early-stage startups, increasing funding success rates by 15%. Formulated growth strategies using Excel and Tableau." }
    ],
    skills: ["Market Research", "Financial Modeling", "Excel", "Data Analysis", "Strategy"],
  },
  "Creative Designer": {
    fullName: "Amina Mensah",
    email: "amina.design@outlook.com",
    phone: "+233 24 123 4567",
    location: "Accra, Ghana",
    summary: "Visual Designer passionate about branding, user interface design, and storytelling. Creating memorable digital experiences with a modern African aesthetic.",
    education: [{ school: "Ashesi University", degree: "B.A. Management Information Systems", year: "2021 - 2025" }],
    experience: [
      { company: "Accra Creative Agency", role: "Design Intern", duration: "May 2023 - Oct 2023", description: "Designed brand assets and UI/UX screens for 5 major regional client campaigns. Collaborated with marketing team to boost engagement by 40%." }
    ],
    skills: ["Figma", "Branding", "UI/UX Design", "Photoshop", "Illustrator", "African Art"],
  },
  "Tech Developer": {
    fullName: "Elijah Kiprop",
    email: "elijah.kiprop@tech.io",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    summary: "Full Stack Developer proficient in React, Node.js, and Supabase. Excited about building high-performance web applications that solve real-world problems in fintech and education.",
    education: [{ school: "Jomo Kenyatta University", degree: "B.Sc. Computer Science", year: "2019 - 2023" }],
    experience: [
      { company: "Nairobi Tech Lab", role: "Full Stack Intern", duration: "Jan 2023 - Jul 2023", description: "Built and deployed RESTful APIs using Node/Express. Improved database query speed by 25% using index optimization in PostgreSQL." }
    ],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Git"],
  },
  "Clean Minimal": {
    fullName: "Zola Ndlovu",
    email: "zola.ndlovu@gmail.com",
    phone: "+27 82 123 4567",
    location: "Cape Town, South Africa",
    summary: "Content Writer and Communications specialist. Delivering clear, engaging, and search-optimized copy for digital platforms and tech brands.",
    education: [{ school: "University of Cape Town", degree: "B.A. English & Media Studies", year: "2020 - 2023" }],
    experience: [
      { company: "Cape Tech Hub", role: "Communications Writer", duration: "Feb 2023 - Present", description: "Wrote newsletter copy and blog articles driving 25K+ monthly views. Managed social copy for corporate announcements." }
    ],
    skills: ["Content Writing", "SEO", "Copywriting", "Communications", "Editing"],
  }
};

const ResumeStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingResume, setSavingResume] = useState(false);
  const [selectedTemplateStyle, setSelectedTemplateStyle] = useState<string>("Modern Professional");
  
  // Dialog state for template preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string>("");
  
  // Dialog state for builder preview
  const [isBuilderPreviewOpen, setIsBuilderPreviewOpen] = useState(false);

  // Resume Builder State
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: [{ school: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    skills: [""],
  });

  const [analytics, setAnalytics] = useState({
    views: 0,
    avgViewTime: "0m",
    topViewers: "None yet",
  });

  // Load profile data from Supabase on mount
  useEffect(() => {
    if (user) {
      loadProfileAndResume();
      loadResumeAnalytics();
    } else {
      setLoadingProfile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfileAndResume = async () => {
    try {
      setLoadingProfile(true);
      
      // 1. Fetch Profile info
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();

      if (profileErr) throw profileErr;

      // 2. Fetch Student Profile info
      const { data: student, error: studentErr } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (studentErr) throw studentErr;

      // 3. Load from LocalStorage if edits exist, otherwise populate from DB
      const localDataStr = localStorage.getItem(`resume_builder_${user!.id}`);
      if (localDataStr) {
        try {
          const parsed = JSON.parse(localDataStr);
          setResumeData(parsed);
          const savedStyle = localStorage.getItem(`resume_template_style_${user!.id}`);
          if (savedStyle) setSelectedTemplateStyle(savedStyle);
        } catch (e) {
          console.error("Local storage parse error:", e);
        }
      } else if (profile || student) {
        setResumeData({
          fullName: profile?.full_name || "",
          email: profile?.email || user?.email || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          summary: profile?.bio || "",
          education: student?.university ? [{ school: student.university, degree: student.major || "", year: student.graduation_year ? String(student.graduation_year) : "" }] : [{ school: "", degree: "", year: "" }],
          experience: [{ company: "", role: "", duration: "", description: "" }],
          skills: student?.skills && student.skills.length > 0 ? student.skills : [""],
        });
      }
    } catch (err: any) {
      console.error("Error loading resume data:", err);
      toast.error("Failed to sync resume data from database");
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadResumeAnalytics = async () => {
    try {
      const { data: student } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (student) {
        const { data: analyticsList } = await supabase
          .from("resume_analytics")
          .select("*, profiles (full_name)")
          .eq("student_id", student.id);

        if (analyticsList && analyticsList.length > 0) {
          const totalViews = analyticsList.length;
          const totalDuration = analyticsList.reduce((acc, curr) => acc + (curr.view_duration || 0), 0);
          const avgTime = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;
          const mins = Math.floor(avgTime / 60);
          const secs = avgTime % 60;
          
          // Deduplicate viewers
          const viewers = Array.from(new Set(analyticsList.map(a => a.profiles?.full_name).filter(Boolean)));
          const topViewers = viewers.slice(0, 2).join(", ") || "Anonymous Recruiter";

          setAnalytics({
            views: totalViews,
            avgViewTime: `${mins}m ${secs}s`,
            topViewers: topViewers
          });
        }
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const toastId = toast.loading("Uploading resume to database...");
      
      const { data: student } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!student) {
        toast.dismiss(toastId);
        toast.error("Please create a student profile first by filling out the builder.");
        return;
      }

      // Track mock upload view duration entry to database
      const { error } = await supabase.from("resume_analytics").insert({
        student_id: student.id,
        view_duration: 120, // 2 mins mock view
      });

      toast.dismiss(toastId);
      if (error) {
        toast.error("Failed to log resume upload.");
      } else {
        toast.success("Resume PDF uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload resume file");
    }
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { school: "", degree: "", year: "" }],
    });
  };

  const removeEducation = (index: number) => {
    const newEdu = [...resumeData.education];
    newEdu.splice(index, 1);
    setResumeData({ ...resumeData, education: newEdu });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: "", role: "", duration: "", description: "" }],
    });
  };

  const removeExperience = (index: number) => {
    const newExp = [...resumeData.experience];
    newExp.splice(index, 1);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = [...resumeData.skills];
    newSkills.splice(index, 1);
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const handleSaveResume = async () => {
    if (!user) {
      toast.error("You must be logged in to save.");
      return;
    }
    try {
      setSavingResume(true);
      const toastId = toast.loading("Saving changes to database...");

      // 1. Save to profiles
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          full_name: resumeData.fullName,
          bio: resumeData.summary,
          phone: resumeData.phone,
          location: resumeData.location
        })
        .eq("id", user.id);

      if (profileErr) throw profileErr;

      // 2. Extract university/major
      const firstEdu = resumeData.education[0];
      const validSkills = resumeData.skills.filter(s => s.trim() !== "");

      // 3. Upsert student profile
      const { data: existingStudent } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let studentErr;
      if (existingStudent) {
        const { error } = await supabase
          .from("student_profiles")
          .update({
            skills: validSkills,
            university: firstEdu?.school || null,
            major: firstEdu?.degree || null,
            graduation_year: firstEdu?.year ? parseInt(firstEdu.year.split("-").pop() || "") || null : null
          })
          .eq("user_id", user.id);
        studentErr = error;
      } else {
        const { error } = await supabase
          .from("student_profiles")
          .insert({
            user_id: user.id,
            skills: validSkills,
            university: firstEdu?.school || null,
            major: firstEdu?.degree || null,
            graduation_year: firstEdu?.year ? parseInt(firstEdu.year.split("-").pop() || "") || null : null
          });
        studentErr = error;
      }

      if (studentErr) throw studentErr;

      // 4. Save entire object to localStorage for easy retrieval
      localStorage.setItem(`resume_builder_${user.id}`, JSON.stringify(resumeData));
      localStorage.setItem(`resume_template_style_${user.id}`, selectedTemplateStyle);

      toast.dismiss(toastId);
      toast.success("Resume saved successfully & synced with your public profile!");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save resume: " + error.message);
    } finally {
      setSavingResume(false);
    }
  };

  const handlePreviewClick = (templateName: string) => {
    setPreviewTemplate(templateName);
    setIsPreviewOpen(true);
  };

  const handleImplementTemplate = () => {
    if (previewTemplate && TEMPLATE_SAMPLES[previewTemplate]) {
      const sample = TEMPLATE_SAMPLES[previewTemplate];
      setResumeData(sample);
      setSelectedTemplateStyle(previewTemplate);
      setIsPreviewOpen(false);
      setActiveTab("builder");
      toast.success(`Implemented ${previewTemplate} template with sample data! You can now edit it.`);
    }
  };

  // Render Resume logic based on template styles
  const renderResumeMarkup = (data: ResumeData, style: string) => {
    const validSkills = data.skills.filter(s => s.trim() !== "");
    
    switch (style) {
      case "Modern Professional":
        return (
          <div className="grid grid-cols-5 bg-white text-slate-800 shadow-md min-h-[500px] border border-slate-200 rounded-md text-[10px]">
            {/* Left Sidebar */}
            <div className="col-span-2 bg-slate-900 text-slate-100 p-5 rounded-l-md flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide uppercase border-b border-slate-700 pb-2 mb-3">
                  {data.fullName || "Your Full Name"}
                </h3>
                
                <div className="space-y-2 mb-6 text-slate-300">
                  {data.email && (
                    <div className="flex items-center gap-1.5 opacity-90">
                      <Mail className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{data.email}</span>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-1.5 opacity-90">
                      <Phone className="h-3 w-3 text-primary shrink-0" />
                      <span>{data.phone}</span>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center gap-1.5 opacity-90">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{data.location}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider mb-2 text-[9px]">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {validSkills.map((s, idx) => (
                      <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-[8px] border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-[8px] opacity-50 text-center border-t border-slate-800 pt-2">
                AfriHustle verified portfolio
              </div>
            </div>
            
            {/* Right main */}
            <div className="col-span-3 p-5 flex flex-col gap-4">
              {data.summary && (
                <div>
                  <h4 className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 mb-1.5 uppercase tracking-wider">Summary</h4>
                  <p className="text-slate-600 leading-normal">{data.summary}</p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 mb-2 uppercase tracking-wider">Experience</h4>
                <div className="space-y-3">
                  {data.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{exp.role || "Job Role"}</span>
                        <span className="text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <div className="text-slate-500 italic text-[9px] mb-1">{exp.company}</div>
                      <p className="text-slate-600 text-[9px] leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 mb-2 uppercase tracking-wider">Education</h4>
                <div className="space-y-2">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-800">{edu.school || "University/School"}</div>
                        <div className="text-slate-500 text-[9px]">{edu.degree}</div>
                      </div>
                      <span className="text-slate-500 font-normal text-[8px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "Creative Designer":
        return (
          <div className="bg-amber-50/40 text-stone-800 p-6 shadow-md min-h-[500px] border border-stone-200 rounded-md text-[10px] flex flex-col gap-4">
            {/* Top header */}
            <div className="text-center pb-4 border-b border-stone-200">
              <h3 className="text-lg font-extrabold tracking-tight text-stone-900 mb-1">
                {data.fullName || "Your Full Name"}
              </h3>
              <div className="flex justify-center flex-wrap gap-3 text-stone-500 text-[9px]">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>• {data.phone}</span>}
                {data.location && <span>• {data.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="bg-white/60 p-3 rounded border border-stone-200/50">
                <p className="leading-relaxed italic text-stone-600">{data.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Exp & Edu */}
              <div className="col-span-2 space-y-4">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs border-b border-stone-300 pb-1 mb-2">Projects & Experience</h4>
                  <div className="space-y-3">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-3 border-l-2 border-stone-300">
                        <div className="font-bold text-stone-800 text-[9px]">{exp.role}</div>
                        <div className="text-stone-500 text-[9px] mb-1 flex justify-between">
                          <span>{exp.company}</span>
                          <span className="italic">{exp.duration}</span>
                        </div>
                        <p className="text-stone-600 leading-normal text-[9px]">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-xs border-b border-stone-300 pb-1 mb-2">Academic Journey</h4>
                  <div className="space-y-2">
                    {data.education.map((edu, idx) => (
                      <div key={idx} className="relative pl-3 border-l-2 border-stone-300">
                        <div className="font-bold text-stone-800 text-[9px]">{edu.school}</div>
                        <div className="text-stone-500 text-[8px] flex justify-between">
                          <span>{edu.degree}</span>
                          <span>{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Skills */}
              <div className="col-span-1">
                <h4 className="font-bold text-stone-900 text-xs border-b border-stone-300 pb-1 mb-2">My Toolkit</h4>
                <div className="flex flex-wrap gap-1.5">
                  {validSkills.map((s, idx) => (
                    <span key={idx} className="bg-amber-100/60 hover:bg-amber-100 border border-amber-200 text-amber-900 px-2 py-1 rounded-md text-[8px] font-medium transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "Tech Developer":
        return (
          <div className="bg-slate-950 text-slate-300 p-6 shadow-md min-h-[500px] border border-slate-800 rounded-md font-mono text-[9px] flex flex-col gap-4">
            {/* Monospace Header */}
            <div>
              <div className="text-primary font-bold text-xs mb-1">&lt;Developer name="{data.fullName || "YourName"}" /&gt;</div>
              <div className="grid grid-cols-2 gap-2 text-slate-500 border-b border-slate-800 pb-3 mb-2">
                <div>Email: "{data.email}"</div>
                <div>Phone: "{data.phone}"</div>
                <div>Loc: "{data.location}"</div>
                <div>Status: "Looking for Hustles"</div>
              </div>
            </div>

            {/* Profile summary */}
            {data.summary && (
              <div>
                <div className="text-primary font-bold mb-1">// Professional Overview</div>
                <p className="text-slate-400 leading-normal">{data.summary}</p>
              </div>
            )}

            {/* Skills */}
            <div>
              <div className="text-primary font-bold mb-1.5">// Tech Stack & Skills</div>
              <div className="flex flex-wrap gap-1">
                {validSkills.map((s, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-800 text-primary px-2 py-0.5 rounded text-[8px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="text-primary font-bold mb-2">// Selected Projects</div>
              <div className="space-y-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="border-l border-primary/20 pl-3">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{exp.role || "Developer"} @ {exp.company}</span>
                      <span className="text-slate-500 font-normal text-[8px]">{exp.duration}</span>
                    </div>
                    <p className="text-slate-400 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="text-primary font-bold mb-1.5">// Education & Credentials</div>
              <div className="space-y-1.5">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-slate-400">
                    <span>{edu.school} - {edu.degree}</span>
                    <span className="text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Clean Minimal":
      default:
        return (
          <div className="bg-white text-black p-6 shadow-md min-h-[500px] border border-neutral-300 rounded-md text-[9px] flex flex-col gap-4">
            {/* Centered clean text */}
            <div className="text-center mb-2">
              <h3 className="text-lg font-light tracking-widest uppercase mb-1">
                {data.fullName || "Your Full Name"}
              </h3>
              <div className="flex justify-center gap-4 text-neutral-500 tracking-wide">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.location && <span>{data.location}</span>}
              </div>
              <div className="h-[1px] bg-black w-full mt-3" />
            </div>

            {/* Summary */}
            {data.summary && (
              <div>
                <p className="leading-relaxed text-neutral-600 text-justify">{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            <div>
              <h4 className="font-bold text-black uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">Professional Experience</h4>
              <div className="space-y-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>{exp.role}</span>
                      <span className="font-normal text-neutral-500">{exp.duration}</span>
                    </div>
                    <div className="text-neutral-500 italic mb-1">{exp.company}</div>
                    <p className="text-neutral-600 leading-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="font-bold text-black uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">Education</h4>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{edu.school}</div>
                      <div className="text-neutral-500">{edu.degree}</div>
                    </div>
                    <span className="text-neutral-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-bold text-black uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">Core Competencies</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {validSkills.map((s, idx) => (
                  <span key={idx} className="text-neutral-700">
                    {s}{idx < validSkills.length - 1 ? " •" : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Resume Studio</h1>
            <p className="text-muted-foreground">
              Build your professional resume, select layouts, and track recruiter views
            </p>
          </div>

          {loadingProfile ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your profile from Supabase...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-border/40">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </TabsTrigger>
                <TabsTrigger value="builder">
                  <FileText className="h-4 w-4 mr-2" />
                  Interactive Builder
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Views & Analytics
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload" className="mt-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="p-8 border border-border/40 bg-card/40 backdrop-blur-sm shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Upload Existing Resume</h2>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-primary transition-all duration-300 cursor-pointer bg-background/30 hover:bg-background/50">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg mb-2">Drag & drop your resume here</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        or click to browse (PDF, DOC, DOCX - Max 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Button variant="hero" className="cursor-pointer shadow-md" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </Card>

                  <Card className="p-8 border border-border/40 bg-card/40 backdrop-blur-sm shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Resume Templates</h2>
                    <div className="space-y-4">
                      {["Modern Professional", "Creative Designer", "Tech Developer", "Clean Minimal"].map((template, i) => (
                        <div
                          key={i}
                          className="border border-border/50 bg-background/20 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/30 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                              <FileText className="h-5 w-5" />
                            </div>
                            <span className="font-semibold">{template}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewClick(template)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Builder Tab */}
              <TabsContent value="builder" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Form Edit */}
                  <Card className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm lg:col-span-3">
                    <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold">Build Your Profile Resume</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Edits are automatically saved to draft local storage</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsBuilderPreviewOpen(true)}>
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Full
                        </Button>
                        <Button variant="hero" size="sm" onClick={handleSaveResume} disabled={savingResume} className="shadow-md">
                          {savingResume ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Download className="h-4 w-4 mr-1.5" />}
                          Save & Sync
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div className="bg-background/20 p-4 rounded-lg border border-border/30">
                        <h3 className="text-base font-semibold mb-4 text-primary">1. Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={resumeData.fullName}
                              onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                              placeholder="e.g. John Doe"
                              className="bg-background/40 border-border/50 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resumeData.email}
                              onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                              placeholder="e.g. john@example.com"
                              className="bg-background/40 border-border/50 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={resumeData.phone}
                              onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                              placeholder="e.g. +234 803 000 0000"
                              className="bg-background/40 border-border/50 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location (City, Country)</Label>
                            <Input
                              id="location"
                              value={resumeData.location}
                              onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                              placeholder="e.g. Lagos, Nigeria"
                              className="bg-background/40 border-border/50 mt-1"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="summary">Professional Summary / Bio</Label>
                          <Textarea
                            id="summary"
                            value={resumeData.summary}
                            onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                            placeholder="Brief professional intro..."
                            rows={3}
                            className="bg-background/40 border-border/50 mt-1 resize-none"
                          />
                        </div>
                      </div>

                      {/* Education */}
                      <div className="bg-background/20 p-4 rounded-lg border border-border/30">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-primary">2. Education</h3>
                          <Button variant="outline" size="sm" onClick={addEducation} className="h-8" asChild>
                            <button type="button">
                              <Plus className="h-4 w-4 mr-1 inline-block" /> Add
                            </button>
                          </Button>
                        </div>
                        {resumeData.education.map((edu, i) => (
                          <div key={i} className="mb-4 p-4 border border-border/50 bg-background/20 rounded-lg relative">
                            {resumeData.education.length > 1 && (
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                                onClick={() => removeEducation(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <Label>School / University</Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education];
                                    newEdu[i].school = e.target.value;
                                    setResumeData({ ...resumeData, education: newEdu });
                                  }}
                                  placeholder="e.g. University of Lagos"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                              <div>
                                <Label>Degree & Major</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education];
                                    newEdu[i].degree = e.target.value;
                                    setResumeData({ ...resumeData, education: newEdu });
                                  }}
                                  placeholder="e.g. B.Sc. Computer Science"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                              <div>
                                <Label>Year Range</Label>
                                <Input
                                  value={edu.year}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education];
                                    newEdu[i].year = e.target.value;
                                    setResumeData({ ...resumeData, education: newEdu });
                                  }}
                                  placeholder="e.g. 2020 - 2024"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Experience */}
                      <div className="bg-background/20 p-4 rounded-lg border border-border/30">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-primary">3. Experience & Internships</h3>
                          <Button variant="outline" size="sm" onClick={addExperience} className="h-8" asChild>
                            <button type="button">
                              <Plus className="h-4 w-4 mr-1 inline-block" /> Add
                            </button>
                          </Button>
                        </div>
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} className="space-y-3 mb-4 p-4 border border-border/50 bg-background/20 rounded-lg relative">
                            {resumeData.experience.length > 1 && (
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                                onClick={() => removeExperience(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <Label>Company / Organization</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[i].company = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExp });
                                  }}
                                  placeholder="e.g. Tech Corp Ltd"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                              <div>
                                <Label>Role Title</Label>
                                <Input
                                  value={exp.role}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[i].role = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExp });
                                  }}
                                  placeholder="e.g. Software Engineer Intern"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                              <div>
                                <Label>Duration Range</Label>
                                <Input
                                  value={exp.duration}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[i].duration = e.target.value;
                                    setResumeData({ ...resumeData, experience: newExp });
                                  }}
                                  placeholder="e.g. May 2023 - Aug 2023"
                                  className="bg-background/40 border-border/50 mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Role Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...resumeData.experience];
                                  newExp[i].description = e.target.value;
                                  setResumeData({ ...resumeData, experience: newExp });
                                }}
                                placeholder="Detail your tasks and contributions..."
                                rows={2.5}
                                className="bg-background/40 border-border/50 mt-1 resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      <div className="bg-background/20 p-4 rounded-lg border border-border/30">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-primary">4. Core Skills</h3>
                          <Button variant="outline" size="sm" onClick={addSkill} className="h-8" asChild>
                            <button type="button">
                              <Plus className="h-4 w-4 mr-1 inline-block" /> Add
                            </button>
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          {resumeData.skills.map((skill, i) => (
                            <div key={i} className="flex gap-1.5 items-center">
                              <Input
                                value={skill}
                                onChange={(e) => {
                                  const newSkills = [...resumeData.skills];
                                  newSkills[i] = e.target.value;
                                  setResumeData({ ...resumeData, skills: newSkills });
                                }}
                                placeholder="e.g. React, Figma, Python"
                                className="bg-background/40 border-border/50"
                              />
                              {resumeData.skills.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
                                  onClick={() => removeSkill(i)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Right Live Preview Panel */}
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="p-4 border border-border/40 bg-card/60 backdrop-blur-sm shadow-md sticky top-24">
                      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-primary" /> Live Preview
                        </h3>
                        <select 
                          className="h-8 text-xs px-2.5 rounded-md border border-border/50 bg-background text-foreground font-semibold"
                          value={selectedTemplateStyle}
                          onChange={(e) => setSelectedTemplateStyle(e.target.value)}
                        >
                          <option value="Modern Professional">Modern Layout</option>
                          <option value="Creative Designer">Creative Layout</option>
                          <option value="Tech Developer">Developer Layout</option>
                          <option value="Clean Minimal">Minimalist Layout</option>
                        </select>
                      </div>
                      
                      <div className="overflow-hidden border border-border/40 rounded-md bg-background/20 shadow-inner max-h-[550px] overflow-y-auto">
                        <div className="scale-95 origin-top p-1">
                          {renderResumeMarkup(resumeData, selectedTemplateStyle)}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recruiter Views</p>
                      <h4 className="text-3xl font-extrabold text-primary mt-1">{analytics.views}</h4>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <Eye className="h-6 w-6" />
                    </div>
                  </Card>

                  <Card className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Read Time</p>
                      <h4 className="text-3xl font-extrabold text-accent mt-1">{analytics.avgViewTime}</h4>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-full text-accent">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </Card>

                  <Card className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm shadow-md lg:col-span-1">
                    <p className="text-sm text-muted-foreground">Primary Viewers</p>
                    <p className="font-semibold text-lg text-foreground mt-2 truncate">{analytics.topViewers}</p>
                  </Card>
                </div>

                <Card className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
                  <h2 className="text-2xl font-semibold mb-6">Recruiter View History</h2>
                  <div className="space-y-4">
                    {analytics.views === 0 ? (
                      <div className="py-8 text-center text-muted-foreground text-sm">
                        No recruiter views logged yet. Apply to some hustles to share your resume!
                      </div>
                    ) : (
                      <div className="p-4 border border-border/40 rounded-lg flex items-center justify-between bg-background/20">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Eye className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{analytics.topViewers}</p>
                            <p className="text-xs text-muted-foreground">Checked your synced profile details</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{analytics.avgViewTime}</p>
                          <p className="text-[10px] text-muted-foreground">View duration</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Template Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[700px] bg-card border border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Preview: {previewTemplate}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This is a layout sample of the <span className="font-semibold text-foreground">{previewTemplate}</span> layout style. If you choose to implement this template, it will load sample details into your builder form.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 border border-border/60 rounded-md p-1 bg-background/20">
            {previewTemplate && TEMPLATE_SAMPLES[previewTemplate] && (
              renderResumeMarkup(TEMPLATE_SAMPLES[previewTemplate], previewTemplate)
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleImplementTemplate}>
              Implement Template & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Builder Preview Dialog */}
      <Dialog open={isBuilderPreviewOpen} onOpenChange={setIsBuilderPreviewOpen}>
        <DialogContent className="max-w-[800px] bg-card border border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-primary" /> Full Resume Preview ({selectedTemplateStyle})
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This is how your current resume looks. You can change templates from the live preview panel selector.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 border border-border/80 rounded-md p-2 bg-background/40">
            {renderResumeMarkup(resumeData, selectedTemplateStyle)}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuilderPreviewOpen(false)}>
              Close
            </Button>
            <Button variant="hero" onClick={handleSaveResume} disabled={savingResume}>
              {savingResume ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
              Save & Sync Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeStudio;
