import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  BACKEND_HOST,
  LOG_OUT_ROUTE,
} from "../../../../../../utils/constant.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client.js";
import { toast } from "sonner";
import Loader from "@/components/Loader.jsx";
import { useState } from "react";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logOut = async () => {
    setIsLoggingOut(true);
    try {
      const response = await apiClient.post(LOG_OUT_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Successfully Logged Out");
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="absolute bottom-0 flex items-center justify-evenly w-full bg-[#2a2b33] h-16">
        <div className="flex gap-4 mr-12 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 md:h-18 md:w-18 rounded-full overflow-hidden">
              {userInfo.image ? (
                <AvatarImage
                  src={userInfo.image}
                  alt="userProfile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 md:h-18 md:w-18 text-2xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    userInfo.color
                  )}`}
                >
                  {userInfo.firstName
                    ? userInfo.firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {userInfo.firstName && userInfo.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : ""}
          </div>
        </div>

        <div className="flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FiEdit2
                  className="text-purple-500 text-2xl font-medium"
                  onClick={() => navigate("/profile")}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IoPowerSharp
                  className="text-red-500 text-2xl font-medium"
                  onClick={logOut}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
