import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactContainer from "./components/contact-container/ContactContainer";
import EmptyChatContainer from "./components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "./components/chat-container/ChatContainer";
import Loader from "@/components/Loader";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  // Redirect if userInfo is null or profile is not set up
  useEffect(() => {
    if (!userInfo) {
      toast.error("Session expired. Please log in again.");
      navigate("/auth");
    } else if (!userInfo.profileSetup) {
      toast("Please setup your profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-50 left-0 bg-black/80 flex justify-center items-center flex-col gap-5 backdrop-blur-lg">
          <div className="flex flex-col gap-4">
            <span className="font-serif text-5xl">UPLOADING</span>
            <div className="loader"></div>
          </div>
          <span>{fileUploadProgress}%</span>
        </div>
      )}

     
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-50 left-0 bg-black/80 flex justify-center items-center flex-col gap-5 backdrop-blur-lg">
          <div className="flex flex-col gap-4 text-2xl md:text-5xl">
            <span className="font-serif">DOWNLOADING</span>
            <div className="loader"></div>
          </div>
          <span>{fileDownloadProgress}%</span>
        </div>
      )}

      {/* Chat UI */}
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
