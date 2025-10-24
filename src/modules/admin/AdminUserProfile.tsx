import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/api/user";
import { Mail } from "lucide-react";

const AdminUserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const userQuery = getUserById.useQuery(userId ?? "");
  const user = userQuery.data;

  return (
    <div className="container mx-auto pt-20 pb-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-heading">User Profile</h1>
          <p className="text-muted-foreground">
            View user details and account status
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{user?.name ?? userId}</CardTitle>
        </CardHeader>
        <CardContent>
          {userQuery.isLoading && <div>Loading user...</div>}
          {userQuery.isError && (
            <div className="text-destructive">Failed to load user</div>
          )}

          {user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white text-lg font-semibold">
                  {(user.name ?? "").charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{user.name}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Contact</div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <div>{user.email}</div>
                  </div>
                  {/* phone not available on API User type */}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">{user.role ?? "user"}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Joined</div>
                <div className="font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserProfile;
