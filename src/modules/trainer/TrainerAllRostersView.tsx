import { useNavigate } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";

const TrainerAllRostersView = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();

  // Get trainer data
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Get trainer's classes
  const { data: trainerClasses } = api.classes.getClassesByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  // Get all bookings
  const { data: bookings } = api.bookings.getBookingsByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const getClassStats = (classId: string) => {
    if (!bookings) return { enrolled: 0, pending: 0 };
    const classBookings = bookings.filter((b) => b.classID === classId);
    return {
      enrolled: classBookings.filter((b) => b.status === "Approved").length,
      pending: classBookings.filter((b) => b.status === "Pending").length,
    };
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/trainer/classes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
        <h1 className="text-heading mb-2">All Class Rosters</h1>
        <p className="text-muted-foreground">
          View enrollment for all your classes
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6">
        {trainerClasses && trainerClasses.length > 0 ? (
          trainerClasses.map((classItem) => {
            const stats = getClassStats(classItem.classID);
            const fillPercentage = (stats.enrolled / classItem.capacity) * 100;

            return (
              <Card key={classItem.classID} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{classItem.className}</CardTitle>
                      <CardDescription className="mt-1">
                        {classItem.description}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/trainer/classes/${classItem.classID}/roster`)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Roster
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Schedule</p>
                        <p className="text-xs text-muted-foreground">
                          {classItem.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-xs text-muted-foreground">
                          {classItem.duration} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Enrolled</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.enrolled}/{classItem.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                        <Users className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-xs text-muted-foreground">
                          {stats.pending}
                          {stats.pending > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-yellow-500/10 text-yellow-500"
                            >
                              !
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Capacity</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(fillPercentage)}% full
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
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
    </div>
  );
};

export default TrainerAllRostersView;
