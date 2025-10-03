import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/api";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  rememberMe: z.boolean().optional(),
});

const LoginView = () => {
  const navigate = useNavigate();
  const { userLogin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate: googleLogin, isPending: googleLoginPending } =
    api.auth.googleLoginMutation.useMutation({
      onSuccess: (data: string) => {
        userLogin(data);
        navigate("/");
        toast.success("Login successful!");
      },

      onError: () => {
        toast.error("Login failed! Please try again.");
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-full h-full flex justify-center items-center bg-primary">
      <div className="w-full max-w-md relative z-10">
      <Card className="shadow-athletic bg-gradient-card border-0 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-accent">
              <div className="w-8 h-8 bg-accent-foreground rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-heading text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Transform your fitness journey with us
              </CardDescription>
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                googleLogin({
                  idToken: credentialResponse.credential || "",
                });
              }}
              onError={() => {
                toast.error("Google login failed! Please try again.");
              }}
            />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full flex items-center gap-4">
              <span className="flex-1 h-px bg-gray-300"></span>
              <p className="text-gray-500">Or</p>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-light">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <div className="h-[16px]">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-light">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Password" {...field} />
                      </FormControl>
                      <div className="h-[16px]">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={googleLoginPending}
                >
                  Submit
                </Button>

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-md font-normal">
                        Remember me next time
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* <div className="w-full flex items-center justify-center gap-1">
              <span>Forgot your password?</span>
              <span className="text-primary underline hover:text-primary/80 cursor-pointer">
                Click here to reset
              </span>
            </div> */}
            <div className="w-full flex items-center justify-center gap-1 mt-4">
              <span>Don't have an account?</span>
              <span
                className="text-primary underline hover:text-primary/80 cursor-pointer"
                onClick={() => navigate("/auth/register")}
              >
                Sign up here
              </span>
            </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default LoginView;
