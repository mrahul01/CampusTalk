import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const userId = sessionStorage.getItem("authorName") // Replace with dynamic ID if needed
  console.log(userId)
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    email: "",
    year: "",
    interest: "",
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.setItem("logout", Date.now());
    navigate("/");
  };
  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file), // Local preview
      }));
    }
  };

  // Save changes to backend
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("bio", profileData.bio);
      formData.append("email", profileData.email);
      formData.append("year", profileData.year);
      formData.append("interest", profileData.interest);
      if (imageFile) {
        formData.append("image", imageFile); // Matches multer field
      }

      const res = await axios.put(`http://localhost:5000/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileData(res.data.user); // Update with backend response
      setImageFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };
    const navigate = useNavigate();
  
    useEffect(() => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        navigate('/'); // or '/login'
      }
    }, [navigate]);

  // Determine image URL: either preview or server-stored
  const imageUrl = imageFile
    ? profileData.image // preview
    : profileData.image
    ? `http://localhost:5000/uploads/${profileData.image}`
    : "/default-avatar.png"; // fallback

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full border border-gray-200">
        <div className="flex flex-col items-center">
          <label htmlFor="imgUpload" className="cursor-pointer">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-300 shadow-sm object-cover"
            />
            <input
              type="file"
              id="imgUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={!isEditing}
            />
          </label>

          <input
            type="text"
            name="name"
            value={profileData.name}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`text-2xl font-semibold text-blue-800 mt-4 text-center bg-transparent ${
              isEditing ? "border px-2 rounded" : ""
            }`}
          />
          <p className="text-sm text-gray-500"> @RGUKT</p>

          <textarea
            name="bio"
            value={profileData.bio}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`text-lg text-gray-600 mt-2 text-center bg-transparent resize-none w-full ${
              isEditing ? "border px-2 rounded" : ""
            }`}
            rows="3"
          />

          <div className="mt-4 text-sm text-gray-700 w-full text-left space-y-1">
            <p>
              <strong>Email:</strong>{" "}
              <input
                type="email"
                name="email"
                value={profileData.email}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`bg-transparent ${isEditing ? "border px-1 rounded" : ""}`}
              />
            </p>
            <p>
              <strong>Year:</strong>{" "}
              <input
                type="text"
                name="year"
                value={profileData.year}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`bg-transparent ${isEditing ? "border px-1 rounded" : ""}`}
              />
            </p>
            <p>
              <strong>Interest:</strong>{" "}
              <input
                type="text"
                name="interest"
                value={profileData.interest}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`bg-transparent w-full ${isEditing ? "border px-1 rounded" : ""}`}
              />
            </p>
          </div>

          <div className="mt-5 flex space-x-3">
          <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              ← Back
            </button>
          <Link
              to={`/viewblogs`} // Link to view blogs of the user
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition"
            >
              View Blogs
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              LogOut
            </button>
          </div>

          <div className="mt-4 space-x-2">
            <button
              onClick={toggleEdit}
              className={`text-sm ${
                isEditing ? "text-green-600" : "text-blue-600"
              } hover:underline`}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
