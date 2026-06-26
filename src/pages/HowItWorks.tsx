import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import {
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Send,
  MessageSquare,
  DollarSign,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

const HowItWorks = () => {
  const studentSteps = [
    {
      step: "01",
      icon: <FileText className="h-6 w-6" />,
      title: "Create Your Profile",
      desc: "Sign up as a student, fill in your details, skills, and experience. Use our Resume Studio to build a professional resume that stands out to employers.",
    },
    {
      step: "02",
      icon: <Search className="h-6 w-6" />,
      title: "Browse Hustles",
      desc: "Explore verified opportunities from companies across Africa. Filter by category, location, compensation, and duration to find the perfect match.",
    },
    {
      step: "03",
      icon: <Send className="h-6 w-6" />,
      title: "Apply with One Click",
      desc: "Submit applications easily with your profile and resume. Add a personalized cover letter to stand out from other applicants.",
    },
    {
      step: "04",
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Get Accepted",
      desc: "Companies review your profile and application. Once accepted, you'll gain access to the Hustle Portal to collaborate directly with the company.",
    },
    {
      step: "05",
      icon: <DollarSign className="h-6 w-6" />,
      title: "Deliver & Get Paid",
      desc: "Complete your work, submit deliverables through the portal, and receive secure payments tracked transparently on the platform.",
    },
  ];

  const companySteps = [
    {
      step: "01",
      icon: <Briefcase className="h-6 w-6" />,
      title: "Post a Hustle",
      desc: "Create a detailed listing with your requirements, compensation, timeline, and required skills. Your hustle goes live instantly to thousands of students.",
    },
    {
      step: "02",
      icon: <Users className="h-6 w-6" />,
      title: "Receive Applications",
      desc: "Students apply and you get full access to their profiles, resumes, portfolios, and cover letters in your Company Dashboard.",
    },
    {
      step: "03",
      icon: <Search className="h-6 w-6" />,
      title: "Select Candidates",
      desc: "Review applications side-by-side, filter by skills and experience, and accept or reject candidates with a single click.",
    },
    {
      step: "04",
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Manage in Portal",
      desc: "Use the Hustle Portal to communicate updates, share deliverables, set milestones, and track project progress in real time.",
    },
    {
      step: "05",
      icon: <DollarSign className="h-6 w-6" />,
      title: "Pay & Review",
      desc: "Release payments securely through the platform once work is complete. All transactions are tracked, recorded, and transparent.",
    },
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified & Secure",
      desc: "All companies are verified before posting. Payments are tracked and secured through the platform.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast & Simple",
      desc: "Apply in one click, get responses quickly, and start working within days — not weeks.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Pan-African Reach",
      desc: "Connect with opportunities and talent across the entire continent, including remote positions.",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Transparent Payments",
      desc: "Know exactly what you'll earn upfront. Every transaction is tracked on your dashboard.",
    },
  ];

  const faqs = [
    {
      q: "Is AfriHustle free for students?",
      a: "Yes! Signing up, browsing hustles, and applying is completely free for students. You only earn — you never pay.",
    },
    {
      q: "How do I get paid?",
      a: "Once a company marks your work as completed, payment is processed through the platform. You can track all your earnings in your dashboard.",
    },
    {
      q: "What types of hustles are available?",
      a: "Everything from social media management, graphic design, content writing, data entry, translation, software testing, video editing, and much more.",
    },
    {
      q: "How are companies verified?",
      a: "We review every company profile before they can post hustles. This ensures you're working with legitimate organizations.",
    },
    {
      q: "Can I work remotely?",
      a: "Many hustles are fully remote. You can filter by location and look for remote opportunities specifically.",
    },
    {
      q: "What happens if there's a dispute?",
      a: "Our support team mediates any disputes between students and companies to ensure fair outcomes for both sides.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How <span className="text-primary">AfriHustle</span> Works
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A seamless two-sided marketplace connecting talented African students
            with forward-thinking companies. Here's how it all comes together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/hustles">
              <Button variant="outline" size="xl">
                Browse Hustles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Students */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <Users className="h-7 w-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">For Students</h2>
          </div>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From sign-up to getting paid — your journey in five simple steps
          </p>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {studentSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-5 h-full hover:shadow-lg transition-shadow group">
                  <div className="text-4xl font-bold text-primary/20 mb-3">
                    {item.step}
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
                {index < 4 && (
                  <ArrowRight className="hidden md:block absolute top-14 -right-3 h-6 w-6 text-primary/40" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Sign Up as Student <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <Briefcase className="h-7 w-7 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">For Companies</h2>
          </div>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Post a hustle and find the perfect candidate in five easy steps
          </p>

          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {companySteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-5 h-full hover:shadow-lg transition-shadow border-accent/20 group">
                  <div className="text-4xl font-bold text-accent/20 mb-3">
                    {item.step}
                  </div>
                  <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
                {index < 4 && (
                  <ArrowRight className="hidden md:block absolute top-14 -right-3 h-6 w-6 text-accent/40" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Sign Up as Company <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why AfriHustle?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the African market with features that matter
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <Card
                key={i}
                className="p-6 text-center hover:shadow-lg transition-all hover:scale-105"
              >
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-primary-glow p-12 text-center">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Whether you're a student looking for opportunities or a company
              seeking talent — AfriHustle makes it simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  variant="accent"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  Join AfriHustle
                </Button>
              </Link>
              <Link to="/hustles">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full sm:w-auto bg-card hover:bg-card/90"
                >
                  Explore Hustles
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              {["No hidden fees", "Secure payments", "24/7 support"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-primary-foreground/90"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm">{item}</span>
                  </div>
                )
              )}
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
                <div className="bg-primary p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-primary">AfriHustle</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting African talent with opportunities across the
                continent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/hustles" className="hover:text-primary transition-colors">Browse Hustles</Link>
                </li>
                <li>
                  <Link to="/resume" className="hover:text-primary transition-colors">Resume Studio</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">My Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auth" className="hover:text-primary transition-colors">Post a Hustle</Link>
                </li>
                <li>
                  <Link to="/company-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-primary transition-colors">Help Center</Link>
                </li>
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

export default HowItWorks;
