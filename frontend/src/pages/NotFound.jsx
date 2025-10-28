import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        {/* vì hình ở public nên ta ko cần import mà dùng luôn */}
        <img src ="404_NotFound.png" 
        alt="404 Not Found" 
        className="max-w-full mb-6 w-96"/>

        <p className="text-xl font-semibold">
            Bạn đang đi vào vùng cấm địa 😵‍💫
        </p>

        <a href="/" 
        className="inline-block mt-6 px-6 py-3 font-medium text-white transition shadow-md bg-primary hover:bg-primary-dark rounded-2xl">
            Nơi bạn thuộc về
        </a>
    </div>
  );
};

export default NotFound;
