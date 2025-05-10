import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Calendar, Phone, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FactoryDisplayOutlet = () => {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutletData = async () => {
      try {
        const response = await axios.get(
          "https://ishanib.demovoting.com/api/factoryoutlet"
        );
        setSectionData(response.data?.data || null);
      } catch (error) {
        // console.error("Error fetching factoryoutlet:", error);
        setError("Failed to load factory outlet information");
        setSectionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletData();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] md:h-[700px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Preparing your experience
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-96 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (!sectionData) {
    return (
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-96 flex items-center justify-center">
          <div className="text-gray-500">No factory information available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="relative h-full min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d7500.623762404022!2d73.837825!3d19.953382!3m2!1i1024!2i768!4f13.1!2m1!1sPrestige%20Bytco%20Bussiness%20Center%20Mahatma%20Gandhi%20Rd%20Rajwada%20Nagar%2C%20Nashik%20Road%20Nashik%2C%20Maharashtra%20422214!5e0!3m2!1sen!2sus!4v1744176631879!5m2!1sen!2sus"
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                aria-hidden="false"
                tabIndex="0"
                title="Factory Location Map"
              />
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
                <MapPin className="text-yellow-600 w-5 h-5" />
                <span className="font-medium text-gray-800">
                  {sectionData?.outlet_name || "Nashik Factory Outlet"}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {sectionData?.header || "Our Factory Outlet"}
                </h2>

                {sectionData?.text_content && (
                  <p
                    className="text-gray-600 mb-6 prose"
                    dangerouslySetInnerHTML={{
                      __html: sectionData.text_content,
                    }}
                  />
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">Location</h4>
                      <p className="text-gray-600">
                        {sectionData?.location_line_1}
                        <br />
                        {sectionData?.location_line_2}
                        <br />
                        {sectionData?.location_line_3}
                        <br />
                        {sectionData?.location_line_4}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-yellow-600 mt-1 flex-shrink-0 w-5 h-5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Opening Hours
                      </h4>
                      <p className="text-gray-600">
                        {sectionData?.opening_hours_line_1}
                        <br />
                        {sectionData?.opening_hours_line_2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <motion.a
                  onClick={()=>{navigate(`/contactus`)}}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto cursor-default"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </motion.a>

                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <a
                  href={`tel:${sectionData?.contact_number}`}
                  className="flex items-center justify-center gap-2 text-gray-700 hover:text-yellow-600 font-medium transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {sectionData?.contact_number}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FactoryDisplayOutlet;
