import React, { useEffect, useState } from "react";
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsList } from "../../components/ui/tabs";
import { TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../../utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import Loader from "../../components/Loader"; // Import Loader component

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password should be same.");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setIsLoading(true); // Show loader
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        toast.success("Successfully Logged in");
        if (res.data.user.id) {
          setUserInfo(res.data.user);
          if (res.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error(
          "Error Response:",
          error.response?.data?.message || error.message
        );

        toast.error(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      setIsLoading(true); // Show loader
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (res.status === 201) {
          setUserInfo(res.data.user);
          navigate("/profile");
        }
        toast.success("Successfully Registered");
      } catch (error) {
        console.error(error);
        toast.error("Failed to sign up.");
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (activeTab === "login") {
        handleLogin();
      } else if (activeTab === "signup") {
        handleSignup();
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center px-4 sm:px-8">
      {isLoading ? ( // Conditionally render Loader
        <Loader />
      ) : (
        <div className="h-[80vh] bg-white border-2 text-opacity-90 shadow-2xl border-gray-200 w-full sm:w-[90vw] md:w-[70vw] lg:w-[60vw] rounded-3xl grid grid-cols-1 xl:grid-cols-2">
          <div className="flex flex-col gap-6 sm:gap-10 items-center justify-center p-4 sm:p-6">
            <div className="flex items-center justify-center flex-col">
              <div>
                <Logo />
              </div>
              <div className="flex justify-center items-center">
                <h1 className="text-3xl sm:text-4xl font-bold md:text-5xl">
                  Welcome
                </h1>
                <img
                  src={Victory}
                  alt="Victory Emoji"
                  className="h-[60px] sm:h-[80px] md:h-[90px]"
                />
              </div>
              <p className="font-medium text-sm sm:text-lg text-center px-2">
                Fill in the details to get started with{" "}
                <span className="merienda-medium text-purple-700">
                  Twilight
                </span>{" "}
                chat app!
              </p>
              <p className="caveat-medium text-lg sm:text-2xl pt-2">
                Where Naba wants to talk to his friends :)
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Tabs className="w-full sm:w-3/4" defaultValue="login">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-2 sm:p-3 transition-all duration-300"
                    value="login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-2 sm:p-3 transition-all duration-300"
                    value="signup"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="login"
                  className="flex flex-col gap-3 sm:gap-5 mt-6 sm:mt-10"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-3 sm:p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-3 sm:p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    className="rounded-full p-3 sm:p-6"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </TabsContent>
                <TabsContent
                  value="signup"
                  className="flex flex-col gap-3 sm:gap-5 mt-6 sm:mt-10"
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-center">
                    Create an Account
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 text-center px-2">
                    Join us today to explore exciting features!
                  </p>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    className="rounded-full p-3 sm:p-6 border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Input
                    placeholder="Create a password"
                    type="password"
                    className="rounded-full p-3 sm:p-6 border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    className="rounded-full p-3 sm:p-6 border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    className="rounded-full p-3 sm:p-6 bg-purple-500 hover:bg-purple-600 text-white transition duration-300"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                    By signing up, you agree to our{" "}
                    <span className="text-purple-600 cursor-pointer hover:underline">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-purple-600 cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="hidden xl:flex justify-center items-center">
            <img
              src={Background}
              alt="Background Login"
              className="h-[50vh] sm:h-[60vh] md:h-[70vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;

const Logo = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <div className="relative  w-[100px] h-[72px] overflow-hidden">
        <svg
          id="logo-38"
          width="100"
          height="72"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className={`transform transition-transform duration-700 ease-out ${
              isLoaded ? "translate-x-0" : "-translate-x-32"
            }`}
            fill="#8338ec"
          />
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className={`transform transition-transform duration-700 ease-out delay-100 ${
              isLoaded ? "translate-x-0" : "-translate-x-32"
            }`}
            fill="#975aed"
          />
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className={`transform transition-transform duration-700 ease-out delay-200 ${
              isLoaded ? "translate-x-0" : "-translate-x-32"
            }`}
            fill="#a16ee8"
          />
        </svg>
      </div>
      <span
        className={`merienda-medium text-4xl md:text-6xl text-purple-600 transform transition-all duration-700 delay-300 ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
        }`}
      >
        Twilight
      </span>
    </div>
  );
};
