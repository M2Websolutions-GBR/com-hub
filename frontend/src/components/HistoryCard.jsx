import { Link } from "react-router-dom";
import React from "react";
import { RxCross2 } from "react-icons/rx";

const HistoryCard = ({
  imageUrl,
  videoTitle,
  videoDescription,
  videoId,
  historyId,
  handleDeleteHistory,
}) => {
  console.log("historyId", historyId);
  console.log("videoId", videoId);
  return (
    <div className="block overflow-hidden bg-white rounded-lg shadow-md">
      <div className="flex">
        {/* Image section */}
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
        {/* Information section */}
        <div className="relative flex justify-between flex-1 p-4 bg-gray-100">
          <div className="text-lg font-semibold text-gray-900">
            <div>
              <h2>{videoTitle}</h2>
              <p className="text-sm text-gray-600">{videoDescription}</p>
            </div>
          </div>
          <div>
            <RxCross2
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => handleDeleteHistory(historyId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
