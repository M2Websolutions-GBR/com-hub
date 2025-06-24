import { MdEdit, MdSave } from "react-icons/md";
import React, { useRef, useState } from "react";

import axios from "axios";
import { useUserContext } from "../contexts/UserContext";

export default function About() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null); // Ref to capture textarea element
  const placeholderText = "Welcome to my Channel!";

  const { userData, aboutText, setAboutText, avatarUrl, setAvatarUrl } =
    useUserContext();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/updatedetails`,
        { aboutText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleChange = (e) => {
    setAboutText(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Insert a newline in textarea
      const currentValue = textareaRef.current.value;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setAboutText(
        currentValue.substring(0, start) + "\n" + currentValue.substring(end)
      );
      // Move the cursor to the correct position
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          start + 1;
      }, 0);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of newline in textarea
      await handleSaveClick(); // Save on Enter key press
    }
  };

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL_VIDEO}/api/videos/uploadavatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setAvatarUrl(response.data.data.avatarUrl); // Update avatar URL in state
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-gray-100 rounded-lg shadow-md sm:flex sm:flex-row sm:items-start">
      {/* Avatar Section */}
      <div className="flex-shrink-0 w-48 h-48 mb-4 sm:mb-0">
        <img
          src={avatarUrl}
          alt="avatar"
          className="object-cover w-full h-full rounded-full cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAvatarChange}
          accept="image/*"
        />
      </div>

      {/* About Text Section */}
      <div className="flex-grow sm:pl-6">
        <h2 className="mb-4 text-3xl font-bold">{userData.channelName}</h2>
        <div className="relative">
          {isEditing ? (
            <textarea
              ref={textareaRef} // Assign ref to textarea
              className="w-full h-32 p-3 text-sm leading-tight text-gray-800 border rounded shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-600"
              value={aboutText}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Handle Enter key press
            />
          ) : (
            <p
              placeholder="dawdawdawdawd"
              className="p-3 text-sm text-gray-800 break-words border rounded shadow-sm"
            >
              {aboutText || placeholderText}
            </p>
          )}

          {/* Edit and Save Buttons */}
          {!isEditing && (
            <div className="absolute bottom-2 right-2">
              <MdEdit
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={handleEditClick}
              />
            </div>
          )}
          {isEditing && (
            <div className="absolute bottom-2 right-2">
              <MdSave
                className="w-6 h-6 ml-2 text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={handleSaveClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
