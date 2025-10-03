import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award, Clock, Users } from "lucide-react";
import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";

const Trainers = () => {
  const trainers = [
    {
      id: 1,
      name: "Mike Johnson",
      specialty: "Strength & HIIT Training",
      experience: "8 years",
      rating: 4.9,
      clients: 250,
      image: trainer1,
      certifications: ["NASM-CPT", "HIIT Specialist"],
      description: "Former competitive athlete specializing in high-intensity training and strength development",
      specialties: ["Weight Loss", "Muscle Building", "Athletic Performance"]
    },
    {
      id: 2,
      name: "Sarah Chen",
      specialty: "Functional Fitness & Nutrition",
      experience: "6 years",
      rating: 4.8,
      clients: 180,
      image: trainer2,
      certifications: ["ACE-CPT", "Nutrition Coach"],
      description: "Holistic approach combining functional movement patterns with personalized nutrition guidance",
      specialties: ["Functional Training", "Nutrition Planning", "Injury Prevention"]
    },
    {
      id: 3,
      name: "Alex Thompson",
      specialty: "Boxing & Cardio",
      experience: "10 years",
      rating: 4.9,
      clients: 320,
      image: trainer1,
      certifications: ["Boxing Coach", "ACSM-CPT"],
      description: "Professional boxing background bringing authentic technique and conditioning methods",
      specialties: ["Boxing Technique", "Cardio Conditioning", "Mental Toughness"]
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      specialty: "Yoga & Mindfulness",
      experience: "12 years",
      rating: 4.9,
      clients: 200,
      image: trainer2,
      certifications: ["RYT-500", "Meditation Teacher"],
      description: "Integrating traditional yoga practice with modern fitness for complete mind-body wellness",
      specialties: ["Flexibility", "Stress Relief", "Mind-Body Connection"]
    }
  ];

  return (
    <section id="trainers" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Meet Our Expert Trainers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Work with certified professionals who are passionate about helping you achieve your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="bg-gradient-card border-0 shadow-card hover:shadow-athletic transition-athletic group">
              <div className="relative overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-athletic"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-bold">{trainer.rating}</span>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">{trainer.name}</CardTitle>
                <CardDescription className="text-accent font-medium">
                  {trainer.specialty}
                </CardDescription>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {trainer.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="font-medium">{trainer.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="font-medium">{trainer.clients}+ clients</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Certifications</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trainer.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4 flex-1">
                  <span className="text-sm font-medium mb-2 block">Specialties:</span>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="athletic" size="sm" className="w-full">
                    Book Session
                  </Button>
                  <Button variant="outline_athletic" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="xl">
            Find Your Perfect Trainer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Trainers;