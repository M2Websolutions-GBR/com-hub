import React, { useEffect, useState } from "react";

import Card from "../components/Card";
import { FaRegFrown } from "react-icons/fa";
import Pagination from "../components/Pagination";
import ProfileService from "../services/ProfileService";
import VideoService from "../services/VideoService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";
import { useVideoContext } from "../contexts/VideoContext";

export default function HomeView() {
  const { sideMenuOpen } = useSideMenuOpen();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const { publicVideoData, setPublicVideoData } = useVideoContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("publicVideoData", publicVideoData);
  console.log("currentPage", currentPage);
  console.log("totalPages", totalPages);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await ProfileService.getProfile(
          setAboutText,
          setUserData,
          setAvatarUrl
        );
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await VideoService.getAllPublicVideos(
          setPublicVideoData,
          currentPage
        );
        setTotalPages(response.totalPage); // Make sure the response includes totalPages
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchProfile();
    fetchVideos();
  }, [
    setAboutText,
    setUserData,
    setAvatarUrl,
    setPublicVideoData,
    currentPage,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div
      className={`flex items-center flex-col h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <div className="flex flex-wrap justify-center flex-1 gap-4 mx-auto">
        {publicVideoData.count > 0 ? (
          publicVideoData.data.map((video) => (
            <div key={video.id}>
              <Card
                thumbnailUrl={video.thumbnailUrl}
                videoTitle={video.title}
                videoId={video.id}
                videoLike={video.likes}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FaRegFrown className="mb-4 text-6xl" />
            <p className="text-xl font-semibold">No videos uploaded</p>
            <p className="mt-2 text-md">
              Please check back later or upload a new video.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
