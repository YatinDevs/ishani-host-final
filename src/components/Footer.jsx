import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { navlogo } from "../../public/assets";

const Footer = () => {
  const socialIcons = [
    { icon: FaFacebookF, label: "Facebook" },
    { icon: FaTwitter, label: "Twitter" },
    { icon: FaYoutube, label: "YouTube" },
    { icon: FaInstagram, label: "Instagram" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-100 text-gray-800 pt-16 pb-8 px-6 md:px-16 rounded-t-3xl shadow-inner"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Section - Contact */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={navlogo}
            alt="Ishani Enterprises Logo"
            className="mb-6 w-40"
          />
          <h3 className="text-xl font-semibold mb-3 text-yellow-500 flex items-center gap-2">
            <IoCallOutline size={20} className="text-yellow-500" />
            Contact Us
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Got something to say? Please drop us a line.
          </p>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start gap-2">
              <IoLocationOutline size={20} className="text-yellow-500 mt-1" />
              <span>
                <strong>Corp. Office:</strong>
                <br />
                Ishani Enterprises
                <br />
                G-8, Prestige Bytco Business Center,
                <br />
                Bytco Point, Nasik Road,
                <br />
                Nasik - 422101
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineEmail size={20} className="text-yellow-500" />
              ishanient@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <IoCallOutline size={20} className="text-yellow-500" />
              +91 253 2465140 | +91 94222 55572
            </li>
          </ul>
        </motion.div>

        {/* Right Section - Social */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-yellow-500">
            Stay Connected
          </h3>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>Google: Keep up to date with news & announcements</li>
            <li>Facebook: See our latest portfolio & gallery</li>
            <li>Twitter: Follow us, ask questions & geek out</li>
            <li>YouTube: Watch our videos & success stories</li>
          </ul>
          <div className="flex gap-6 mt-4">
            {socialIcons.map(({ icon: Icon, label }, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                title={label}
                className="cursor-pointer bg-white border border-gray-300 p-3 rounded-full shadow-sm hover:bg-yellow-100 text-gray-600 hover:text-yellow-600"
              >
                <Icon size={20} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
        <p>
          © 2016{" "}
          <span className="font-semibold text-gray-800">
            Ishani Enterprises
          </span>
          . All Rights Reserved by{" "}
          <span className="font-bold text-yellow-500">
            Rich System Solution
          </span>
          .{" "}
          <a href="#" className="text-yellow-600 hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="text-yellow-600 hover:underline">
            Security Policy
          </a>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
