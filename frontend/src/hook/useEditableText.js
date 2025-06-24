// useEditableText.js

import axios from "axios";
import { useState } from "react";

export const useEditableText = (initialTitle, initialDescription, apiEndpoint, token) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [editedDescription, setEditedDescription] = useState(initialDescription);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        apiEndpoint,
        { title: editedTitle, description: editedDescription },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditedTitle(response.data.title);
      setEditedDescription(response.data.description);
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

  return {
    isEditing,
    editedTitle,
    editedDescription,
    handleEditClick,
    handleSaveClick,
    handleTitleChange,
    handleDescriptionChange,
    handleKeyDown,
  };
};
