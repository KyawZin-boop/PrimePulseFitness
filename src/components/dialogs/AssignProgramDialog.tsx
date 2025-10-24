import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import type { Program } from "@/api/program/type";
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

type AssignProgramDialogProps = {
  program: Program;
  trigger?: ReactNode;
  disabled?: boolean;
};

const AssignProgramDialog = ({ program, trigger, disabled }: AssignProgramDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const queryClient = useQueryClient();

  const clientsQuery = api.trainers.getClient.useQuery(program.trainerID, {
    enabled: open && Boolean(program.trainerID),
  });

  const assignProgramMutation = api.program.assignProgram.useMutation({
    onSuccess: () => {
      toast.success("Program assigned to client");
      invalidateQueries();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error?.message ?? "Failed to assign program");
    },
  });

  const { mutate: assignProgram, isPending: isAssigning, reset } = assignProgramMutation;

  useEffect(() => {
    if (!open) {
      setSelectedClientId("");
      reset?.();
    }
  }, [open, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      setOpen(false);
      return;
    }
    setOpen(nextOpen);
  };

  const handleAssign = () => {
    if (!assignProgram) {
      toast.error("Assignment not available");
      return;
    }

    if (!selectedClientId) {
      toast.error("Select a client to assign this program.");
      return;
    }

    const client = clientsQuery.data?.find(
      (candidate) => candidate.clientID === selectedClientId
    );

    if (!client?.userID) {
      toast.error("Unable to resolve the selected client's account.");
      return;
    }

    assignProgram({
      planId: program.workoutPlanID,
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
          assign this program to them.
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
      </div>
    );
  };

  const triggerNode =
    trigger ?? (
      <Button variant="outline" className="flex-1" size="sm" disabled={disabled}>
        Assign to Client
      </Button>
    );

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["getProgramsByTrainerId", program.trainerID],
    });
    queryClient.invalidateQueries({
      queryKey: ["getClient", program.trainerID],
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerNode}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign {program.name}</DialogTitle>
          <DialogDescription>
            Choose a client to assign this program to. They will see it in their dashboard.
          </DialogDescription>
        </DialogHeader>

        {renderClientSelection()}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isAssigning}>
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
              "Assign Program"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AssignProgramDialog };
