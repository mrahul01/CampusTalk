import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const authorName = sessionStorage.authorName;
  console.log(authorName);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        file: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags(value.split(",").map(tag => tag.trim()).filter(tag => tag !== ""));
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("author",authorName);
    formData.append("tags", tags.join(","));
    if (image) formData.append("image", image.file); // Access actual file object
  
    try {
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Blog posted successfully!");
        navigate("/home"); // or wherever you want to go
      } else {
        alert("Failed to post blog: " + result.error);
      }
    } catch (err) {
      console.error("Error posting blog:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center tracking-tight">
          ✍️ Create Blog
        </h1>

        <div className="space-y-5 bg-slate-50">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Your Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-lg bg-white/90"
          />

          {/* Body Textarea */}
          <textarea
            placeholder="What's on your mind?"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-lg bg-white/90 resize-none"
          />

          {/* Tags Input */}
          <input
            type="text"
            placeholder="Enter Tags (comma separated)"
            onChange={handleTagsChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-lg bg-white/90"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-violet-600 text-white py-1 px-3 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Image Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200 transition-all"
            />
          </div>

          {/* Image Preview */}
          {image && (
            <div className="mt-4 text-center">
              <img
                src={image.preview}
                alt="Preview"
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              ← Back
            </button>
            <button
              onClick={handlePost}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-800 text-white font-semibold transition"
            >
               Post It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
