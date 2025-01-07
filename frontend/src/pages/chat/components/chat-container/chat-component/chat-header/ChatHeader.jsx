import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { BACKEND_HOST } from "../../../../../../../utils/constant.js";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-10 bg-[#1b1c24]">
      {/* Profile and Chat Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 relative flex-shrink-0">
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${BACKEND_HOST}/${selectedChatData.image}`}
                  alt="User Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData?.color || "#000"
                  )}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData?.email?.charAt(0)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full text-white text-xl font-bold">
              #
            </div>
          )}
        </div>
        <div className="text-neutral-100 truncate">
          {selectedChatType === "channel"
            ? selectedChatData?.name || "Unnamed Channel"
            : selectedChatData?.firstName
            ? `${selectedChatData.firstName} ${selectedChatData.lastName || ""}`
            : selectedChatData?.email || "Unknown Contact"}
        </div>
      </div>

      {/* Close Button */}
      <button
        aria-label="Close Chat"
        className="flex items-center justify-center p-2 rounded-full text-neutral-500 hover:bg-red-600 hover:text-white transition duration-300"
        onClick={closeChat}
      >
        <RiCloseFill className="text-2xl md:text-3xl" />
      </button>
    </div>
  );
};

export default ChatHeader;
