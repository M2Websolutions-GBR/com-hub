import React, { useEffect, useState } from "react";

import ProfileService from "../services/ProfileService";
import { toast } from "react-toastify";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";

export default function SettingsView() {
  const [userId, setUserId] = useState();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [channelName, setChannelName] = useState("");
  const { sideMenuOpen } = useSideMenuOpen();

  useEffect(() => {
    const fetchProfileAndUser = async () => {
      try {
        await ProfileService.getProfile(
          setAboutText,
          setUserData,
          setAvatarUrl
        );
        const userData = await ProfileService.getUser();
        setUserId(userData.data.id);
      } catch (error) {
        console.error("Failed to fetch profile or user ID:", error);
      }
    };

    fetchProfileAndUser();
  }, [setAboutText, setUserData, setAvatarUrl]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      await ProfileService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!", {
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password. Please try again.");
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await ProfileService.changeEmail(email);
      setUserData((prev) => ({ ...prev, email }));
      toast.success("Email changed successfully!", {
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to change email. Please try again.");
    }
  };

  const handleChannelNameChange = async (e) => {
    e.preventDefault();
    try {
      await ProfileService.changeChannelName(channelName);
      setUserData((prev) => ({ ...prev, channelName }));
      toast.success("Channel name changed successfully!", {
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to change channel name. Please try again.");
    }
  };

  return (
    <div
      className={`flex items-center flex-col h-screen transition-all duration-300 ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold">Settings</h2>

      <div className="w-full max-w-md">
        {/* Change Password Form */}
        <form
          onSubmit={handlePasswordChange}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-lg"
        >
          <h3 className="mb-4 text-xl font-semibold">Change Password</h3>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#155e75] text-white px-4 py-2 rounded hover:bg-[#0e4f64] focus:outline-none focus:ring-2 focus:ring-[#155e75]"
          >
            Save
          </button>
        </form>

        {/* Change Email Form */}
        <form
          onSubmit={handleEmailChange}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-lg"
        >
          <h3 className="mb-4 text-xl font-semibold">Change Email</h3>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              New Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#155e75] text-white px-4 py-2 rounded hover:bg-[#0e4f64] focus:outline-none focus:ring-2 focus:ring-[#155e75]"
          >
            Save
          </button>
        </form>

        {/* Change Channel Name Form */}
        <form
          onSubmit={handleChannelNameChange}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-lg"
        >
          <h3 className="mb-4 text-xl font-semibold">Change Channel Name</h3>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              New Channel Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#155e75] text-white px-4 py-2 rounded hover:bg-[#0e4f64] focus:outline-none focus:ring-2 focus:ring-[#155e75]"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
