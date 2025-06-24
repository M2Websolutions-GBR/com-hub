import React, { useEffect } from "react";

import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { useVideoContext } from "../contexts/VideoContext";

const CreateFeelings = ({ videoId }) => {
  const { liked, setLiked } = useVideoContext();

  useEffect(() => {
    const checkFeeling = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL_DATA}/api/data/feelings/check`,
          { videoId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("response.data", response.data);
        setLiked(response.data.data.feeling === "like");
        console.log("response.feeling", liked);
      } catch (error) {
        console.error("Failed to check feeling:", error);
      }
    };

    const getLikedVideos = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_DATA}/api/data/feelings/videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach Authorization header with token
            },
          }
        );

        // Assuming you want to handle the response data in some way
        console.log("Liked videos:", response.data);
        return response.data; // Return data to be used further in your frontend logic
      } catch (error) {
        console.error("Failed to get liked videos:", error);
        throw error; // Propagate the error for further handling
      }
    };

    checkFeeling();
    getLikedVideos();
  }, [videoId]);

  const handleLike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/feelings`,
        { type: "like", videoId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("Failed to like the video:", error);
    }
  };

  return (
    <div className="flex items-center mt-4 space-x-4">
      <button
        onClick={handleLike}
        className={"text-cyan-600 text-2xl hover:text-cyan-600"}
      >
        {liked ? (
          <FaThumbsUp className="text-3xl" />
        ) : (
          <FaRegThumbsUp className="text-3xl" />
        )}
      </button>
    </div>
  );
};

export default CreateFeelings;
