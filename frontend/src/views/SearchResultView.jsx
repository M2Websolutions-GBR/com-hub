import React, { useCallback, useEffect, useState } from "react";

import CardDetailsOtherChannel from "../components/CardDetailsOtherChannel";
import { FaRegFrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileService from "../services/ProfileService";
import SearchService from "../services/SearchService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";
import { useVideoContext } from "../contexts/VideoContext";

const SearchResults = ({ results, searchText }) => {
  const { sideMenuOpen } = useSideMenuOpen();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const { setPublicVideoData } = useVideoContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfile = useCallback(async () => {
    try {
      await ProfileService.getProfile(setAboutText, setUserData, setAvatarUrl);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [setAboutText, setUserData, setAvatarUrl]);

  const fetchVideos = useCallback(
    async (page) => {
      console.log("Fetching videos for page:", page);
      try {
        const response = await SearchService.searchVideos(searchText, page);
        console.log("response.totalPage", response);
        setPublicVideoData(response.data);
        setTotalPages(response.totalPage);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    },
    [searchText, setPublicVideoData]
  );

  useEffect(() => {
    fetchProfile();
    fetchVideos(currentPage);
  }, [fetchProfile, fetchVideos, currentPage]);

  return (
    <div
      className={`flex flex-col items-center h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto p-4">
        <div className="flex flex-wrap justify-start">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result._id} className="w-full p-2">
                {result.channelName ? (
                  <Link to={`/channel/${result._id}`}>
                    <div className="max-w-[1440px] mx-auto mt-4 px-6 py-8 bg-gray-100 rounded-lg shadow-md sm:flex sm:flex-row sm:items-start">
                      <div className="flex-shrink-0 w-20 h-20 mb-4 sm:mb-0">
                        <img
                          src={result.avatarUrl}
                          alt="avatar"
                          className="object-cover w-full h-full rounded-full cursor-pointer"
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="mb-4 text-2xl font-bold">
                          {result.channelName}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <CardDetailsOtherChannel
                    imageUrl={result.thumbnailUrl}
                    videoTitle={result.title}
                    videoDescription={result.description}
                    videoId={result._id}
                    fullWidth
                  />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <FaRegFrown className="mb-4 text-6xl" />
            <p className="text-xl font-semibold">No videos found</p>
            <p className="mt-2 text-md">
              Please check back later.
            </p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
