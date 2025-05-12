import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";

const ProductsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(category || "All");
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for all data
  const [data, setData] = useState({
    products: [],
    categories: [],
    testimonials: [],
    faqs: [],
    categoryIcons: {},
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [productsRes, categoriesRes, testimonialsRes, faqsRes] =
          await Promise.all([
            axios.get('https://ishanib.demovoting.com/api/products'),
            axios.get('https://ishanib.demovoting.com/api/productcategories'),
            axios.get('https://ishanib.demovoting.com/api/customertestimonials'),
            axios.get('https://ishanib.demovoting.com/api/faqs'),
          ]);
         
        // Create category icons mapping from categories data
        const categoryIcons = {};
        categoriesRes.data.data.forEach(cat => {
          categoryIcons[cat.name] = cat.icon;
        });

        setData({
          products: productsRes.data.data,
          categories: categoriesRes.data.data,
          testimonials: testimonialsRes.data.data,
          faqs: faqsRes.data.data,
          categoryIcons: categoryIcons
        });

      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set initial filter based on URL
  useEffect(() => {
    if (category) {
      // Find the category that matches the URL path
      const matchedCategory = data.categories.find(cat => 
        cat.name.toLowerCase().replace(/\s+/g, '-') === category
      );
      if (matchedCategory) {
        setActiveFilter(matchedCategory.name);
      }
    }
  }, [category, data.categories]);

  // Filter products
  const filteredProducts = activeFilter === "All"
    ? data.products
    : data.products.filter(product => {
      const productCategory = data.categories.find(cat => cat.id === product.category_id);
      return productCategory?.name === activeFilter;
    });

  // Toggle FAQ
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

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
  if (error) return <ErrorDisplay message={error} />;

//  console.log(data)
  return (
    <section className="bg-white mt-20">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          category={category}
          navigate={navigate}
          categories={data.categories}
        />

        {/* Dynamic Category Header */}
        <CategoryHeader
          category={category}
          activeFilter={activeFilter}
          categories={data.categories}
          filteredProducts={filteredProducts}  // Pass filteredProducts here
        />

        {/* Dynamic Category Filters */}
        {!category && (
          <CategoryFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            navigate={navigate}
            categories={data.categories}
          />
        )}

        {/* Category Benefits */}
        {category && (
          <CategoryBenefits
            category={activeFilter}
            // benefits={data.benefits}
            categories={data.categories}
          />
        )}

        {/* Product Grid */}
        <ProductGrid
          filteredProducts={filteredProducts}
          categories={data.categories}
          categoryIcons={data.categoryIcons}
        />

        {/* Common: Why Choose Us Section */}
        <WhyChooseUs />

        {/* Common: Testimonials */}
        <TestimonialsSection testimonials={data.testimonials} />

        {/* Common: FAQ */}
        <FAQSection
          faqs={data.faqs}
          activeFAQ={activeFAQ}
          toggleFAQ={toggleFAQ}
        />

        {/* Common: CTA */}
        <CTASection />
      </div>
    </section>
  );
};




// Error Display Component
const ErrorDisplay = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto mt-10">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          {message || 'An error occurred while loading data.'}
        </p>
      </div>
    </div>
  </div>
);

