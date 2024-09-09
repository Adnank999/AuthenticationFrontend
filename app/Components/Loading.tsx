import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
const Loading = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src="/loadingAnim.json"
        style={{ height: "150", width: "150px" }}
      >
        
      </Player>
    </div>
  );
};

export default Loading;
