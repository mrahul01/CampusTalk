import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => { 
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const postsPerBatch = 5;

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/postss");
        setAllPosts(res.data);
        setVisiblePosts(res.data.slice(0, postsPerBatch));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchAllPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loadingMore &&
        visiblePosts.length < allPosts.length &&
        !searchQuery
      ) {
        loadMorePosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePosts, allPosts, loadingMore, searchQuery]);

  const loadMorePosts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPosts = allPosts.slice(
        visiblePosts.length,
        visiblePosts.length + postsPerBatch
      );
      setVisiblePosts((prev) => [...prev, ...nextPosts]);
      setLoadingMore(false);
    }, 3000);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchedPosts([]);
        setShowSearchPopup(false);
      } else {
        axios
          .get(`http://localhost:5000/posts?search=${searchQuery}`)
          .then((res) => {
            setSearchedPosts(res.data);
            setShowSearchPopup(true);
          })
          .catch((err) => {
            console.error("Search failed:", err);
            setSearchedPosts([]);
            setShowSearchPopup(true);
          });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-gray-300 shadow-md">
      <div className="flex items-center space-x-2">
        <img src="favicon.png" className="w-20" alt="logo" />
        <h1 className="text-xl font-bold">Campus Talks</h1>
      </div>

        <div className="flex justify-between items-center p-4">
          <div className="flex space-x-6 font-bold">
            <h2
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-gray-400 cursor-pointer"
            >
              Home
            </h2>
            <Link to="/contact">
              <h2 className="hover:text-gray-400 cursor-pointer">Contact Us</h2>
            </Link>
            <Link to="/about">
              <h2 className="hover:text-gray-400 cursor-pointer">About Us</h2>
            </Link>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full px-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2 text-gray-400" size={20} />
          </div>
          <Link to='/profile'>
            <User className="text-gray-600" size={28} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="relative h-[400px] bg-cover bg-center flex items-center px-8"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2023/06/27/10/51/pier-8091934_1280.jpg')",
        }}
      >
        <div className="text-white max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
           "Let's Collaborate: Share Ideas, Stories, and Campus Experiences"
          </motion.h2>
          <p className="mt-2 text-lg">
            Join the Campus Community of Writers & Thinkers : our Voice, our Campus, our Blog
          </p>
          <button onClick={() => navigate('/about')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full">
            Read More →
          </button>
        </div>
      </header>

      {/* Blog Posts Section */}
      <section className="p-8">
        <h3 className="text-2xl font-semibold mb-4">Trending Blogs</h3>

        {loadingInitial ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {visiblePosts.map((post, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:scale-105 transition-transform"
              >
                {post.image && (
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt="Blog"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <Link to={`/post/${post._id}`}>
                    <h4 className="text-lg font-medium hover:underline">{post.title}</h4>
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toDateString()}
                  </p>
                </div>
              </motion.div>
            ))}

            {!loadingInitial && visiblePosts.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No blog posts found.</p>
            )}

            {loadingMore && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Search Popup */}
      {showSearchPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowSearchPopup(false);
                setSearchQuery(""); // Optional: clear input
              }}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Search Results</h3>
            {searchedPosts.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {searchedPosts.map((post, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-100 rounded shadow hover:scale-105 transition-transform"
                  >
                    {post.image && (
                      <img
                        src={`http://localhost:5000/${post.image}`}
                        alt="Blog"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <Link to={`/post/${post._id}`}>
                        <h4 className="text-md font-medium hover:underline">{post.title}</h4>
                      </Link>
                      <p className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No posts found.</p>
            )}
          </div>
        </div>
      )}

      {/* Create Blog Button */}
      <div className="fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/create")}
          className="bg-emerald-900 text-white px-6 py-3 rounded-full shadow-lg"
        >
          Create Blog
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
