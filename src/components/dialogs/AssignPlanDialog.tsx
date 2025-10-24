import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import type { Plan } from "@/api/plan/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssignPlanDialogProps = {
  plan: Plan;
  trigger?: ReactNode;
  disabled?: boolean;
};

const AssignPlanDialog = ({ plan, trigger, disabled }: AssignPlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["getPlanByTrainerId", plan.trainerID],
    });
    queryClient.invalidateQueries({
      queryKey: ["getClient", plan.trainerID],
    });
  };

  const clientsQuery = api.trainers.getClient.useQuery(plan.trainerID, {
    enabled: open && Boolean(plan.trainerID),
  });

  const assignPlanMutation = api.plan.assignPlan.useMutation({
    onSuccess: () => {
      toast.success("Plan assigned to client");
      invalidateQueries();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to assign plan");
    },
  });

  const { mutate: assignPlan, isPending: isAssigning, reset: resetAssignPlan } =
    assignPlanMutation;

  useEffect(() => {
    if (!open) {
      setSelectedClientId("");
      resetAssignPlan();
    }
  }, [open, resetAssignPlan]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      setOpen(false);
      return;
    }
    setOpen(nextOpen);
  };

  const handleAssign = () => {
    if (!selectedClientId) {
      toast.error("Select a client to assign this plan.");
      return;
    }

    const client = clientsQuery.data?.find(
      (candidate) => candidate.clientID === selectedClientId
    );

    if (!client?.userID) {
      toast.error("Unable to resolve the selected client's account.");
      return;
    }

    assignPlan({
      planId: plan.planID,
      userId: client.userID,
    });
  };

  const renderClientSelection = () => {
    if (clientsQuery.isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading clients...
        </div>
      );
    }

    if (clientsQuery.isError) {
      return (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-destructive">
            We couldn’t load your clients. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clientsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (!clientsQuery.data?.length) {
      return (
        <p className="text-sm text-muted-foreground">
          No clients available yet. Once clients are assigned to you, you can
          assign this plan to them.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clientsQuery.data.map((client) => (
                <SelectItem key={client.clientID} value={client.clientID}>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClientId && (
          <SelectedClientDetails
            client={clientsQuery.data.find(
              (candidate) => candidate.clientID === selectedClientId
            )}
          />
        )}
      </div>
    );
  };

  const triggerNode = trigger ?? (
    <Button variant="outline" className="flex-1" size="sm" disabled={disabled}>
      Assign to Client
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerNode}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign {plan.planName}</DialogTitle>
          <DialogDescription>
            Choose a client to assign this plan to. They will see it in their
            dashboard.
          </DialogDescription>
        </DialogHeader>

        {renderClientSelection()}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              isAssigning ||
              !clientsQuery.data?.length ||
              !selectedClientId
            }
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type SelectedClientDetailsProps = {
  client?: Client;
};

const SelectedClientDetails = ({ client }: SelectedClientDetailsProps) => {
  if (!client) {
    return null;
  }

  const subtitle = client.assignedDietPlan
    ? `Current plan: ${client.assignedDietPlan}`
    : "No plan assigned yet.";

  return (
    <div className="rounded-md border bg-secondary/30 p-3 text-sm">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <Users className="h-3 w-3" />
        Selected Client
      </div>
      <div className="mt-2 space-y-1">
        <p className="font-semibold">{client.name}</p>
        <p className="text-xs text-muted-foreground">{client.email}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export { AssignPlanDialog };
