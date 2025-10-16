import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const navigate = useNavigate();
  //const 
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if(credentials.username && credentials.password){
      sessionStorage.setItem("isAuthenticated","true");
      sessionStorage.setItem("authorName",credentials.username);
      console.log(sessionStorage.authorName);
    }

    try {
      const response = await fetch(`http://localhost:5000/${isAdmin ? 'adminLogin' : 'login'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          isAdmin: isAdmin,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);

        console.log("Login Success:", data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", isAdmin);

        // ✅ Redirect based on role
        if (isAdmin) {
          navigate("/adminhome");
        } else {
          navigate("/home");
        }
      } else {
        const errorData = await response.json();
        alert(`Login Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen  bg-gray-100">
      <div className="w-1/2 flex items-center justify-center bg-emerald-100">
      <img src="favicon.png" className='w-96'></img>
      </div>

      <div className="w-1/2 flex items-center justify-center p-10 bg-emerald-50">
        <div className="bg-emerald-200 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isAdmin ? 'Admin Login' : 'User Login'}
          </h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white py-3 rounded-md hover:bg-emerald-600"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            {isAdmin ? (
              <button onClick={() => setIsAdmin(false)} className="text-blue-500">
                Switch to User Login
              </button>
            ) : (
              <button onClick={() => setIsAdmin(true)} className="text-blue-500">
                Login as Admin
              </button>
            )}
          </p>

          {!isAdmin && (
            <p className="text-center mt-2 text-gray-600">
              Not registered?{' '}
              <button onClick={() => navigate("/signup")} className="text-blue-500">
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
