import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ userCount: 0, postCount: 0 });
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.setItem("logout", Date.now());
    navigate("/");
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to toggle");

      const data = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userId === userId ? { ...user, isAllowed: data.isAllowed } : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  // ✅ Added delete function
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/posts/${id}`, {
        method: "DELETE",
      });
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/userCount");
        const userData = await userRes.json();

        const postRes = await fetch("http://localhost:5000/postCount");
        const postData = await postRes.json();

        setSummary({ userCount: userData.userCount, postCount: postData.postCount });
      } catch (error) {
        console.error("Failed to fetch admin summary:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchSummary();
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Campus Talks</h2>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => setActiveTab("dashboard")} className="text-left hover:text-blue-500">Dashboard</button>
          <button onClick={() => setActiveTab("posts")} className="text-left hover:text-blue-500">Posts</button>
          <button onClick={() => setActiveTab("users")} className="text-left hover:text-blue-500">Users</button>
          <button onClick={() => setActiveTab("settings")} className="text-left hover:text-blue-500">Settings</button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome, Admin 👋</h1>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-medium">Total Posts</h3>
                <p className="text-2xl font-bold text-blue-500">{summary.postCount}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-medium">Registered Users</h3>
                <p className="text-2xl font-bold text-green-500">{summary.userCount}</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "posts" && (
          <>
            <h2 className="text-xl font-bold mb-4">All Blog Posts</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{new Date(post.createdAt).toLocaleString()}</p>
                  <p className="text-gray-700 mb-2">{post.body.slice(0, 100)}...</p>
                  <div className="flex gap-2">
                    {/* ✅ Hooked delete button to handleDelete */}
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2 className="text-xl font-bold mb-4">Registered Users</h2>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">User ID: {user.userId}</p>
                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                    <p className="text-sm text-gray-600">Role: {user.role}</p>
                    <p className="text-sm text-gray-600">Bio: {user.bio}</p>
                    <p className="text-sm text-gray-600">Search History: {user.searchHistory.join(", ")}</p>
                    <p className="text-sm text-gray-600">Viewed Posts: {user.viewedPosts.length}</p>
                    <p className="text-sm text-gray-600">Joined: {new Date(user.createdAt).toLocaleString()}</p>
                    {user.image && <img src={`http://localhost:5000/uploads/${user.image}`} alt="User" className="w-16 h-16 mt-2 rounded-full" />}
                  </div>
                  <div>
                    <button
                      onClick={() => toggleUserStatus(user.userId, user.isAllowed)}
                      className={`px-4 py-2 rounded font-semibold ${user.isAllowed ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                    >
                      {user.isAllowed ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <div className="pt-4 border-t">
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
