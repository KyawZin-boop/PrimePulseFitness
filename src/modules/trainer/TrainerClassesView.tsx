import api from "@/api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import {
  Users,
  Calendar,
  BookOpen,
  Video,
  Upload,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";

const TrainerClassesView = () => {
  const navigate = useNavigate();
  const { userCredentials } = useAuth();
  const userId = userCredentials?.userId ?? "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const { data: trainer } = api.trainers.getTrainerData.useQuery(userId, {
    enabled: Boolean(userId),
  });
  const trainerId = trainer?.trainerID ?? "";

  const { data: myClasses, refetch } =
    api.classes.getClassesByTrainerId.useQuery(trainerId, {
      enabled: Boolean(trainerId),
    });

  const uploadFileMutation = api.files.uploadFile.useMutation();
  const addTutorialMutation = api.tutorial.AddTutorial.useMutation({
    onSuccess: () => {
      toast.success("Tutorial video uploaded successfully!");
      refetch();
      setShowVideoDialog(false);
      setSelectedClass(null);
    },
    onError: () => {
      toast.error("Failed to upload tutorial video");
    },
  });

  const deleteTutorialMutation = api.tutorial.DeleteTutorial.useMutation({
    onSuccess: () => {
      toast.success("Tutorial video deleted successfully!");
      refetch();
      setShowVideoDialog(false);
      setSelectedClass(null);
    },
    onError: () => {
      toast.error("Failed to delete tutorial video");
    },
  });

  const handleVideoManage = (gymClass: GymClass, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClass(gymClass);
    setShowVideoDialog(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("Video file is too large. Maximum size is 100MB");
      return;
    }

    setUploadingVideo(true);
    try {
      // First upload the video file
      const videoUrl = await uploadFileMutation.mutateAsync(file);

      // Then add tutorial with the video URL
      if (selectedClass && trainerId) {
        await addTutorialMutation.mutateAsync({
          classID: selectedClass.classID,
          trainerID: trainerId,
          videoUrl: videoUrl,
        });
      }
    } catch (error) {
      toast.error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleVideoDelete = async () => {
    if (!selectedClass || !trainerId) return;

    try {
      await deleteTutorialMutation.mutateAsync({
        classId: selectedClass.classID,
        trainerId: trainerId,
      });
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-wrap gap-3 items-center justify-between">
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
        {myClasses &&
          myClasses.map((gymClass) => (
            <Card
              key={gymClass.classID}
              className="cursor-pointer shadow-card transition hover:shadow-athletic"
              onClick={() =>
                navigate(`/trainer/classes/${gymClass.classID}/roster`)
              }
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
                    <span className="font-medium text-xs">{gymClass.time}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${
                          (gymClass.assignedCount / gymClass.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-center">
                    {Math.round(
                      (gymClass.assignedCount / gymClass.capacity) * 100
                    )}
                    % full
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trainer/classes/${gymClass.classID}/roster`);
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Roster
                </Button>

                <Button
                  variant={gymClass.videoUrl ? "secondary" : "outline"}
                  className="w-full"
                  onClick={(e) => handleVideoManage(gymClass, e)}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {gymClass.videoUrl ? "Manage Tutorial" : "Add Tutorial"}
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

      {/* Video Management Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Tutorial Video - {selectedClass?.className}
            </DialogTitle>
            <DialogDescription>
              Upload or manage the tutorial video for this class
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedClass?.videoUrl ? (
              <div className="space-y-4">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full"
                    src={selectedClass.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      uploadingVideo ||
                      addTutorialMutation.isPending ||
                      deleteTutorialMutation.isPending
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Replace Video
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleVideoDelete}
                    disabled={
                      uploadingVideo ||
                      addTutorialMutation.isPending ||
                      deleteTutorialMutation.isPending
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No tutorial video uploaded yet
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingVideo}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Supported formats: MP4, MOV, AVI • Max size: 100MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerClassesView;
