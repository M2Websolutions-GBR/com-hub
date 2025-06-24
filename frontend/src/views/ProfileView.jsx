import React, { useEffect, useState } from "react";

import About from "../components/About";
import CardDetails from "../components/CardDetails";
import { FaRegFrown } from "react-icons/fa";
import ProfileService from "../services/ProfileService";
import VideoService from "../services/VideoService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";
import { useVideoContext } from "../contexts/VideoContext";

export default function ProfileView() {
  const [userId, setUserId] = useState();
  const [displayPrivateVideos, setDisplayPrivateVideos] = useState(false); // Default to public videos
  const { sideMenuOpen } = useSideMenuOpen();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const {
    publicVideoData,
    setPublicVideoData,
    privateVideoData,
    setPrivateVideoData,
  } = useVideoContext(); // Use video context

  const fetchUserId = async () => {
    try {
      const userData = await ProfileService.getUser(); // Call fetchProfile to get user data
      console.log("userData HIER", userData.data.id);
      if (userData) {
        setUserId(userData.data.id); // Set userId state
        // Fetch and set public videos by userId
        const publicVideos = await VideoService.getPublicVideosByUserId(
          userData.data.id
        );
        console.log("publicVideos", publicVideos.data);
        setPublicVideoData(publicVideos.data);

        // Fetch and set private videos
        const privateVideos = await VideoService.getPrivateVideosByUserId(
          userData.data.id
        );
        setPrivateVideoData(privateVideos.data);
      }
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, [
    setAboutText,
    setUserData,
    setAvatarUrl,
    setPublicVideoData,
    setPrivateVideoData,
  ]);

  return (
    <div
      className={`flex flex-col transition-all duration-300 overflow-y-auto no-scrollbar${
        sideMenuOpen ? " ml-60" : ""
      }`}
    >
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
        <About />

        <div>
          <div className="flex items-center justify-between mt-8 mb-4 font-bold">
            <div className="flex w-full">
              <button
                className={`w-1/2 py-2 ${
                  displayPrivateVideos
                    ? "bg-cyan-700"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white rounded-l focus:outline-none`}
                onClick={() => setDisplayPrivateVideos(true)}
              >
                Private
              </button>
              <button
                className={`w-1/2 py-2 ${
                  !displayPrivateVideos
                    ? "bg-cyan-700"
                    : "bg-gray-300 hover:bg-gray-400"
                } text-white rounded-r focus:outline-none`}
                onClick={() => setDisplayPrivateVideos(false)}
              >
                Public
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-start">
            {displayPrivateVideos ? (
              privateVideoData.length > 0 ? (
                privateVideoData.map(
                  (video) =>
                    userId === video.userId.id && (
                      <div key={video.id} className="w-full p-2">
                        <CardDetails
                          imageUrl={video.thumbnailUrl}
                          videoTitle={video.title}
                          videoDescription={video.description}
                          videoId={video.id}
                          fullWidth // Add prop to indicate full width
                        />
                      </div>
                    )
                )
              ) : (
                <NoVideosUploaded />
              )
            ) : publicVideoData.length > 0 ? (
              publicVideoData.map(
                (video) =>
                  userId === video.userId.id && (
                    <div key={video.id} className="w-full p-2">
                      <CardDetails
                        imageUrl={video.thumbnailUrl}
                        videoTitle={video.title}
                        videoDescription={video.description}
                        videoId={video.id}
                        fullWidth // Add prop to indicate full width
                      />
                    </div>
                  )
              )
            ) : (
              <NoVideosUploaded />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoVideosUploaded() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
      <FaRegFrown className="mb-4 text-6xl" />
      <p className="text-xl font-semibold">No videos uploaded</p>
      <p className="mt-2 text-md">
        Please check back later or upload a new video.
      </p>
    </div>
  );
}
