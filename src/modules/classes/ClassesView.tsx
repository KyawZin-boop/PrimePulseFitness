import Classes from "@/components/Classes";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Dumbbell, Flame, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const classHighlights = [
  {
    title: "Daily Sessions",
    description: "Multiple time slots across strength, cardio, and recovery focused classes so you can train around your schedule.",
    icon: Dumbbell,
  },
  {
    title: "Expert Coaches",
    description: "Elite trainers with specialty certifications in strength, mobility, conditioning, and nutrition.",
    icon: Users,
  },
  {
    title: "Progress Tracking",
    description: "Integrated progress dashboards and benchmarks to help you measure improvement week over week.",
    icon: CheckCircle2,
  },
];

const classPerks = [
  "Unlimited access to free tutorial sessions",
  "Priority booking for premium and private classes",
  "Personalized program adjustments from your assigned coach",
  "Exclusive recovery workshops and mobility clinics",
];

const ClassesView = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden min-h-screen max-h-screen bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="container relative z-10 mx-auto grid gap-8 px-4 py-20 pt-28 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/90">
              Elite Group Training
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your perfect class & build unstoppable momentum
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              Balance strength, conditioning, and recovery with a carefully curated class schedule. Every session is designed to push you forward while keeping your body balanced and injury free.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button size="lg" variant="hero" onClick={() => navigate("/bookings")}>Book a Session</Button>
              <Button
                size="lg"
                variant="outline_athletic"
                className="bg-white/10 text-white hover:bg-white hover:text-primary"
                onClick={() => navigate("/trainers")}
              >
                Meet the Coaches
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {classHighlights.map((highlight) => (
              <Card key={highlight.title} className="border-white/20 bg-white/10 text-white shadow-accent backdrop-blur-xl">
                <CardContent className="flex items-start gap-4 p-6">
                  <highlight.icon className="mt-1 h-7 w-7 text-accent" />
                  <div>
                    <h3 className="text-lg font-semibold">{highlight.title}</h3>
                    <p className="text-sm text-white/70">{highlight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Classes />

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              <Flame className="h-4 w-4" />
              Why athletes choose PrimePulse
            </div>
            <h2 className="text-heading">Built to help you outwork yesterday</h2>
            <p className="text-lg text-muted-foreground">
              Pair dynamic class programming with elite coaching and you get more than a workout—you get a complete performance system. Recover smarter, lift stronger, and move faster with every session.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {classPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-accent" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={() => navigate("/bookings")}>Explore Membership Options</Button>
          </div>

          <Card className="border border-accent/10 bg-gradient-card shadow-card">
            <CardContent className="space-y-5 p-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground">Ready for your first class?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop in for a free tutorial session to experience how our coaches blend strength, conditioning, and mobility in a single workout.
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-accent/40 bg-accent/5 p-5 text-sm text-muted-foreground">
                <p>✔ Complimentary assessment with a performance coach</p>
                <p>✔ Custom recommendations based on your goals</p>
                <p>✔ 30-day progress plan tailored to your training capacity</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" onClick={() => navigate("/bookings")}>Reserve Free Session</Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/messages")}
                >
                  Talk to a Coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClassesView;
