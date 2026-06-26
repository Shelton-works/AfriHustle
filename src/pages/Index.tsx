import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Briefcase, Users, TrendingUp, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Find Your Hustle",
      description: "Browse opportunities from verified companies and brands looking for talented students.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Build Your Network",
      description: "Connect with companies, collaborate with peers, and build lasting professional relationships.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Your Growth",
      description: "Monitor applications, track payments, and showcase your achievements on your profile.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Get Recognized",
      description: "Build your portfolio with real projects and get paid for your skills and dedication.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Companies" },
    { value: "5K+", label: "Hustles Posted" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Connect with
                <span className="block text-primary">Real Opportunities</span>
                Across Africa
              </h1>
              <p className="text-xl text-muted-foreground">
                AfriHustle bridges the gap between ambitious students and forward-thinking companies. Find hustles, build your portfolio, and get paid for your talent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/hustles">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Browse Hustles
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-secondary border-2 border-background"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <span className="font-semibold text-foreground">10,000+</span> students already hustling
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
              <img
                src={heroImage}
                alt="African students collaborating"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AfriHustle?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to launch your career and connect with opportunities across Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-105">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A seamless two-sided marketplace connecting talented students with forward-thinking companies
            </p>
          </div>
          
          {/* For Students */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">For Students</h3>
            </div>
            <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Sign Up", desc: "Create your student profile with skills, experience, and upload your resume in our Resume Studio" },
                { step: "02", title: "Browse Hustles", desc: "Explore verified opportunities from companies across Africa, filter by category, location, and pay" },
                { step: "03", title: "Apply", desc: "Submit applications with one click. Companies review your profile and portfolio" },
                { step: "04", title: "Get Accepted", desc: "Accepted applicants gain access to the Hustle Portal where companies manage projects and communicate" },
                { step: "05", title: "Deliver & Get Paid", desc: "Complete your work, receive feedback, and get paid securely through the platform with full transaction tracking" },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <Card className="p-4 h-full hover:shadow-lg transition-shadow">
                    <div className="text-4xl font-bold text-primary/20 mb-3">{item.step}</div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                  {index < 4 && (
                    <ArrowRight className="hidden md:block absolute top-12 -right-3 h-6 w-6 text-primary/40" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* For Companies */}
          <div>
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Briefcase className="h-6 w-6 text-accent" />
              <h3 className="text-2xl font-bold">For Companies</h3>
            </div>
            <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Post a Hustle", desc: "List your opportunity with details, requirements, compensation, and project timeline" },
                { step: "02", title: "Receive Applications", desc: "Students apply and you get access to their profiles, resumes, and portfolios in your dashboard" },
                { step: "03", title: "Select Candidates", desc: "Review applications, message candidates, and select the best fit for your hustle" },
                { step: "04", title: "Manage in Portal", desc: "Use the Hustle Portal to communicate updates, share deliverables, and track progress with accepted students" },
                { step: "05", title: "Pay & Review", desc: "Release payments securely through the platform once work is complete. All transactions are tracked and recorded" },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <Card className="p-4 h-full hover:shadow-lg transition-shadow border-accent/20">
                    <div className="text-4xl font-bold text-accent/20 mb-3">{item.step}</div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                  {index < 4 && (
                    <ArrowRight className="hidden md:block absolute top-12 -right-3 h-6 w-6 text-accent/40" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-primary-glow p-12 text-center">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Hustle?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students and companies already using AfriHustle to build successful careers and find top talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/hustles">
                <Button variant="outline" size="xl" className="w-full sm:w-auto bg-card hover:bg-card/90">
                  Explore Hustles
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                "No hidden fees",
                "Secure payments",
                "24/7 support",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <img src="/logo.png" alt="AfriHustle Logo" className="h-8 w-auto" />
                <span className="text-primary">AfriHustle</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting African talent with opportunities across the continent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/hustles" className="hover:text-primary transition-colors">Browse Hustles</Link></li>
                <li><Link to="/resume" className="hover:text-primary transition-colors">Resume Studio</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">My Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/post-hustle" className="hover:text-primary transition-colors">Post a Hustle</Link></li>
                <li><Link to="/company-dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 AfriHustle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;