// Component: Breadcrumbs
const Breadcrumbs = ({ category, navigate, categories }) => {
  // Generate path map dynamically from categories
  const pathToCategoryMap = categories.reduce((acc, cat) => {
    const path = cat.name?.toLowerCase().replace(/\s+/g, '-');
    acc[path] = cat.name;
    return acc;
  }, {});
  return (
    <div className="flex items-center mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-yellow-600 hover:text-yellow-700 mr-4"
      >
        <FiArrowLeft className="mr-1" /> Back
      </button>
      <nav className="text-sm text-gray-600">
        <span
          className="hover:text-yellow-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </span>
        <span className="mx-2">/</span>
        <span
          className="hover:text-yellow-600 cursor-pointer"
          onClick={() => navigate("/products")}
        >
          Products
        </span>
        {category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-yellow-600">
              {categories.find(cat => 
                cat.name.toLowerCase().replace(/\s+/g, '-') === category
              )?.name || category.replace(/-/g, " ")}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};

// Component: Category Header
const CategoryHeader = ({ category, activeFilter, categories, filteredProducts }) => {
  // Find current category details
  const currentCategory = categories.find(cat => 
    cat.name === (activeFilter || (category && category.replace(/-/g, " "))
  ))|| {};

  return (
    <motion.div
      className="text-left mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-3">
        {category ? 
          (currentCategory?.name || category.replace(/-/g, " ").toUpperCase()) : 
          "Premium Door Solutions"
        }
      </h2>
      <motion.div
        className="h-1 w-16 bg-yellow-500 mb-6"
        initial={{ width: 0 }}
        animate={{ width: "4rem" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <p className="text-gray-600 max-w-2xl mb-4">
        {currentCategory?.description || "Explore our complete range of premium doors, windows, and security solutions"}
      </p>
      <p className="text-gray-500 text-sm">
        {category
          ? (currentCategory?.collection_text_template
            ? currentCategory.collection_text_template
              .replace('{category}', currentCategory.name?.toLowerCase())
              .replace('{count}', filteredProducts.length)
              .replace('{descriptor}', currentCategory.product_descriptor.toLowerCase() || 'products')
            : `Browse our ${currentCategory.name?.toLowerCase()} collection`
          )
          : (currentCategory?.homepage_text || "Trusted by 5000+ homeowners across India since 2010")
        }
      </p>
    </motion.div>
  );

};

// Component: Category Filters
const CategoryFilters = ({ activeFilter, setActiveFilter, navigate, categories }) => {
  return (
    <motion.div
      className="flex flex-wrap gap-3 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {categories.map((cat) => {
        const path = cat.name.toLowerCase().replace(/\s+/g, '-');
        return (
          <button
            key={path}
            onClick={() => {
              setActiveFilter(cat.name);
              navigate(`/products/${path}`);
            }}
            className={`px-4 py-2 rounded-full transition-all ${activeFilter === cat.name
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {cat.name}
          </button>
        );
      })}
      <button
        onClick={() => {
          setActiveFilter("All");
          navigate("/products");
        }}
        className={`px-4 py-2 rounded-full transition-all ${activeFilter === "All"
          ? "bg-yellow-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        View All
      </button>
    </motion.div>
  );
};

// Component: Category Benefits
const CategoryBenefits = ({ category, categories }) => {
  // Find the current category with its benefits
  const currentCategory = categories.find(c => c.name === category);

  return (
    <div className="mb-12 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Why Choose Our {category}?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentCategory?.benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <div className="text-yellow-500 mr-3 mt-1">
              {"✓"}
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{benefit.title}</h4>
              {benefit.description && (
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Update ProductGrid to pass categoryIcons
const ProductGrid = ({ filteredProducts, categories, categoryIcons }) => (
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
      <ProductCard
        key={product.id}
        product={product}
        categories={categories}
        categoryIcons={categoryIcons}
      />
    ))}
  </motion.div>
);

// Component: Product Card
const ProductCard = ({ product, categories, categoryIcons }) => {
  const category = categories.find(cat => cat.id === product.category_id);
  const navigate = useNavigate();
  return (
    <motion.div
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
          className="w-full h-full  transition-transform hover:scale-105"
          loading="lazy"
        />
        {/* <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          ₹{Number(product.price).toLocaleString('en-IN')}
        </span> */}
      </div>
      <div className="p-5">
        {category && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryIcons[category.name]}</span>
            <span className="text-sm font-medium text-yellow-600">
              {category.name}
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <button onClick={()=>{navigate(`/contactus`)}} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition">
          Enquire Now
        </button>
      </div>
    </motion.div>
  );
};

// Component: Why Choose Us
const WhyChooseUs = () => (
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      Why Choose Ishani Enterprises?
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        {
          icon: "🏭",
          title: "15+ Years Experience",
          desc: "Trusted manufacturer since 2008",
        },
        {
          icon: "🛡",
          title: "Premium Materials",
          desc: "Using only certified raw materials",
        },
        {
          icon: "👷",
          title: "Expert Installation",
          desc: "Trained professionals for perfect fitting",
        },
        {
          icon: "📝",
          title: "5-10 Year Warranty",
          desc: "Comprehensive coverage on all products",
        },
      ].map((item, index) => (
        <div key={index} className="text-center p-4">
          <div className="text-4xl mb-3">{item.icon}</div>
          <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
          <p className="text-gray-600 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Component: Testimonials
const TestimonialsSection = ({ testimonials }) => (
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      What Our Customers Say
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
           {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`text-2xl mr-1 ${
                  i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </div>
            ))}
          </div>
          <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
          <div className="flex items-center">
            <div className="font-medium text-gray-800">{testimonial.name}</div>
            <div className="mx-2 text-gray-400">•</div>
            <div className="text-gray-500 text-sm">{testimonial.location}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Component: FAQ
const FAQSection = ({ faqs, activeFAQ, toggleFAQ }) => (
  <div className="mt-16 border-t pt-12">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      Frequently Asked Questions
    </h3>
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b pb-4">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-800"
            onClick={() => toggleFAQ(index)}
          >
            <span>{faq.question}</span>
            <span className="text-xl">{activeFAQ === index ? "−" : "+"}</span>
          </button>
          {activeFAQ === index && (
            <div className="mt-2 text-gray-600">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Component: CTA
const CTASection = () => {
  const navigate = useNavigate();
  return(
  <div className="mt-16 bg-yellow-50 rounded-xl p-8 text-center">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Ready to Transform Your Space?
    </h3>
    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
      Get expert advice and a free quote for your project today.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a href="tel:+91905321121" className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition">
        <FiPhone className="mr-2" /> Call Now
      </a>
      <a href="https://wa.me/9422255572?text=Hello%20there!" className="flex items-center justify-center border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium py-3 px-6 rounded-lg transition">
        <FiMessageSquare className="mr-2" /> WhatsApp Us
      </a>
      <button onClick={() => navigate('/factory-outlet/#book-visit')} className="flex items-center justify-center border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium py-3 px-6 rounded-lg transition">
        <FiCalendar className="mr-2" /> Book Consultation
      </button>
    </div>
  </div>
  )
};

// Helper functions
// function getCategoryDescription(category) {
//   const descriptions = {
//     All: "Explore our complete range of premium doors, windows, and security solutions",
//     "uPVC French Doors":
//       "Energy-efficient uPVC French doors with superior insulation",
//     "Aluminum French Doors": "Durable and sleek aluminum French doors",
//     "Sliding & Folding Doors": "Space-saving sliding and folding door systems",
//     "Custom Design Options": "Bespoke door and window solutions",
//   };
//   return descriptions[category] || "Premium quality products for Indian homes";
// }

// function getCategoryStats(category) {
//   const stats = {
//     "uPVC French Doors": "6 premium",
//     "Aluminum French Doors": "5 durable",
//     "Sliding & Folding Doors": "5 space-saving",
//     "Custom Design Options": "4 bespoke",
//   };
//   return stats[category] || "multiple";
// }

export default ProductsPage;