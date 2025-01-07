import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center z-50 backdrop-blur-xl min-h-screen ">
      <div className="relative w-[120px] h-[48px] overflow-hidden">
        <svg
          id="logo-38"
          width="120"
          height="48"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
            className={`transform transition-transform duration-700 ease-out animate-pulse`}
            fill="#8338ec"
          />
          <path
            d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
            className={`transform transition-transform duration-700 ease-out delay-100 animate-pulse `}
            fill="#975aed"
          />
          <path
            d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
            className={`transform transition-transform duration-700 ease-out delay-200 animate-pulse`}
            fill="#a16ee8"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
