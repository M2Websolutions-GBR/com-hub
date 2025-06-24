import React, { useEffect, useState } from "react";

import FeelingsList from "../components/FeelingsList";
import FeelingsService from "../services/FeelingsService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";

export default function FeelingsView() {
  const [likedVideos, setLikedVideos] = useState([]);
  const { getFeelings } = FeelingsService();
  const { sideMenuOpen } = useSideMenuOpen();

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const data = await getFeelings();
        setLikedVideos(data); // Assuming `data` is an array of video objects
      } catch (error) {
        console.error("Failed to fetch liked videos:", error);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className={`flex items-center flex-col h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${sideMenuOpen ? "ml-60" : ""}`}>
      <div className="mt-4 w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[70%]">
        <FeelingsList likedVideos={likedVideos} />
      </div>
    </div>
  );
}
