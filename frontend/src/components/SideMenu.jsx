import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import React from "react";

const SideMenu = ({ isOpen }) => {
  return (
    <div
      className={`bg-white text-black w-60 fixed top-0 left-0 bottom-0 transition-transform ease-in-out transform border border-gray-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex flex-col`}
      style={{ marginTop: "72px" }}
    >
      <ul className="flex flex-col flex-grow h-full list-none">
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/home" className="block px-4 py-2 rounded">
            Home
          </Link>
        </li>
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/profile" className="block px-4 py-2 rounded">
            Profile
          </Link>
        </li>
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/subscription" className="block px-4 py-2 rounded">
            Subscriptions
          </Link>
        </li>
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/liked" className="block px-4 py-2 rounded">
            Liked
          </Link>
        </li>
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/history" className="block px-4 py-2 rounded">
            History
          </Link>
        </li>
        <li className="py-2 border-gray-300 hover:bg-gray-100">
          <Link to="/settings" className="block px-4 py-2 rounded">
            Settings
          </Link>
        </li>
      </ul>

      <div className="p-4 bg-[#155e75] text-white">
        <div>
          <h5 className="mb-4 text-lg font-semibold">Contact</h5>
          <p>ComHub</p>
          <p>Com Street, California</p>
          <p>Phone: +123 456 7890</p>
          <p>Email: info@comhub.com</p>
        </div>
        <div className="mb-2"></div>
        <div>
          <h5 className="mb-4 text-lg font-semibold">Important Links</h5>
          <ul>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-4"></div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-cyan-600">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="hover:text-cyan-600">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="hover:text-cyan-600">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="hover:text-cyan-600">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        <div>
          <h5 className="mb-4 text-lg font-semibold">
            Subscribe to Newsletter
          </h5>
          <form>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 mb-2 text-black rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white rounded bg-cyan-600 hover:bg-cyan-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
