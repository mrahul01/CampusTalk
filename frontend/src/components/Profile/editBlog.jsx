import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: "",
    isPublished: false,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${id}`);
        const { title, body, tags, isPublished } = res.data;
        setFormData({
          title,
          body,
          tags: tags.join(", "),
          isPublished,
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/posts/${id}`, formData);
      navigate("/viewblogs");
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-200 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Body</label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="6"
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          <label>Published</label>
        </div>
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-800"
        >
          Update Blog
        </button>
      </form>
      <span className="justify-center">
           <button
              onClick={() => navigate('/viewblogs')}
              className="px-6 py-3 rounded-xl bg-gray-400 hover:bg-gray-500 text-gray-800 font-medium transition"
            >
              ← Back
            </button>
            </span>
    </div>
  );
};

export default EditBlog;
