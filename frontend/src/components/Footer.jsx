import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="relative py-8 text-white bg-cyan-800">
      <div className="container px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h5 className="mb-4 text-lg font-semibold">Contact</h5>
            <p>ComHub</p>
            <p>Com Street, California</p>
            <p>Phone: +123 456 7890</p>
            <p>Email: info@comhub.com</p>
          </div>

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
            <h5 className="mb-4 text-lg font-semibold">Follow Us</h5>
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

        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} ComHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
