import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppPopup from "../components/PopUp/WhatsAppPopup";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import axios from "axios";

function Layout() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ishanib.demovoting.com/api/contact"
        );
        // console.log(response);
        setContactData(response.data || null);
      } catch (error) {
        console.error("Error fetching contact information:", error);
        setContactData(null);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://ishanib.demovoting.com/api/productcategories"
        );
        // console.log(response.data.data);
        setCategories(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // console.log(categories)
  return (
    <>
      <ScrollToTop />
      <Navbar categories={categories} />
      <div className="relative ">
        <Outlet />
        <div className="fixed z-50 bottom-8 right-0">
          <WhatsAppPopup />
        </div>
      </div>

      <Footer contactData={contactData} />
    </>
  );
}

export default Layout;
