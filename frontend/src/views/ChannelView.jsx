import React, { useEffect, useState } from "react";

import AboutOtherChannel from "../components/AboutOtherChannel";
import CardDetailsOtherChannel from "../components/CardDetailsOtherChannel";
import { FaRegFrown } from "react-icons/fa";
import ProfileService from "../services/ProfileService";
import VideoService from "../services/VideoService";
import { useParams } from "react-router-dom";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";
import { useVideoContext } from "../contexts/VideoContext";

const ChannelView = () => {
  const { channelId } = useParams(); // Get channelId from URL
  const [userData, setUserData] = useState({});
  const { sideMenuOpen } = useSideMenuOpen();
  const { publicVideoData, setPublicVideoData } = useVideoContext(); // Use video context
  console.log('channelId', channelId)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await ProfileService.getProfileById(channelId);
        setUserData(profileData.data);
      } catch (error) {
        console.error("Fehler beim Abrufen des Benutzerprofils:", error);
      }
    };

    const fetchPublicVideos = async () => {
      try {
        const videos = await VideoService.getPublicVideosByUserId(channelId);
        setPublicVideoData(videos);
      } catch (error) {
        console.error("Failed to load public videos", error);
      }
    };

    fetchUserProfile();
    fetchPublicVideos();
  }, [channelId, setPublicVideoData]);

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${sideMenuOpen ? "ml-60" : ""}`}>
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto p-4">
        <AboutOtherChannel
          channelName={userData.channelName}
          avatarUrl={userData.avatarUrl}
          aboutText={userData.aboutText}
          channelId={channelId}
        />
        <div className="mt-8">
          <h2 className="text-xl font-bold">Public Videos</h2>
          <div className="flex flex-wrap justify-start">
            {publicVideoData.count > 0 ? (
              publicVideoData.data.map((video) => (
                <div key={video.id} className="w-full p-2">
                  <CardDetailsOtherChannel
                    imageUrl={video.thumbnailUrl}
                    videoTitle={video.title}
                    videoDescription={video.description}
                    videoId={video.id}
                    userId={channelId} // Correctly using channelId to refer to the user's channel we are viewing
                    fullWidth
                  />
                </div>
              ))
            ) : (
              <NoVideosUploaded />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelView;

function NoVideosUploaded() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
      <FaRegFrown className="mb-4 text-6xl" />
      <p className="text-xl font-semibold">No videos uploaded</p>
      <p className="mt-2 text-md">Please check back later</p>
    </div>
  );
}
