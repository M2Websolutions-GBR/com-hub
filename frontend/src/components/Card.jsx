import { FaRegThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/400x200?text=Placeholder";

const Card = ({ thumbnailUrl, videoTitle, videoId, videoLike }) => {
  console.log("videoLike", videoLike);
  console.log("videoId", videoId);
  console.log("thumbnailUrl", thumbnailUrl);
  // Use the provided image URL or fallback to placeholder
  const imageSrc = thumbnailUrl || placeholderImage;

  return (
    <Link
      to={`/play/${videoId}`} // Navigate to "/play/:videoId"
      className="block w-[300px] overflow-hidden transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105"
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt="Video thumbnail"
          className="object-cover w-full h-48"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-6.804-3.682A1 1 0 007 8.5v7a1 1 0 001.496.868l6.804-3.682a1 1 0 000-1.736z"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between p-2 bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{videoTitle}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span>{videoLike}</span>
          <FaRegThumbsUp />
        </div>
      </div>
    </Link>
  );
};

export default Card;
