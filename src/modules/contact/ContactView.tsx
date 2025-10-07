import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useState } from "react";

const ContactView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage("Thanks for reaching out! A coach will reply within one business day.");
      event.currentTarget.reset();
    }, 1200);
  };

  return (
    <div className="bg-background pt-16 text-foreground">
      <section className="relative overflow-hidden bg-gradient-hero py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_55%)]" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              Connect with PrimePulse
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let us help you build your strongest season yet
            </h1>
            <p className="text-lg text-white/80">
              Chat with a performance advisor, schedule a gym tour, or ask about personalized programming. We’re here to design the perfect training plan for you or your team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-heading">Reach us anytime</h2>
              <p className="text-muted-foreground">
                The PrimePulse team is on call to answer membership questions, set up small group sessions, or pair you with a specialty coach. Drop us a message and we’ll take it from there.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-accent/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-accent/10 p-3 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call us</h3>
                    <p className="text-sm text-muted-foreground">
                      (312) 555-4311
                    </p>
                    <p className="text-xs text-muted-foreground/70">Weekdays 6am – 9pm, Weekends 7am – 6pm</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-accent/10 p-3 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      hello@primepulse.fit
                    </p>
                    <p className="text-xs text-muted-foreground/70">We reply within one business day</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-card/60 backdrop-blur-sm md:col-span-2">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-accent/10 p-3 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit the performance lab</h3>
                    <p className="text-sm text-muted-foreground">
                      642 West Superior Ave, Chicago, IL 60654
                    </p>
                    <p className="text-xs text-muted-foreground/70">Drop-ins welcome. Book a tour to get a guided walkthrough.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border border-border/50 shadow-card">
            <CardContent className="space-y-6 p-8">
              <div>
                <h3 className="text-2xl font-semibold">Tell us about your goals</h3>
                <p className="text-sm text-muted-foreground">
                  We’ll match you with a coach who specializes in your sport, schedule, and training style.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" placeholder="Jordan" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" placeholder="Reeves" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Primary goal</Label>
                  <Input id="goal" name="goal" placeholder="Build strength, improve conditioning, compete in Hyrox..." required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Tell us about your current training rhythm, upcoming events, or any injuries we should know about."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>

                {statusMessage && (
                  <p className="text-sm font-medium text-accent/90">
                    {statusMessage}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactView;
