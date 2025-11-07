import { useParams, useNavigate } from "react-router-dom";
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
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Video,
  Upload,
  Trash2,
  VideoOff,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

const TrainerClassRosterView = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { userCredentials } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Get trainer data
  const { data: trainerData } = api.trainers.getTrainerData.useQuery(
    userCredentials?.userId || "",
    { enabled: !!userCredentials?.userId }
  );

  // Get class details
  const { data: classDetails, refetch: refetchClass } = api.classes.getGymClassById.useQuery(
    classId || ""
  );

  // Get bookings for this class
  const { data: bookings } = api.bookings.getBookingsByTrainerId.useQuery(
    trainerData?.trainerID || "",
    { enabled: !!trainerData?.trainerID }
  );

  const uploadFileMutation = api.files.uploadFile.useMutation();
  const addTutorialMutation = api.tutorial.AddTutorial.useMutation({
    onSuccess: () => {
      toast.success("Tutorial video uploaded successfully!");
      refetchClass();
    },
    onError: () => {
      toast.error("Failed to upload tutorial video");
    },
  });

  const deleteTutorialMutation = api.tutorial.DeleteTutorial.useMutation({
    onSuccess: () => {
      toast.success("Tutorial video deleted successfully!");
      refetchClass();
    },
    onError: () => {
      toast.error("Failed to delete tutorial video");
    },
  });

  // Filter bookings for this specific class
  const classBookings = bookings?.filter((b) => b.classID === classId) || [];
  const approvedBookings = classBookings.filter((b) => b.status === "Approved");
  const pendingBookings = classBookings.filter((b) => b.status === "Pending");

  // Mutation for updating booking status
  const updateStatusMutation = api.trainers.updateBookingStatus.useMutation({
    onSuccess: (_, variables) => {
      const action = variables.status === "Approved" ? "approved" : "rejected";
      toast.success(`Booking ${action} successfully`);
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  const handleApprove = (bookingId: string) => {
    updateStatusMutation.mutate({ bookingId, status: "Approved" });
  };

  const handleReject = (bookingId: string) => {
    updateStatusMutation.mutate({ bookingId, status: "Rejected" });
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
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Video file is too large. Maximum size is 100MB");
      return;
    }

    setUploadingVideo(true);
    try {
      // First upload the video file
      const videoUrl = await uploadFileMutation.mutateAsync(file);

      // Then add tutorial with the video URL
      if (classDetails && trainerData) {
        await addTutorialMutation.mutateAsync({
          classID: classDetails.classID,
          trainerID: trainerData.trainerID,
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
    if (!classDetails || !trainerData) return;

    try {
      await deleteTutorialMutation.mutateAsync({
        classId: classDetails.classID,
        trainerId: trainerData.trainerID,
      });
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  if (!classDetails) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    );
  }

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading mb-2">{classDetails.className}</h1>
            <p className="text-muted-foreground">{classDetails.description}</p>
          </div>
          <Badge variant="outline" className="text-lg">
            {approvedBookings.length}/{classDetails.capacity}
          </Badge>
        </div>
      </div>

      {/* Class Info */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classDetails.time}</div>
            <p className="text-xs text-muted-foreground">
              {classDetails.duration} minutes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {classDetails.capacity - approvedBookings.length} spots left
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tutorial Video Section */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-accent" />
            Tutorial Video
          </CardTitle>
          <CardDescription>
            Upload a tutorial video to help students learn the class fundamentals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classDetails.videoUrl ? (
            <div className="space-y-4">
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  className="w-full h-full"
                  src={classDetails.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingVideo || addTutorialMutation.isPending || deleteTutorialMutation.isPending}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Replace Video
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleVideoDelete}
                  disabled={uploadingVideo || addTutorialMutation.isPending || deleteTutorialMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20">
                <VideoOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrolled Students */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Enrolled Students
            </CardTitle>
            <CardDescription>
              Students approved for this class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {approvedBookings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No enrolled students yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedBookings.map((booking) => (
                  <div
                    key={booking.bookingID}
                    className="flex items-center justify-between rounded-lg border bg-gradient-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{booking.userName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{booking.email}</span>
                        </div>
                        {booking.age && (
                          <p className="text-xs text-muted-foreground">
                            Age: {booking.age} • {booking.gender || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      Enrolled
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Requests
            </CardTitle>
            <CardDescription>Awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBookings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.bookingID}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                          <User className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.userName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{booking.email}</span>
                          </div>
                          {booking.age && (
                            <p className="text-xs text-muted-foreground">
                              Age: {booking.age} • {booking.gender || "N/A"}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApprove(booking.bookingID)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReject(booking.bookingID)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerClassRosterView;
