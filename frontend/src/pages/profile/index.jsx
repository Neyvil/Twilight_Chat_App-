import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
  BACKEND_HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
} from "../../../utils/constant.js";
import Loader from "../../components/Loader.jsx";  // Import your loader component
import React from "react";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const fileInputRef = useRef(null);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("Firstname is Required 😁");
      return false;
    }
    if (!lastName) {
      toast.error("Lastname is required 🐵");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (userInfo && userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if (userInfo.image) {
      setImage(`${BACKEND_HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const saveChanges = async () => {
    if (validateProfile()) {
      setIsLoading(true);  // Set loading to true
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status == 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully 👍🏻");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);  // Set loading to false once operation completes
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);  // Set loading to true
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully.");
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      setIsLoading(false);  // Set loading to false once operation completes
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);  // Set loading to true
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);  
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 px-4 md:px-10 overflow-auto">
      <Logo />
      <div className="flex flex-col gap-10 w-full md:w-[80vw] lg:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-3xl md:text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center mx-auto lg:mx-0"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="userProfile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:h-48 md:w-48 text-8xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 ring-fuchsia-50"
                onClick={image ? handleDeleteImage : handleFileImage}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex flex-col gap-5 text-white items-center lg:items-start">
            <div className="w-full">
              <input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg bg-[#2c2e3b] border-none p-4 w-full"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg bg-[#2c2e3b] border-none p-4 w-full"
              />
            </div>
            <div className="w-full">
              <input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg bg-[#2c2e3b] border-none p-4 w-full"
              />
            </div>
            <div className="w-full flex gap-3 flex-wrap">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-2"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Button
            className="h-12 md:h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            {isLoading ? (
              <Loader />  // Show loader while saving
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



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
