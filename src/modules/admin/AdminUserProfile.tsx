import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById, suspendUser, activateUser } from "@/api/user";
import { 
  Mail, 
  Calendar, 
  User as UserIcon, 
  CreditCard, 
  Dumbbell, 
  Utensils, 
  CheckCircle, 
  XCircle,
  Loader2,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminUserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = getUserById.useQuery(userId ?? "");
  const user = userQuery.data;

  const suspendMutation = suspendUser.useMutation({
    onSuccess: () => {
      toast.success("User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserById", userId] });
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const activateMutation = activateUser.useMutation({
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["getUserById", userId] });
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const handleStatusToggle = () => {
    if (!user || !userId) return;
    
    if (user.activeFlag) {
      suspendMutation.mutate(userId);
    } else {
      activateMutation.mutate(userId);
    }
  };

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-heading">User Profile</h1>
          <p className="text-muted-foreground">
            View detailed user information and account status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      {userQuery.isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-2">Loading user profile...</span>
        </div>
      )}

      {userQuery.isError && (
        <Card className="shadow-card">
          <CardContent className="py-8">
            <div className="text-center text-destructive">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>Failed to load user profile. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {user && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Profile Card */}
          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {user.activeFlag ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Suspend User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to suspend {user.name}? They will not be able to access the platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleStatusToggle}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={suspendMutation.isPending}
                        >
                          {suspendMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Suspend
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 hover:text-green-700"
                    onClick={handleStatusToggle}
                    disabled={activateMutation.isPending}
                  >
                    {activateMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Activate User
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                    <AvatarFallback className="bg-accent text-white text-2xl font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <Badge
                        variant={user.activeFlag ? "default" : "secondary"}
                        className={user.activeFlag ? "bg-green-500" : "bg-gray-500"}
                      >
                        {user.activeFlag ? "Active" : "Suspended"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <UserIcon className="h-4 w-4" />
                      <span>User ID</span>
                    </div>
                    <div className="font-mono text-sm">{user.userID}</div>
                  </div>
                  
                  {user.age && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Age</span>
                      </div>
                      <div className="font-medium">{user.age} years</div>
                    </div>
                  )}
                  
                  {user.gender && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Gender</div>
                      <div className="font-medium capitalize">{user.gender}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Member Since</span>
                    </div>
                    <div className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                    <div className="font-medium">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Plans */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center gap-1">
                      {user.subscriptionStatus ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-gray-500">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {user.subscriptionPlan && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                        {user.subscriptionPlan}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Workout Plans Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Workout Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.assignedWorkoutPlan.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      {user.assignedWorkoutPlan.length} plan{user.assignedWorkoutPlan.length > 1 ? 's' : ''} assigned
                    </p>
                    <div className="space-y-1">
                      {user.assignedWorkoutPlan.map((planId, index) => (
                        <div key={planId} className="text-sm px-2 py-1 bg-gray-100 rounded">
                          Plan #{index + 1}: {planId}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No workout plans assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Diet Plans Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Diet Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.assignedDietPlan.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      {user.assignedDietPlan.length} plan{user.assignedDietPlan.length > 1 ? 's' : ''} assigned
                    </p>
                    <div className="space-y-1">
                      {user.assignedDietPlan.map((planId, index) => (
                        <div key={planId} className="text-sm px-2 py-1 bg-gray-100 rounded">
                          Plan #{index + 1}: {planId}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No diet plans assigned</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserProfile;
