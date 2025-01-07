import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { UPLOAD_FILE_ROUTE } from "../../../../../../../utils/constant.js";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return; // Prevent sending empty messages
    try {
      let fileUrl = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          fileUrl = response.data.filePath;
        }
      }

      const messagePayload = {
        sender: userInfo.id,
        content: message || undefined,
        messageType: fileUrl ? "file" : "text",
        fileUrl,
      };

      if (selectedChatType === "contact") {
        messagePayload.recipient = selectedChatData._id;
        socket.emit("sendMessage", messagePayload);
      } else if (selectedChatType === "channel") {
        messagePayload.channelId = selectedChatData._id;
        socket.emit("send-channel-message", messagePayload);
      }

      setMessage("");
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      setIsUploading(false);
      console.error("Error emitting message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const isImage = checkIfImage(file.name);
      setFilePreview(isImage ? URL.createObjectURL(file) : null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const DocumentIcon = () => (
    <svg
      height="50"
      width="50"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      className="md:w-16 md:h-16 w-8 h-8 flex-shrink-0"
    >
      <path
        style={{ fill: "#E2E5E7" }}
        d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"
      />
      <path
        style={{ fill: "#B0B7BD" }}
        d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"
      />
      <polygon style={{ fill: "#CAD1D8" }} points="480,224 384,128 480,128" />
      <path
        style={{ fill: "#50BEE8" }}
        d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z"
      />
      <g>
        <path
          style={{ fill: "#FFFFFF" }}
          d="M92.576,384c-4.224,0-8.832-2.32-8.832-7.936v-72.656c0-4.608,4.608-7.936,8.832-7.936h29.296
      c58.464,0,57.168,88.528,1.136,88.528H92.576z M100.64,311.072v57.312h21.232c34.544,0,36.064-57.312,0-57.312H100.64z"
        />
        <path
          style={{ fill: "#FFFFFF" }}
          d="M228,385.28c-23.664,1.024-48.24-14.72-48.24-46.064c0-31.472,24.56-46.944,48.24-46.944
      c22.384,1.136,45.792,16.624,45.792,46.944C273.792,369.552,250.384,385.28,228,385.28z M226.592,308.912
      c-14.336,0-29.936,10.112-29.936,30.32c0,20.096,15.616,30.336,29.936,30.336c14.72,0,30.448-10.24,30.448-30.336
      C257.04,319.008,241.312,308.912,226.592,308.912z"
        />
        <path
          style={{ fill: "#FFFFFF" }}
          d="M288.848,339.088c0-24.688,15.488-45.92,44.912-45.92c11.136,0,19.968,3.328,29.296,11.392
      c3.456,3.184,3.84,8.816,0.384,12.4c-3.456,3.056-8.704,2.688-11.776-0.384c-5.232-5.504-10.608-7.024-17.904-7.024
      c-19.696,0-29.152,13.952-29.152,29.552c0,15.872,9.328,30.448,29.152,30.448c7.296,0,14.08-2.96,19.968-8.192
      c3.952-3.072,9.456-1.552,11.76,1.536c2.048,2.816,3.056,7.552-1.408,12.016c-8.96,8.336-19.696,10-30.336,10
      C302.8,384.912,288.848,363.776,288.848,339.088z"
        />
      </g>
      <path
        style={{ fill: "#CAD1D8" }}
        d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"
      />
    </svg>
  );

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center px-4 md:px-8 mb-4 md:mb-6 relative">
      <div className="flex-1 flex bg-[#2a2b33] rounded-full items-center px-4 md:px-6 py-2 md:py-3 shadow-lg">
        <button
          className="text-neutral-500 hover:text-white focus:border-none transition-all duration-200 mr-2"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <input
          type="text"
          className="flex-1 poppins-medium text-white bg-transparent rounded-md focus:outline-none placeholder-neutral-400 px-2"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="text-neutral-500 hover:text-white focus:border-none transition-all duration-200 ml-2"
          onClick={() => setEmojiPickerOpen((prev) => !prev)}
        >
          <RiEmojiStickerLine className="text-xl" />
        </button>
        {emojiPickerOpen && (
          <div
            className="absolute bottom-16 right-4 bg-[#2a2b33] rounded-lg p-2"
            ref={emojiRef}
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        )}
      </div>
      <button
        className="md:bg-[#8417ff] text-white rounded-full flex items-center justify-center w-12 h-12 ml-4 hover:bg-[#741bda] transition-all duration-200 shadow-lg"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl text-purple-700 md:text-white" />
      </button>

      {selectedFile && (
        <div className="absolute bottom-20 bg-[#2a2b33] rounded-md p-4 w-64 shadow-md">
          <div className="flex items-center gap-4">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md"
              />
            ) : (
              <DocumentIcon />
            )}
            <div className="flex-1">
              <p className="text-white truncate">{selectedFile.name}</p>
              <button
                className="text-red-500 hover:text-red-700 mt-2 text-sm"
                onClick={handleRemoveFile}
              >
                Remove File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBar;
