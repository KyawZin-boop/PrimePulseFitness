import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, User } from "lucide-react";

interface ProgressEntry {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  notes?: string;
  photos?: string[];
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

const TrainerClientProgressView = () => {
  // Mock progress entries - replace with API call
  const progressEntries: ProgressEntry[] = [
    {
      id: "1",
      clientId: "1",
      clientName: "Alex Johnson",
      clientPhoto: "https://i.pravatar.cc/150?img=1",
      date: new Date("2025-05-20"),
      weight: 82,
      bodyFat: 18.5,
      notes: "Excellent progress this week. Strength increasing consistently.",
      measurements: {
        chest: 102,
        waist: 85,
        arms: 38,
        thighs: 58,
      },
    },
    {
      id: "2",
      clientId: "2",
      clientName: "Sarah Williams",
      clientPhoto: "https://i.pravatar.cc/150?img=5",
      date: new Date("2025-05-19"),
      weight: 65,
      bodyFat: 22.3,
      notes: "Great cardio endurance. Ready to increase running distance.",
      measurements: {
        waist: 68,
        hips: 92,
      },
    },
    {
      id: "3",
      clientId: "3",
      clientName: "Mike Chen",
      clientPhoto: "https://i.pravatar.cc/150?img=12",
      date: new Date("2025-05-18"),
      weight: 78,
      bodyFat: 15.2,
      notes: "Muscle mass increasing. Nutrition plan working well.",
      measurements: {
        chest: 108,
        waist: 80,
        arms: 42,
        thighs: 62,
      },
    },
    {
      id: "4",
      clientId: "1",
      clientName: "Alex Johnson",
      clientPhoto: "https://i.pravatar.cc/150?img=1",
      date: new Date("2025-05-13"),
      weight: 83.5,
      bodyFat: 19.2,
      notes: "First week back after injury. Taking it slow.",
      measurements: {
        chest: 101,
        waist: 87,
        arms: 37,
        thighs: 57,
      },
    },
  ];

  const getWeightTrend = (clientId: string) => {
    const clientEntries = progressEntries
      .filter((e) => e.clientId === clientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (clientEntries.length < 2) return null;

    const latest = clientEntries[0].weight;
    const previous = clientEntries[1].weight;
    const diff = latest - previous;

    if (Math.abs(diff) < 0.1) return { trend: "stable", diff };
    return { trend: diff < 0 ? "down" : "up", diff };
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-heading mb-2">Client Progress</h1>
        <p className="text-muted-foreground">
          Track and review your clients' progress over time
        </p>
      </div>

      <div className="space-y-6">
        {progressEntries.map((entry) => {
          const trend = getWeightTrend(entry.clientId);

          return (
            <Card key={entry.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-secondary">
                      {entry.clientPhoto ? (
                        <img
                          src={entry.clientPhoto}
                          alt={entry.clientName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle>{entry.clientName}</CardTitle>
                      <CardDescription>
                        {entry.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                  </div>

                  {trend && (
                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                        trend.trend === "down"
                          ? "bg-green-500/10 text-green-600"
                          : trend.trend === "up"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {trend.trend === "down" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : trend.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      {Math.abs(trend.diff).toFixed(1)}kg
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                  <div className="rounded-lg bg-gradient-card p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Weight
                    </div>
                    <div className="text-2xl font-bold">{entry.weight} kg</div>
                  </div>

                  {entry.bodyFat && (
                    <div className="rounded-lg bg-gradient-card p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Body Fat
                      </div>
                      <div className="text-2xl font-bold">
                        {entry.bodyFat}%
                      </div>
                    </div>
                  )}
                </div>

                {entry.measurements && (
                  <div className="mb-4 rounded-lg border bg-secondary/30 p-4">
                    <div className="text-sm font-semibold mb-3">
                      Measurements (cm)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {entry.measurements.chest && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Chest
                          </div>
                          <div className="font-semibold">
                            {entry.measurements.chest}
                          </div>
                        </div>
                      )}
                      {entry.measurements.waist && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Waist
                          </div>
                          <div className="font-semibold">
                            {entry.measurements.waist}
                          </div>
                        </div>
                      )}
                      {entry.measurements.hips && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Hips
                          </div>
                          <div className="font-semibold">
                            {entry.measurements.hips}
                          </div>
                        </div>
                      )}
                      {entry.measurements.arms && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Arms
                          </div>
                          <div className="font-semibold">
                            {entry.measurements.arms}
                          </div>
                        </div>
                      )}
                      {entry.measurements.thighs && (
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Thighs
                          </div>
                          <div className="font-semibold">
                            {entry.measurements.thighs}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <div className="mb-4 rounded-lg border bg-gradient-card p-4">
                    <div className="text-sm font-semibold mb-2">
                      Trainer Notes
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.notes}
                    </p>
                  </div>
                )}

                <Button variant="outline" size="sm">
                  View Full History
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {progressEntries.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-semibold mb-2">No Progress Entries Yet</h3>
            <p className="text-muted-foreground text-center">
              Progress entries will appear here as clients track their data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainerClientProgressView;
