import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg">
            Discover the story behind <span className="font-semibold">Our Blog</span> and the passion that drives us.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Mission Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold">Our Blog</span>, we strive to inspire, educate, and connect readers through high-quality, engaging content. 
            Our mission is to empower individuals to explore new ideas and foster meaningful conversations.
          </p>
        </div> 

        {/* Vision Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a community where readers feel informed, inspired, and connected. 
            Through our platform, we aim to create a space where knowledge flows freely, creativity flourishes, and everyone finds a voice.
          </p>
        </div>

        {/* Team Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Meet the Team</h2>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="text-center">
              <img
                src="profile.webp"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">Mr.Ranjith Kumar</h3>
              <p className="text-gray-500 text-sm">Founder & Guide</p>
            </div>
            <div className="text-center">
              <img
                src="profile.webp"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">B.Pavan Kalyan</h3>
              <p className="text-gray-500 text-sm">Developer</p>
            </div>
            <div className="text-center">
              <img
                src="profile.webp"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">G.Yadagiri</h3>
              <p className="text-gray-500 text-sm">Content Manager</p>
            </div>
            <div className="text-center">
              <img
                src="profile.webp"
                alt="Team Member"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">M.Rahul</h3>
              <p className="text-gray-500 text-sm">Designer</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
          <p className="mb-6">
            Become part of our growing community by exploring our blog or connecting with us on social media.
          </p>
          <a
            href="/contact"
            className="bg-white text-blue-500 hover:text-blue-600 py-2 px-6 rounded-full font-semibold transition duration-300"
          >
            Contact Us
          </a>
        </div>
        <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            >
              ← Back
        </button>
      </div>
    </div>
  );
}

export default AboutUs;