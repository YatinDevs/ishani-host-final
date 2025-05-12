import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both products and categories
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://ishanib.demovoting.com/api/products"),
          axios.get("https://ishanib.demovoting.com/api/productcategories"),
        ]);

        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create category map for easy lookup
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = {
      icon: category.icon,
      descriptor: category.product_descriptor
    };
    return acc;
  }, {});

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category.name === activeFilter);

  if (loading) return null;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" id="products">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Our Product Range
          </h2>
          <motion.div
            className="h-1 w-16 bg-yellow-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore premium doors, windows, and security solutions for modern
            Indian homes.
          </p>
        </motion.div>

        {/* Desktop Filter Bar */}
        <motion.div
          className="hidden md:flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {["All", ...categories.map((cat) => cat.name)].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeFilter === category
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">
                {category === "All" ? "🌟" : categoryMap[category]?.icon}
              </span>
              {category}
            </button>
          ))}
        </motion.div>

        {/* Mobile Filter */}
        <div className="md:hidden mb-6 relative">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-between w-full max-w-xs mx-auto bg-yellow-500 text-white px-5 py-3 rounded-full shadow"
          >
            <div className="flex items-center gap-2">
              <FiFilter />
              <span>{activeFilter === "All" ? "All Categories" : activeFilter}</span>
            </div>
            <FiChevronDown
              className={`transition-transform ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile Dropdown */}
          {showMobileFilters && (
            <motion.div
              className="absolute z-10 w-full max-w-xs mx-auto mt-2 bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {["All", ...categories.map((cat) => cat.name)].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveFilter(category);
                    setShowMobileFilters(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left ${
                    activeFilter === category
                      ? "bg-yellow-100 text-yellow-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">
                    {category === "All" ? "🌟" : categoryMap[category]?.icon}
                  </span>
                  <span>{category}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://ishanib.demovoting.com/uploads/${product.image}`}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
                {/* <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span> */}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {product.category?.icon}
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    {product.category?.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <button onClick={()=>{navigate(`/contactus`)}}  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition">
                  Enquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-yellow-600 font-medium hover:text-yellow-700"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurProducts;