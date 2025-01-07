import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";
import {
  BACKEND_HOST,
  GET_ALL_MESSAGES,
  GET_CHANNEL_MESSAGES_ROUTES,
} from "../../../../../../../utils/constant.js";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { getColor } from "@/lib/utils.js";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessage,
    setSelectedChatMessage,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessage(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        console.log(response);
        if (response.data.messages) {
          setSelectedChatMessage(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await apiClient.get(`${BACKEND_HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentageCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentageCompleted);
        },
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);

      console.log({ error });
    }
  };
  const rendermessage = () => {
    let lastDate = null;
    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const renderDMMessage = (message) => {
    if (message.messageType !== "text" && message.messageType !== "file") {
      return null;
    }

    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <>
            <div
              className={`${
                message.sender !== selectedChatData._id
                  ? "bg-[#8417ff]/80 text-[#ffff]/90 border-[#8417ff]/50 poppins-medium rounded-l-xl rounded-br-xl"
                  : "bg-[#F3F4F6] poppins-medium border-gray-500  rounded-r-xl rounded-bl-xl text-[#0e0d0d]"
              }  border inline-block mt-4 p-4 text-sm max-w-[80%] lg:max-w-[60%] break-words`}
        >
              {message.content}
            </div>
          </>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender === selectedChatData._id
                ? "border-gray-300 bg-gray-100 text-black rounded-r-xl rounded-bl-xl"
              : "border-[#8417ff]/50 bg-[#8417ff]/10 text-[#8417ff]/90 rounded-l-xl rounded-br-xl"
          } border inline-block p-4 text-sm max-w-[80%] lg:max-w-[60%] break-words`}
        >
            {checkIfImage(message.fileUrl) ? (
              <>
                <div className="group relative my-2.5">
                  <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-90 transition-opacity duration-300 rounded-lg flex flex-wrap items-center justify-center">
                    {message.sender === selectedChatData._id && (
                      <>
                        <button
                          data-tooltip-target="download-image"
                          className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/10 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                          onClick={() => downloadFile(message.fileUrl)}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 18"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <img
                    src={`${BACKEND_HOST}/${message.fileUrl}`}
                    className="rounded-lg"
                  />
                </div>
                {message.content ? (
                  <div
                    className={`${
                      message.sender !== selectedChatData._id
                        ? "text-left bg-[#aca7cb] shadow-sm shadow-white p-3 rounded-lg text-sm font-sans text-white"
                        : "text-left bg-gray-50 shadow-xl p-3 rounded-lg text-sm font-sans text-black "
                    } poppins-medium mt-2 `}
                  >
                    {message.content}
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
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
                      <polygon
                        style={{ fill: "#CAD1D8" }}
                        points="480,224 384,128 480,128"
                      />
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
                    <span className="truncate text-sm font-medium">
                      {message.fileUrl.split("/").pop().toUpperCase()}
                    </span>
                    
                  </div>

                  <span className="flex pl-4 text-xs text-gray-500 mt-1   gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="self-center"
                      width="3"
                      height="4"
                      viewBox="0 0 3 4"
                      fill="none"
                    >
                      <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                    </svg>
                    Document
                  </span>
                </div>
                <div className="inline-flex self-center items-center">
                  <button
                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-300 focus:ring-4 focus:outline-none  focus:ring-gray-50"
                    type="button"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <svg
                      className="md:w-6 md:h-6 w-4 h-4 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-200">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5 flex items-center ${
          message.sender._id !== userInfo.id ? " justify-start" : " justify-end"
        }`}
      >
        {message.messageType === "text" && (
          <>
            <div className=" flex items-start gap-2.5">
              {message.sender._id !== userInfo.id ? (
                <div className=" rounded-full flex justify-start items-center gap-3">
                  <Avatar className=" h-8 w-8 rounded-full overflow-hidden">
                    {message.sender.image && (
                      <AvatarImage
                        src={`${BACKEND_HOST}/${message.sender.image}`}
                        alt="userProfile"
                        className="object-cover w-full h-full bg-black "
                      />
                    )}
                    <AvatarFallback
                      className={`uppercase h-8 w-8  text-lg flex items-center justify-center rounded-full ${getColor(
                        message.sender.color
                      )}`}
                    >
                      {message.sender.firstName
                        ? message.sender.firstName.split("").shift()
                        : message.sender.email.split("").shift()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <></>
              )}
              <div
                className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 ${
                  message.sender._id === userInfo.id
                    ? " bg-purple-700 border-[#8417ff]/50  rounded-l-xl rounded-br-xl"
                    : "border-gray-200 text-gray-900   bg-gray-100 rounded-e-xl rounded-es-xl"
                }  `}
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-bold dark:text-white">
                    {`${message.sender.firstName} ${message.sender.lastName}`}
                  </span>
                  <span className="text-sm font-semibold ">
                    {moment(message.timestamp).format("LT")}
                  </span>
                </div>
                <p className=" text-sm poppins-medium  py-2.5 ">
                  {message.content}
                </p>
              </div>
            </div>
          </>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "border bg-[#8417ff]/10 border-[#7018D3] text-[#ffff]/90 leading-1 poppins-medium rounded-l-xl rounded-br-xl"
                : "border border-[#F3F4F6] bg-[#F3F4F6]/10 poppins-medium  rounded-r-xl rounded-bl-xl text-[#0e0d0d]"
            } inline-block p-4 text-sm mt-5 max-w-[30%] lg:max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <>
                <div className="group relative my-2.5">
                  <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-90 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    {message.sender._id !== userInfo.id && (
                      <>
                        <button
                          data-tooltip-target="download-image"
                          className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/10 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                          onClick={() => downloadFile(message.fileUrl)}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 18"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <img
                    src={`${BACKEND_HOST}/${message.fileUrl}`}
                    className="rounded-lg"
                  />
                </div>

                {message.content ? (
                  <div
                    className={`${
                      message.sender !== selectedChatData._id
                        ? "text-left  shadow-sm shadow-white p-3 rounded-lg text-sm font-sans text-white"
                        : "text-left bg-[#7018D3]/10 shadow-xl p-3 rounded-lg text-sm font-sans text-black "
                    } poppins-medium mt-2 `}
                  >
                    {message.content}
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="flex items-start md:gap-6 my-2.5 bg-gray-50 shadow-xl rounded-xl p-2">
                <div className="me-2">
                  <span className="flex items-center w-full gap-4 text-sm md:text-lg font-medium text-gray-900 pb-2">
                    <svg
                      height="50"
                      width="50"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      className="md:w-8 md:h-8 w-4 h-4 flex-shrink-0"
                    >
                      <path
                        style={{ fill: "#E2E5E7" }}
                        d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"
                      />
                      <path
                        style={{ fill: "#B0B7BD" }}
                        d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"
                      />
                      <polygon
                        style={{ fill: "#CAD1D8" }}
                        points="480,224 384,128 480,128"
                      />
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
                    {message.fileUrl.split("/").pop().toUpperCase()}
                  </span>

                  <span className="flex pl-4 text-sm md:text-lg font-normal text-gray-500  gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="self-center"
                      width="3"
                      height="4"
                      viewBox="0 0 3 4"
                      fill="none"
                    >
                      <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                    </svg>
                    Document
                  </span>
                </div>
                <div className="inline-flex self-center items-center">
                  <button
                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-300 focus:ring-4 focus:outline-none  focus:ring-gray-50"
                    type="button"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <svg
                      className="md:w-6 md:h-6 w-4 h-4 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:px-6 lg:px-8 xl:px-12 mx-auto w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[65vw]">
      {rendermessage()}
      <div ref={scrollRef} />
    </div>
  );
  
};

export default MessageContainer;
