import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Router from "@/router/Router";
import { Provider } from "react-redux";
import { store } from "@/store";

const Wrapper = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default Wrapper;
