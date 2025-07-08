import { Link, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import CommentSection from "../components/CommentSection";
import CreateFeelings from "../components/CreateFeelings";
import ProfileService from "../services/ProfileService";
import VideoCard from "../components/VideoCard";
import axios from "axios";
import useHistoryService from "../services/HistoryService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";

export default function PlayView() {
  const { sideMenuOpen } = useSideMenuOpen();
  const { userData, avatarUrl, setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { createHistory } = useHistoryService();
  const plyrRef = useRef(null);

  const fetchProfile = async () => {
    try {
      await ProfileService.getProfile(setAboutText, setUserData, setAvatarUrl);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

const fetchVideoDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch video metadata from the data service
      const videoResponse = await axios.get(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/videos/${id}`
      );

      const video = videoResponse.data.data;

      // Build streaming URL for the video service
      const url = `${import.meta.env.VITE_API_URL_VIDEO}/uploads/${video.key}`;

      setVideoData({ url, video });

      const userId = video?.userId?.id || video?.userId?._id || video.userId;
      if (userId) {
        const userResponse = await ProfileService.getProfileById(userId);
        setChannelData(userResponse.data);
      } else {
        console.error("User ID is not available");
      }
    } catch (error) {
      console.error("Failed to fetch video details or user details:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleAddHistory = async () => {
    try {
      await createHistory({ videoId: id, type: "watch" });
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchVideoDetails();
  }, [id, setAboutText, setUserData, setAvatarUrl]);

  useEffect(() => {
    if (videoData) {
      handleAddHistory();
    }
  }, [videoData]);

  return (
    <div className={`flex items-center justify-center flex-col transition-all duration-300 ${sideMenuOpen ? "ml-60" : ""}`}>
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%]">
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {videoData?.video ? (
                <>
                  <h2 className="m-4 text-2xl font-bold">{videoData.video.title}</h2>
                  <VideoCard videoData={videoData} ref={plyrRef} />

                  <div className="mt-6 m-4 px-4 py-4 bg-gray-100 shadow-lg rounded-lg flex items-start">
                    {channelData?.avatarUrl && (
                      <Link to={`/channel/${channelData.id}`} className="mr-4">
                        <img src={channelData.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
                      </Link>
                    )}
                    <div className="flex-1">
                      <Link to={`/channel/${channelData?.id}`} className="text-black block mb-2">
                        {channelData?.channelName || "Unbekannter Kanal"}
                      </Link>
                      <p className="text-gray-700 mb-4">{videoData.video.description || "Keine Beschreibung vorhanden."}</p>
                    </div>
                    <div className="flex justify-end">
                      <CreateFeelings videoId={id} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <p className="text-lg text-gray-600">Video wird geladen...</p>
                </div>
              )}
            </>
          )}
        </div>
        <CommentSection videoId={id} />
      </div>
    </div>
  );

}
