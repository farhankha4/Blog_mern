
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-blue-100 flex flex-col items-center justify-center px-6 text-center">
      {/* Hero Section */}
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
          Welcome to <span className="text-blue-500">InkEcho</span>
        </h1>
        <p className="text-lg md:text-xl text-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 mb-8">
          Your personal space to share stories, insights, and creativity with the world.
          Start writing today and make your voice heard.
        </p>

        <button
          onClick={() => navigate("/Register")}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </button>
      </div>

      <div className="mt-12">
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80"
          alt="Blogging Illustration"
          className="rounded-2xl shadow-xl w-full max-w-4xl object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>


      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          {
            title: "Express Yourself",
            desc: "Share your thoughts freely and inspire others with your writing.",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVG-2eHpi-zhcyLL-9LkZiUGuO8cMCmxjdHw&s",
          },
          {
            title: "Build Your Audience",
            desc: "Reach people who love your content and grow your following organically.",
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
          },
          {
            title: "Beautiful Simplicity",
            desc: "Write in a distraction-free editor and enjoy a seamless experience.",
            img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <img src={feature.img} alt={feature.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>


      <footer className="mt-20 mb-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} InspireBlog. All rights reserved.
      </footer>
    </div>
  );
}
