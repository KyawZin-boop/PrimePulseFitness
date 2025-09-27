import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HomeView = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Button onClick={() => toast.success("Success")}>Toast</Button>
    </div>
  );
};

export default HomeView;
