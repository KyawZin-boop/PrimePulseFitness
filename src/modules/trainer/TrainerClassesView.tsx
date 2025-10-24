import api from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { Users, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrainerClassesView = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const { data: myClasses } = api.classes.getClassesByTrainerId.useQuery(trainerId, {
    enabled: Boolean(trainerId),
  });

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
        {myClasses && myClasses.map((gymClass) => (
          <Card
            key={gymClass.classID}
            className="cursor-pointer shadow-card transition hover:shadow-athletic"
            onClick={() => navigate(`/trainer/classes/${gymClass.classID}`)}
          >
            <CardHeader>
              <CardTitle>{gymClass.className}</CardTitle>
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
                    {gymClass.assignedCount}/{gymClass.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </span>
                  <span className="font-medium text-xs">
                    {gymClass.time}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{
                      width: `${(gymClass.assignedCount / gymClass.capacity) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground text-center">
                  {Math.round((gymClass.assignedCount / gymClass.capacity) * 100)}%
                  full
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation();
                navigate(`/trainer/classes/${gymClass.classID}/roster`);
              }}>
                <BookOpen className="mr-2 h-4 w-4" />
                View Roster
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {myClasses?.length === 0 && (
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
