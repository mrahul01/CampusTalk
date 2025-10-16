import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const authorName = sessionStorage.getItem("authorName");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (!isAuthenticated) navigate("/");

    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/userPosts");
        const userBlogs = res.data.filter((post) => post.author === authorName);
        setBlogs(userBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [authorName, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow-md p-4 rounded-lg flex gap-4 items-center">
              <img
                src={`http://localhost:5000/${blog.image}`}
                alt="Blog"
                className="w-24 h-24 object-cover rounded-full border-2"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm truncate">
                  {blog.body.slice(0, 100)}...
                </p>
                <div className="mt-2 flex space-x-3">
                  <Link
                    to={`/editblog/${blog._id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                
              </div>
              
            </div>
            
          ))}
          <span className="justify-center">
           <button
              onClick={() => navigate('/profile')}
              className="px-6 py-3 rounded-xl bg-gray-400 hover:bg-gray-500 text-gray-800 font-medium transition"
            >
              ← Back
            </button>
            </span>
        </div>
        
      )}
    </div>
  );
};

export default ViewBlogs;
