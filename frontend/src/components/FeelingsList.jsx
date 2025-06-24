import CardDetailsLiked from "./CardDetailsLiked";
import { FaRegFrown } from "react-icons/fa";
import React from "react";

const FeelingsList = ({ likedVideos }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-center">Liked Videos</h2>
      <ul className="w-full p-2">
        {likedVideos.length > 0 ? (
          likedVideos.map((video, index) => (
            <div key={video.id} className={`mb-4 ${index > 0 ? "mt-4" : ""}`}>
              <CardDetailsLiked
                thumbnailUrl={video.thumbnailUrl}
                videoTitle={video.title}
                videoDescription={video.description}
                videoId={video.id}
                fullWidth
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <FaRegFrown className="mb-4 text-6xl" />
            <p className="text-xl font-semibold">No videos liked</p>
            <p className="mt-2 text-md">
              Please check back later or like a new video.
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default FeelingsList;
