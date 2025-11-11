import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  Dumbbell, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  TrendingUp,
  Heart,
  Target,
  Zap,
  ArrowRight,
  Calendar,
  ShoppingBag
} from "lucide-react";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HomeView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const scrollTarget = state.scrollTo;
      const scrollToSection = () => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      // Give the page time to render before attempting to scroll
      const timeout = window.setTimeout(scrollToSection, 150);

      // Clean up navigation state so the effect doesn't run again unnecessarily
      navigate(".", { replace: true });

      return () => window.clearTimeout(timeout);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-background relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge className="mb-4 text-sm px-4 py-1">Welcome to Excellence</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              PrimePulse Fitness
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your premier destination for fitness excellence. We're committed to helping you achieve your health and fitness goals with state-of-the-art facilities and expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Dumbbell className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Modern Equipment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  State-of-the-art fitness equipment and training tools
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Expert Trainers</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Certified professionals dedicated to your success
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Premium Classes</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Diverse range of fitness classes for all levels
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Flexible Hours</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Open 7 days a week to fit your schedule
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-secondary/30 via-secondary/10 to-background">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--accent-rgb,255,100,100),0.1),transparent_50%)]" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Our Advantages</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose PrimePulse?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We offer more than just a gym - we provide a complete fitness lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Personalized Training</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Custom workout plans tailored to your fitness level and goals
                </p>
              </div>
            </Card>

            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Monitor your fitness journey with our advanced tracking system
                </p>
              </div>
            </Card>

            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Nutrition Guidance</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Expert diet plans and nutritional advice to complement your training
                </p>
              </div>
            </Card>

            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <Target className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Goal-Oriented Approach</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Structured programs designed to help you achieve specific results
                </p>
              </div>
            </Card>

            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">High-Energy Environment</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Motivating atmosphere that pushes you to reach your potential
                </p>
              </div>
            </Card>

            <Card className="flex gap-4 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 group">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors group-hover:scale-110 transform duration-300">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">Community Support</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Join a community of like-minded individuals on their fitness journey
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 px-4 bg-background relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="group py-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-accent/50 overflow-hidden">
              <Link to="/membership" className="block">
                <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 group-hover:scale-110 transform transition-transform duration-300">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Membership Plans</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Flexible plans designed to fit your lifestyle and budget
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="group py-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-accent/50 overflow-hidden">
              <Link to="/classes" className="block">
                <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 group-hover:scale-110 transform transition-transform duration-300">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Browse Classes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Explore our diverse range of fitness classes for all levels
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="group py-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-accent/50 overflow-hidden">
              <Link to="/store" className="block">
                <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/80 group-hover:scale-110 transform transition-transform duration-300">
                      <ShoppingBag className="h-6 w-6 text-accent" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">Fitness Store</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Shop premium fitness gear and supplements
                  </p>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-r from-accent/15 via-accent/5 to-secondary/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb,255,100,100),0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[shimmer_60s_linear_infinite]" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 text-sm px-4 py-2">Start Your Journey</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your Life?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
              Join PrimePulse Fitness today and take the first step towards a healthier, stronger you. Choose from our flexible membership plans designed to fit your lifestyle.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link to="/membership">
                  View Membership Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(var(--accent-rgb,255,100,100),0.08),transparent_60%)]" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-1">Contact Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Have questions? We're here to help you get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 transform">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Visit Us</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  123 Fitness Street<br />
                  Downtown, City 12345
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 transform">
                    <Phone className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Call Us</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Phone: (555) 123-4567<br />
                  Mon-Fri: 6AM - 10PM
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-accent/50">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 transform">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Email Us</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  info@primepulse.com<br />
                  support@primepulse.com
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Link to="/contact">
                Send Us a Message
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeView;
