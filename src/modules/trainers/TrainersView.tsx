import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Award,
  Calendar,
  DollarSign,
  MessageCircle,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api";

const TrainersView = () => {
  const navigate = useNavigate();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("all");

  // Mock trainers - replace with API call
  // const trainers: Trainer[] = [
  //   {
  //     id: "trainer-1",
  //     name: "Mike Chen",
  //     email: "mike.chen@primepulse.com",
  //     profilePhoto: "https://i.pravatar.cc/150?img=12",
  //     bio: "Certified strength and conditioning specialist with 10+ years of experience helping clients achieve their fitness goals. Specializes in powerlifting and functional training.",
  //     specializations: ["Strength Training", "Powerlifting", "Functional Fitness"],
  //     certifications: ["CSCS", "NSCA-CPT", "CrossFit Level 2"],
  //     rating: 4.9,
  //     totalRatings: 127,
  //     yearsExperience: 10,
  //     availability: [
  //       { dayOfWeek: 1, startTime: "06:00", endTime: "12:00", isAvailable: true },
  //       { dayOfWeek: 3, startTime: "06:00", endTime: "12:00", isAvailable: true },
  //       { dayOfWeek: 5, startTime: "06:00", endTime: "12:00", isAvailable: true },
  //     ],
  //     hourlyRate: 75,
  //   },
  //   {
  //     id: "trainer-2",
  //     name: "Sarah Williams",
  //     email: "sarah.williams@primepulse.com",
  //     profilePhoto: "https://i.pravatar.cc/150?img=45",
  //     bio: "HIIT and cardio expert passionate about high-energy workouts. Trained professional athletes and everyday fitness enthusiasts alike.",
  //     specializations: ["HIIT", "Cardio", "Weight Loss", "Athletic Performance"],
  //     certifications: ["ACE-CPT", "HIIT Specialist", "TRX Certified"],
  //     rating: 4.8,
  //     totalRatings: 98,
  //     yearsExperience: 7,
  //     availability: [
  //       { dayOfWeek: 2, startTime: "14:00", endTime: "20:00", isAvailable: true },
  //       { dayOfWeek: 4, startTime: "14:00", endTime: "20:00", isAvailable: true },
  //       { dayOfWeek: 6, startTime: "09:00", endTime: "15:00", isAvailable: true },
  //     ],
  //     hourlyRate: 65,
  //   },
  //   {
  //     id: "trainer-3",
  //     name: "Alex Rodriguez",
  //     email: "alex.rodriguez@primepulse.com",
  //     profilePhoto: "https://i.pravatar.cc/150?img=33",
  //     bio: "Holistic wellness coach focusing on yoga, mindfulness, and balanced nutrition. Helps clients achieve physical and mental harmony.",
  //     specializations: ["Yoga", "Pilates", "Nutrition", "Mind-Body Balance"],
  //     certifications: ["RYT-500", "Nutrition Coach", "Pilates Mat Certified"],
  //     rating: 4.7,
  //     totalRatings: 84,
  //     yearsExperience: 8,
  //     availability: [
  //       { dayOfWeek: 1, startTime: "08:00", endTime: "16:00", isAvailable: true },
  //       { dayOfWeek: 3, startTime: "08:00", endTime: "16:00", isAvailable: true },
  //       { dayOfWeek: 5, startTime: "08:00", endTime: "16:00", isAvailable: true },
  //     ],
  //     hourlyRate: 60,
  //   },
  //   {
  //     id: "trainer-4",
  //     name: "Jordan Lee",
  //     email: "jordan.lee@primepulse.com",
  //     profilePhoto: "https://i.pravatar.cc/150?img=68",
  //     bio: "Former competitive bodybuilder specializing in muscle building and body transformation. Results-driven approach with personalized nutrition plans.",
  //     specializations: ["Bodybuilding", "Muscle Gain", "Nutrition Planning"],
  //     certifications: ["ISSA-CFT", "Sports Nutritionist", "Bodybuilding Coach"],
  //     rating: 4.9,
  //     totalRatings: 142,
  //     yearsExperience: 12,
  //     availability: [
  //       { dayOfWeek: 2, startTime: "05:00", endTime: "11:00", isAvailable: true },
  //       { dayOfWeek: 4, startTime: "05:00", endTime: "11:00", isAvailable: true },
  //       { dayOfWeek: 6, startTime: "06:00", endTime: "12:00", isAvailable: true },
  //     ],
  //     hourlyRate: 80,
  //   },
  // ];

  const { data: trainers } = api.trainers.getAllTrainers.useQuery();

  const allSpecializations = Array.from(
    new Set(trainers?.flatMap((t) => t.specialties))
  );

  const filteredTrainers = trainers?.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      trainer?.specialties.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayOfWeek];
  };

  const handleBookSession = (trainer: Trainer) => {
    navigate("/bookings");
    toast.success(`Redirecting to book a session with ${trainer.name}`);
  };

  const handleSendMessage = (trainer: Trainer) => {
    navigate(`/messages?trainer=${trainer.userID}`);
    toast.success(`Opening chat with ${trainer.name}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      <div className="mb-8">
        <h1 className="text-heading mb-2 text-accent">Our Trainers</h1>
        <p className="text-muted-foreground">
          Meet our certified fitness professionals ready to guide your journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search trainers or specializations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedSpecialization === "all" ? "default" : "outline"}
            onClick={() => setSelectedSpecialization("all")}
          >
            All
          </Button>
          {allSpecializations.map((spec) => (
            <Button
              key={spec}
              size="sm"
              variant={selectedSpecialization === spec ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(spec)}
            >
              {spec}
            </Button>
          ))}
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainers?.map((trainer) => (
          <Card
            key={trainer.trainerID}
            className="group cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => setSelectedTrainer(trainer)}
          >
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary">
                  {trainer.imageUrl ? (
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {trainer.rating}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trainer.rating} reviews
                  </p>
                </div>
              </div>
              <CardTitle>{trainer.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {trainer.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {trainer.specialties.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {trainer.experience} years exp.
                </span>
                <span className="font-bold text-accent">
                  ${trainer.fees}/hr
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainers?.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            No trainers found matching your criteria
          </p>
        </div>
      )}

      {/* Trainer Detail Modal */}
      <Dialog
        open={!!selectedTrainer}
        onOpenChange={() => setSelectedTrainer(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedTrainer && (
            <>
              <DialogHeader>
                <div className="mb-4 flex items-start gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                    {selectedTrainer.imageUrl ? (
                      <img
                        src={selectedTrainer.imageUrl}
                        alt={selectedTrainer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">
                      {selectedTrainer.name}
                    </DialogTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">
                          {selectedTrainer.rating}
                        </span>
                        <span className="text-muted-foreground">
                          ({selectedTrainer.rating} reviews)
                        </span>
                      </div>
                    </div>
                    <DialogDescription className="mt-2">
                      {selectedTrainer.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Specializations */}
                <div>
                  <h3 className="mb-2 font-semibold">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <Award className="h-5 w-5 text-accent" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <Calendar className="h-5 w-5 text-accent" />
                    Availability
                  </h3>
                  {/* <div className="grid gap-2 sm:grid-cols-2">
                    {selectedTrainer.availability.map((slot, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-gradient-card p-3"
                      >
                        <div className="font-medium">
                          {getDayName(slot.dayOfWeek)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>

                {/* Pricing & Experience */}
                <div className="rounded-lg border bg-secondary/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">
                      {selectedTrainer.experience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Hourly Rate:
                    </span>
                    <span className="text-xl font-bold text-accent">
                      ${selectedTrainer.fees}/hr
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookSession(selectedTrainer)}
                    className="flex-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Session
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendMessage(selectedTrainer)}
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainersView;
