import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Router from "@/router/Router";
import { Provider } from "react-redux";
import { store } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/hooks/useAuth";

const Wrapper = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationProvider>
              <Router />
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default Wrapper;
