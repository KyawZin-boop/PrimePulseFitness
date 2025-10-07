import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGymClassById } from "@/constants/classes";
import { Calendar, Clock, DollarSign, MapPin, Undo2, Users } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClassSession } from "@/types";
import { toast } from "sonner";
import api from "@/api";

const ClassDetailView = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const { data: gymClass } = api.classes.getGymClassById.useQuery(classId || "");

  // Mock available sessions - replace with API call
  // const availableSessions: ClassSession[] = useMemo(() => [
  //   {
  //     id: "session-1",
  //     classId: classId || "1",
  //     className: gymClass?.name || "",
  //     trainerId: "trainer-1",
  //     trainerName: gymClass?.instructor || "",
  //     date: new Date("2025-11-06"),
  //     startTime: "09:00",
  //     endTime: "10:00",
  //     duration: 60,
  //     maxCapacity: 15,
  //     currentBookings: 3,
  //     isFree: true,
  //     price: 0,
  //     location: "Studio A",
  //   },
  //   {
  //     id: "session-2",
  //     classId: classId || "1",
  //     className: gymClass?.name || "",
  //     trainerId: "trainer-1",
  //     trainerName: gymClass?.instructor || "",
  //     date: new Date("2025-11-07"),
  //     startTime: "18:00",
  //     endTime: "19:00",
  //     duration: 60,
  //     maxCapacity: 10,
  //     currentBookings: 7,
  //     isFree: false,
  //     price: 35,
  //     location: "Studio A",
  //   },
  //   {
  //     id: "session-3",
  //     classId: classId || "1",
  //     className: gymClass?.name || "",
  //     trainerId: "trainer-1",
  //     trainerName: gymClass?.instructor || "",
  //     date: new Date("2025-11-08"),
  //     startTime: "10:00",
  //     endTime: "11:00",
  //     duration: 60,
  //     maxCapacity: 10,
  //     currentBookings: 4,
  //     isFree: false,
  //     price: 35,
  //     location: "Studio B",
  //   },
  // ], [classId, gymClass]);

  // const handleBookSession = (session: ClassSession) => {
  //   // Navigate to booking page with pre-selected session
  //   navigate("/bookings");
  //   toast.success(`Booking ${session.isFree ? "free" : "private"} session!`);
  // };

  if (!gymClass) {
    return (
      <div className="container mx-auto flex pt-24 min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-heading">Class not found</h1>
        <p className="max-w-lg text-muted-foreground">
          The class you are looking for is no longer available or the link may be incorrect. Please return to the classes overview and try again.
        </p>
        <Button size="lg" onClick={() => navigate("/classes", { replace: true })}>
          Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-background py-16 pt-24">
      <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-0 text-muted-foreground transition hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <Undo2 className="h-4 w-4" />
            Back to schedule
          </Button>

          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold">
                    {gymClass.className}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {gymClass.description}
                  </CardDescription>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Led by {gymClass.trainerName}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoBadge icon={<Clock className="h-4 w-4 text-accent" />} label="Duration" value={gymClass.duration} />
                <InfoBadge icon={<Users className="h-4 w-4 text-accent" />} label="Capacity" value={gymClass.capacity} />
                <InfoBadge icon={<Calendar className="h-4 w-4 text-accent" />} label="Schedule" value={gymClass.time} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">What to expect</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {gymClass.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1" variant="athletic">
                  Reserve your spot
                </Button>
                <Button
                  size="lg"
                  variant="outline_athletic"
                  className="flex-1"
                  onClick={() => navigate("/classes", { replace: true })}
                >
                  View all classes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Sessions */}
          {/* <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Available Sessions
              </CardTitle>
              <CardDescription>
                Choose between free tutorial sessions or private paid classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                  <div
                    key={gymClass.classID}
                    className="rounded-lg border bg-gradient-card p-4 transition hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {gymClass.startDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </h4>
                          {session.isFree && (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                              FREE TUTORIAL
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <div className="text-right">
                        {session.isFree ? (
                          <span className="text-lg font-bold text-green-500">FREE</span>
                        ) : (
                          <div>
                            <div className="text-xs text-muted-foreground">Private Class</div>
                            <div className="text-lg font-bold text-accent">${session.price}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                         {gymClass.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {session.isFree ? "No payment" : "Paid session"}
                      </div>
                    </div>

                    <Button
                      // onClick={() => handleBookSession(session)}
                      className="w-full"
                      variant="outline"
                    >
                      Book Private Class
                    </Button>
                  </div>
            </CardContent>
          </Card> */}
        </div>

        <aside className="space-y-6">
          <Card className="border-primary/10 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Class Snapshot</CardTitle>
              <CardDescription>
                Quick details so you know exactly how to prepare.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <DetailRow label="Intensity" value={gymClass.difficulty} />
              <DetailRow
                label="Instructor"
                value={`${gymClass.trainerName} · ★ ${gymClass.rating.toFixed(1)}`}
              />
              <DetailRow label="Duration" value={gymClass.duration} />
              <DetailRow label="Capacity" value={gymClass.capacity} />
              <DetailRow label="Schedule" value={gymClass.time} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
};

const InfoBadge = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-border bg-card/80 p-4 shadow-card transition hover:shadow-athletic">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="text-base text-foreground">{value}</p>
  </div>
);

export default ClassDetailView;
