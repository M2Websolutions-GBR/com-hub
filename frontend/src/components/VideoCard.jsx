import "plyr-react/plyr.css";

import React, { forwardRef } from "react";

import Plyr from "plyr-react";

const VideoCard = forwardRef(({ videoData }, ref) => {
  const plyrProps = {
    source: {
      type: "video",
      sources: [
        {
          src: videoData.url, 
          type: "video/mp4",
        },
      ],
    },
    options: {
      autoplay: true, // Enable autoplay
    },
  };

  return (
    <div className="max-w-[100%] m-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="plyr__video-embed" id="player">
        <Plyr ref={ref} {...plyrProps} />
      </div>
    </div>
  );
});

export default VideoCard;
