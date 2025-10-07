import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GymClass {
  id: string;
  name: string;
  description: string;
  enrolledStudents: number;
  capacity: number;
  schedule: string;
  upcomingSessions: number;
}

const TrainerClassesView = () => {
  const navigate = useNavigate();

  // Mock data - replace with API call
  const myClasses: GymClass[] = [
    {
      id: "1",
      name: "Strength Forge",
      description: "Advanced strength training and powerlifting techniques",
      enrolledStudents: 24,
      capacity: 30,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      upcomingSessions: 6,
    },
    {
      id: "2",
      name: "Cardio Surge",
      description: "High-intensity cardio workouts for endurance",
      enrolledStudents: 18,
      capacity: 20,
      schedule: "Tue, Thu - 2:00 PM",
      upcomingSessions: 4,
    },
    {
      id: "3",
      name: "Mind & Body Reset",
      description: "Yoga and mindfulness for holistic wellness",
      enrolledStudents: 15,
      capacity: 15,
      schedule: "Sat - 10:00 AM",
      upcomingSessions: 2,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">My Classes</h1>
          <p className="text-muted-foreground">
            Classes you're teaching at PrimePulse Fitness
          </p>
        </div>
        <Button onClick={() => navigate("/trainer/classes/roster")}>
          View All Rosters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myClasses.map((gymClass) => (
          <Card
            key={gymClass.id}
            className="cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => navigate(`/trainer/classes/${gymClass.id}`)}
          >
            <CardHeader>
              <CardTitle>{gymClass.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {gymClass.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Students
                  </span>
                  <span className="font-medium">
                    {gymClass.enrolledStudents}/{gymClass.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </span>
                  <span className="font-medium text-xs">
                    {gymClass.schedule}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Upcoming
                  </span>
                  <span className="font-medium">
                    {gymClass.upcomingSessions} sessions
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${(gymClass.enrolledStudents / gymClass.capacity) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground text-center">
                  {Math.round((gymClass.enrolledStudents / gymClass.capacity) * 100)}%
                  full
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation();
                navigate(`/trainer/classes/${gymClass.id}/roster`);
              }}>
                <BookOpen className="mr-2 h-4 w-4" />
                View Roster
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {myClasses.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't been assigned to any classes yet.
            </p>
            <Button onClick={() => navigate("/trainer/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerClassesView;
