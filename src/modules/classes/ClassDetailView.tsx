import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getGymClassById } from "@/constants/classes";
import { Calendar, Clock, Undo2, Users } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ClassDetailView = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();

  const gymClass = useMemo(() => {
    if (!classId) return undefined;
    return getGymClassById(classId);
  }, [classId]);

  if (!gymClass) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-heading">Class not found</h1>
        <p className="max-w-lg text-muted-foreground">
          The class you are looking for is no longer available or the link may be incorrect. Please return to the classes overview and try again.
        </p>
        <Button size="lg" onClick={() => navigate("/", { replace: true })}>
          Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <section className="bg-background py-16">
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
                    {gymClass.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {gymClass.description}
                  </CardDescription>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Led by {gymClass.instructor}
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
                  onClick={() => navigate("/", { replace: true })}
                >
                  View all classes
                </Button>
              </div>
            </CardContent>
          </Card>
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
                value={`${gymClass.instructor} · ★ ${gymClass.rating.toFixed(1)}`}
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
