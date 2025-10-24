import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getGymClassById, deleteClass } from "@/api/classes";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Users, Trash2, Edit2, Undo2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

const AdminClassDetailView = () => {
  const { classId } = useParams<{ classId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: gymClass } = getGymClassById.useQuery(classId || "");

  const deleteClassMutation = deleteClass.useMutation({
    onSuccess: () => {
      toast.success("Class deleted");
      queryClient.invalidateQueries({ queryKey: ["getAllClasses"] });
      navigate("/admin/classes");
    },
    onError: () => toast.error("Failed to delete class"),
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!gymClass) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-heading">Class not found</h2>
        <p className="text-muted-foreground">
          This class might have been removed.
        </p>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-heading">{gymClass.className}</h1>
          <p className="text-muted-foreground">{gymClass.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <Undo2 className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/classes")}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>About this class</CardTitle>
            <CardDescription>Full details for admins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBadge
                icon={<Clock className="h-4 w-4 text-accent" />}
                label="Duration"
                value={`${gymClass.duration} mins`}
              />
              <InfoBadge
                icon={<Users className="h-4 w-4 text-accent" />}
                label="Capacity"
                value={`${gymClass.capacity}`}
              />
              <InfoBadge
                icon={<Calendar className="h-4 w-4 text-accent" />}
                label="Schedule"
                value={gymClass.time}
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Highlights</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {gymClass.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Snapshot</CardTitle>
              <CardDescription>Quick info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <DetailRow label="Trainer" value={gymClass.trainerName} />
              <DetailRow label="Difficulty" value={gymClass.difficulty} />
              <DetailRow label="Rating" value={String(gymClass.rating)} />
              <DetailRow label="Price" value={`$${gymClass.price}`} />
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Delete dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteClassMutation.mutate(gymClass.classID)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoBadge = ({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) => (
  <div className="rounded-lg border border-border bg-card/80 p-4">
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

export default AdminClassDetailView;
