import React, { useState } from "react";

import { Link } from "react-router-dom";

const CardDetailsOtherChannel = ({
  imageUrl,
  videoTitle,
  videoDescription,
  videoId,
  fullWidth,
}) => {
  const [editedTitle] = useState(videoTitle);
  const [editedDescription] = useState(videoDescription);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden block ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <div className="flex">
        <Link
          to={`/play/${videoId}`} // Navigate to "/play/:videoId"
          className="block max-w-sm overflow-hidden transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105"
        >
          <div className="w-[300px] h-[200px] relative rounded-lg overflow-hidden">
            <img
              src={
                imageUrl ||
                "https://via.placeholder.com/400x200?text=Placeholder"
              }
              alt="Video thumbnail"
              className="absolute inset-0 object-cover w-full h-full"
            />
          </div>
        </Link>
        <div className="relative flex flex-col flex-1 p-4 bg-gray-100">
          <div className="flex items-center justify-between mb-2 text-gray-400">
            <h2 className="text-lg font-semibold text-gray-900">
              {editedTitle}
            </h2>
          </div>
          <p className="text-sm text-gray-600">{editedDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsOtherChannel;
