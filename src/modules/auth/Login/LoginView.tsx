import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import bgPhoto from "@/assets/bg3.png";
import { Dumbbell } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  // rememberMe: z.boolean().optional(),
});

const LoginView = () => {
  const navigate = useNavigate();
  const { userLogin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      // rememberMe: false,
    },
  });

  const { mutate: googleLogin, isPending: googleLoginPending } =
    api.auth.googleLoginMutation.useMutation({
      onSuccess: (data: string) => {
        userLogin(data);
        navigate(-1);
        toast.success("Login successful!");
      },

      onError: () => {
        toast.error("Login failed! Please try again.");
      },
    });

  const { mutate: login, isPending: loginPending } =
    api.auth.loginMutation.useMutation({
      onSuccess: (data: any) => {
        if(data.status == 0){
          userLogin(data.data);
          navigate("/");
          toast.success("Login successful!");
        }else{
          toast.error("Login failed! Please try again.");
        }
      },

      onError: () => {
        toast.error("Login failed! Please try again.");
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

  return (
    <div className="w-full h-full flex justify-center items-center"
    style={{
        backgroundImage: `url('${bgPhoto}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="w-full max-w-md relative z-10">
        <Card className=" bg-white/15 backdrop-blur-xl border-white/30 shadow-2xl rounded-xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <Dumbbell className="h-8 w-8 text-accent" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-heading text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-white text-base">
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
              <p className="text-white">Or</p>
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
                      <FormLabel className="text-lg font-light">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="placeholder:text-white/70"
                        />
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
                      <FormLabel className="text-lg font-light">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          {...field}
                          type="password"
                          className="placeholder:text-white/70"
                        />
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
                  disabled={googleLoginPending || loginPending}
                >
                  Submit
                </Button>

                {/* <FormField
                  control={form.control}
                  // name="rememberMe"
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
                /> */}
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
                className="text-accent underline hover:text-accent/80 cursor-pointer"
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
