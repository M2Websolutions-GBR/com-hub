import { MdEdit, MdSave } from "react-icons/md";
import React, { useRef, useState } from "react";

import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/400x200?text=Placeholder";

const CardDetails = ({
  imageUrl,
  videoTitle,
  videoDescription,
  videoId,
  fullWidth,
}) => {
  const imageSrc = imageUrl || placeholderImage;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL_VIDEO}/api/videos/${videoId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.status", response.status);
      if (response.status === 204) {
        toast.success("Video successfully deleted!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 3500); // Delay the reload for 3 seconds to display the toast
        console.log("Video deleted successfully");
      } else {
        console.log("Failed to delete video");
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      alert("Failed to delete video");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(videoTitle);
  const [editedDescription, setEditedDescription] = useState(videoDescription);

  const textareaTitleRef = useRef(null);
  const textareaDescriptionRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL_VIDEO}/api/videos/updateDetails`,
        {
          videoId,
          title: editedTitle,
          description: editedDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating video details:", error);
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of newline in textarea
      await handleSaveClick(); // Save on Enter key press
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden block ${
        fullWidth ? "w-full" : ""
      }`}
    >
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
        <div className="relative flex flex-col flex-1 p-4 bg-gray-100">
          <div className="flex items-center justify-between mb-2 text-gray-400">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                className="w-full p-2 text-lg font-semibold text-gray-900 border rounded"
                ref={textareaTitleRef}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <h2 className="text-lg font-semibold text-gray-900">
                {editedTitle}
              </h2>
            )}
            <div className="flex gap-4">
              <div>
                <RxCross2
                  className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
              <div>
                {isEditing ? (
                  <MdSave
                    className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handleSaveClick}
                  />
                ) : (
                  <MdEdit
                    className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handleEditClick}
                  />
                )}
              </div>
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={handleDescriptionChange}
              className="w-full p-2 text-sm text-gray-600 border rounded"
              ref={textareaDescriptionRef}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <p className="text-sm text-gray-600">{editedDescription}</p>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-[50] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-center">
              Delete Video
            </h2>
            <p className="mb-4 text-center text-gray-700">
              Are you sure you want to delete this video?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetails;
