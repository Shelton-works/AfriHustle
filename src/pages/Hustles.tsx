import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Filter,
  Loader2,
  CheckCircle2
} from "lucide-react";

interface Hustle {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  remote: boolean;
  compensation_amount: number;
  compensation_type: string;
  required_skills: string[];
  duration: string;
  status: string;
  created_at: string;
  company_profiles: {
    id: string;
    company_name: string;
    verified: boolean;
  };
}

const Hustles = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [hustles, setHustles] = useState<Hustle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [appliedHustleIds, setAppliedHustleIds] = useState<string[]>([]);
  
  // Application Modal State
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<Hustle | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);

  useEffect(() => {
    fetchHustles();
    if (user && userRole === "student") {
      fetchUserApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userRole]);

  const fetchHustles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hustles")
        .select(`
          *,
          company_profiles (
            id,
            company_name,
            verified
          )
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load opportunities from database");
        console.error("Error fetching hustles:", error);
      } else {
        setHustles(data as Hustle[] || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      // 1. Get student profile id
      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (studentProfile) {
        // 2. Fetch applications
        const { data: apps, error } = await supabase
          .from("applications")
          .select("hustle_id")
          .eq("student_id", studentProfile.id);

        if (error) {
          console.error("Error loading application statuses:", error);
        } else if (apps) {
          setAppliedHustleIds(apps.map(a => a.hustle_id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = async (hustle: Hustle) => {
    if (!user) {
      toast.info("Please log in to apply for this opportunity");
      navigate("/auth");
      return;
    }

    if (userRole === "company") {
      toast.error("Only student profiles can apply for hustles");
      return;
    }

    setSelectedHustle(hustle);
    setCoverLetter("");
    setIsApplyOpen(true);
  };

  const submitApplication = async () => {
    if (!selectedHustle) return;
    try {
      setSubmittingApp(true);

      // 1. Get student profile id
      const { data: studentProfile, error: profileErr } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (profileErr || !studentProfile) {
        toast.error("Please complete your profile in the Resume Studio before applying.");
        navigate("/resume");
        return;
      }

      // 2. Insert application
      const { error: appErr } = await supabase
        .from("applications")
        .insert({
          hustle_id: selectedHustle.id,
          student_id: studentProfile.id,
          cover_letter: coverLetter,
          status: "pending"
        });

      if (appErr) {
        if (appErr.code === "23505") {
          toast.error("You have already applied to this hustle!");
        } else {
          toast.error("Failed to submit application: " + appErr.message);
        }
      } else {
        toast.success("Application submitted successfully!");
        setAppliedHustleIds([...appliedHustleIds, selectedHustle.id]);
        setIsApplyOpen(false);
      }
    } catch (err: any) {
      toast.error("Application error: " + err.message);
    } finally {
      setSubmittingApp(false);
    }
  };

  // Client-side filtering
  const filteredHustles = hustles.filter(hustle => {
    const matchesSearch = 
      hustle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hustle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hustle.company_profiles?.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      hustle.required_skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesLocation = !selectedLocation || 
      (selectedLocation === "remote" && hustle.remote) ||
      (selectedLocation !== "remote" && hustle.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
      
    const matchesType = !selectedType || 
      hustle.compensation_type?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Find Your Next Hustle</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading opportunities..." : `Browse ${filteredHustles.length} active opportunities from verified companies across Africa`}
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8 border border-border/40 bg-card/60 backdrop-blur-md shadow-lg">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search titles, companies, or skills..."
                    className="pl-10 bg-background/50 border-border/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <select 
                className="h-10 px-3 rounded-md border border-border/50 bg-background/50 text-foreground"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="nigeria">Nigeria</option>
                <option value="kenya">Kenya</option>
                <option value="ghana">Ghana</option>
                <option value="south africa">South Africa</option>
                <option value="remote">Remote</option>
              </select>

              <select 
                className="h-10 px-3 rounded-md border border-border/50 bg-background/50 text-foreground"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Pay Types</option>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="commission">Commission</option>
              </select>
            </div>
          </Card>

          {/* Hustles Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading active hustles from Supabase...</p>
            </div>
          ) : filteredHustles.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-border/40 bg-card/20 backdrop-blur-sm">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-60" />
              <h3 className="text-xl font-semibold mb-2">No Hustles Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any opportunities matching your filters. Switch categories or post a new hustle if you are a company recruiter.
              </p>
              {userRole === "company" && (
                <Link to="/company-dashboard">
                  <Button variant="hero">Post a Hustle</Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredHustles.map((hustle) => {
                const isApplied = appliedHustleIds.includes(hustle.id);
                return (
                  <Card key={hustle.id} className="p-6 border border-border/40 bg-card/30 backdrop-blur-sm hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.01] hover:border-primary/20">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold text-foreground">{hustle.title}</h3>
                              {hustle.company_profiles?.verified && (
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary/20">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground font-medium">{hustle.company_profiles?.company_name || "Anonymous Recruiter"}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary/60" />
                            {hustle.location || (hustle.remote ? "Remote" : "Africa")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4 text-primary/60" />
                            <span className="capitalize">{hustle.compensation_type || "Contract"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary/60" />
                            {hustle.duration || "Short-term"}
                          </div>
                          <div className="flex items-center gap-1 text-primary font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {hustle.compensation_amount ? `$${hustle.compensation_amount}` : "Unspecified"}
                          </div>
                        </div>

                        <p className="text-muted-foreground/90 mb-4 line-clamp-3">{hustle.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {hustle.required_skills?.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-secondary border border-border/30 text-secondary-foreground text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[200px] justify-center h-full">
                        {isApplied ? (
                          <Button variant="outline" className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10 gap-2 cursor-default" disabled>
                            <CheckCircle2 className="h-4 w-4" /> Applied
                          </Button>
                        ) : (
                          <Button variant="hero" className="w-full shadow-md" onClick={() => handleApplyClick(hustle)}>
                            Apply Now
                          </Button>
                        )}
                        <p className="text-xs text-muted-foreground text-center">
                          Posted on {new Date(hustle.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Application Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-[550px] bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Apply for {selectedHustle?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Submit your application to <span className="font-semibold text-foreground">{selectedHustle?.company_profiles?.company_name}</span>. They will see your profile and resume from the Resume Studio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coverLetter" className="font-semibold">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                placeholder="Explain why you are the perfect fit for this hustle..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px] bg-background/50 border-border/50 text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={submitApplication} disabled={submittingApp} className="min-w-[120px]">
              {submittingApp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                </>
              ) : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hustles;