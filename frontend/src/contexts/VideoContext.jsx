import React, { createContext, useContext, useState } from "react";

const VideoContext = createContext();

export const VideoContextProvider = ({ children }) => {
  const [publicVideoData, setPublicVideoData] = useState([]);
  const [privateVideoData, setPrivateVideoData] = useState([]);
  const [liked, setLiked] = useState(false);

  return (
    <VideoContext.Provider
      value={{
        publicVideoData,
        setPublicVideoData,
        privateVideoData,
        setPrivateVideoData,
        liked,
        setLiked,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => useContext(VideoContext);
