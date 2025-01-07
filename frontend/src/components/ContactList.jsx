import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import React from "react";
import { BACKEND_HOST } from "../../utils/constant.js";
import { AvatarImage } from "./ui/avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessage,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };
  return (
    <div className=" mt-5 text-white">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? " hover:bg-purple-800 md:bg-purple-700" 
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className=" h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${BACKEND_HOST}/${contact.image}`}
                    alt="userProfile"
                    className="object-cover w-full h-full bg-black "
                  />
                ) : (
                  <div
                    className={`
                    ${
                      selectedChatData && selectedChatData._id === contacts._id
                        ? "bg-[#ffffff22] border border-white/70"
                        : getColor(contact.color)
                    }
                    uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.firstName} ${contact.lastName}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
