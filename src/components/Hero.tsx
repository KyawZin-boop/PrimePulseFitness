import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import heroImage from "@/assets/gym-hero.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern gym with people working out"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-hero mb-6 animate-fade-up">
            TRANSFORM YOUR
            <span className="block text-accent"> BODY & MIND</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Premium fitness equipment, expert-led classes, and personalized training programs. 
            Your journey to peak performance starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-athletic" />
            </Button>
            
            <Button variant="outline_athletic" size="xl" className="group bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-accent mb-2">500+</div>
              <div className="text-sm text-white/80 font-medium">Premium Equipment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-accent mb-2">50+</div>
              <div className="text-sm text-white/80 font-medium">Expert Trainers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-accent mb-2">24/7</div>
              <div className="text-sm text-white/80 font-medium">Access Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;