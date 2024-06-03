import React from "react";
import Animation from "@/Animation/Animation";
import pageloading from "../Animation/json/loading.json";

const loading = () => {
  return (
    <div className="relative w-screen h-screen">
      <div className="absolute w-max h-max p-20 rounded-2xl backdrop-blur-2xl shadow-2xl inset-auto">
        <Animation
          animationData={pageloading}
          classes=" flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default loading;
