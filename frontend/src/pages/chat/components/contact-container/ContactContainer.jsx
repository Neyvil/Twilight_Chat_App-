import Profile from "@/pages/profile";
import { useState, useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import NewDm from "./components/NewDm";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTES,
} from "../../../../../utils/constant.js";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/CreateChannel";
const ContactContainer = () => {
  const {
    setdirectMessageContacts,
    directMessageContacts,
    channels,
    setChannels,
  } = useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setdirectMessageContacts(response.data.contacts);
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTES, {
        withCredentials: true,
      });
      console.log(response)
      if (response.data.channel) {
        setChannels(response.data.channel);
      }
    };
    
    getContacts();
    getChannels();
  }, [setdirectMessageContacts, setChannels]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className=" flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={directMessageContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className=" flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      
      <ProfileInfo />
    </div>
  );
};

const Logo = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex p-5 justify-center md:justify-start items-center gap-2">
      <div className="relative w-[78px] h-[32px] overflow-hidden">
        <svg
          id="logo-38"
          width="78"
          height="32"
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
        className={`merienda-medium text-4xl text-white transform transition-all duration-700 delay-300 ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-32 opacity-0"
        }`}
      >
        Twilight
      </span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className=" uppercase tracking-widest text-neutral-100 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactContainer;
