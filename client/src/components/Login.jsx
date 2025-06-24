import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useEffect, useState } from "react";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import ForgotPassword from "./ForgotPassword"

function Login() {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSucess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSucess,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate();

  const inputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleFormSubmit = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSucess && registerData) {
      toast.success(registerData?.message || "Signup successful.");
      navigate("/auth/verify-otp", { state: { email: signupInput.email } });
    }
    if (registerError) {
      // toast.error(registerError.data.details[0].message || "Signup Failed");
      toast.error(registerError?.data?.message || "Signup Failed");
    }
    if (loginIsSucess && loginData) {
      // toast.success(loginData.message || "Login successful.")
      toast.success(loginData?.message || "Login successful.");
      localStorage.setItem("token", loginData.token);

      navigate("/admin/dashboard");
    }
    if (loginError) {
      // toast.error(loginError.data.details[0].message || "login Failed");
      toast.error(loginError?.data?.message || "Login Failed");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <section className="flex items-center w-full justify-center my-24 md:px-10 px-4 min-h-[75vh]">
      <Tabs defaultValue="login" className="w-[450px]">
        {/* <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login" >Login</TabsTrigger>
        </TabsList> */}

        {/* Signup */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => inputHandler(e, "signup")}
                  placeholder="Enter Your Name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => inputHandler(e, "signup")}
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => inputHandler(e, "signup")}
                  placeholder="Enter your Password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleFormSubmit("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin"></Loader2>
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => inputHandler(e, "login")}
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => inputHandler(e, "login")}
                  placeholder="Enter your Password"
                  required
                />
              </div>
              {/* <Label>
                Forgot Password? <Link to={"forgotpassword"}>Reset Now</Link>
              </Label> */}
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleFormSubmit("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin"></Loader2>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
export default Login;
