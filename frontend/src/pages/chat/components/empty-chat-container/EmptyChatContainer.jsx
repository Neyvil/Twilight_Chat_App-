import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div
      className="flex-1
     md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all"
    >
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className=" text-opacity-80 text-white flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-none duration-300 text-center">
        <h3 className=" poppins-medium">
          Hi<span className="text-purple-500">!</span> <br /> Welcome to
          <span className="text-purple-500 merienda-medium"> Twilight </span> Chat App{" "}
          <span className=" text-purple-500">.</span>
        </h3>
        <h6 className=" text-3xl caveat-medium">Where Naba wants to talk his friends :)</h6>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
