import React, { useRef } from "react";
import { FaExchangeAlt, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const featuresRef = useRef(null);
  const exploreRef = useRef(null);
  const navigate = useNavigate();

  const scrollToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToExplore = () =>
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-yellow-100 font-sans text-gray-900 transition duration-300">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl sm:text-2xl">
          <FaExchangeAlt className="text-pink-500 text-2xl sm:text-3xl" />
          <span className="tracking-wide text-lg sm:text-xl">
            Swap<span className="text-pink-500">Skill</span>
          </span>
        </div>

        {/* Desktop Nav (only visible on sm and up) */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-5 font-bold text-sm sm:text-base">
          <button
            onClick={scrollToFeatures}
            className="hover:text-blue-600 px-2 sm:px-3"
          >
            Features
          </button>
          <button
            onClick={scrollToExplore}
            className="hover:text-blue-600 px-2 sm:px-3"
          >
            Explore
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-pink-500 hover:bg-pink-600 text-white py-1.5 px-4 sm:py-2 sm:px-5 rounded-full shadow-md transition text-xs sm:text-sm"
          >
            Join Now
          </button>
        </div>

        {/* Mobile Nav (only visible on xs screen) */}
        <div className="sm:hidden">
          <button
            onClick={() => navigate("/login")}
            className="bg-pink-500 hover:bg-pink-600 text-white py-1.5 px-4 rounded-full shadow-md transition text-xs"
          >
            Join Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto relative">
        {/* Animated background glow */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -z-10 w-96 h-96 bg-pink-400 rounded-full opacity-30 blur-3xl animate-pulse dark:bg-pink-600"></div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase tracking-widest text-gray-800 dark:text-gray-300 mb-3">
          Connect, Teach and Learn
        </h2>

        <h1 className="text-[42px] sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-pink-500 via-red-500 to-yellow-600 text-transparent bg-clip-text drop-shadow-lg animate-fade-in-down">
          TOGETHER
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed animate-fade-in-up">
          Join a platform where students, freelancers, and professionals teach &
          learn from each other.
        </p>

        <button
          onClick={scrollToFeatures}
          className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition text-lg animate-fade-in-up"
        >
          🚀 Explore Features
        </button>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="w-full px-4 sm:px-6 py-16 text-center"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-12 leading-tight">
          Features of Platform
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          <div className="bg-white/70 rounded-xl p-6 shadow-md border border-gray-200 text-left">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              🎯 Goal / Purpose
            </h3>
            <ul className="space-y-3">
              <li className="bg-white rounded-lg p-3 shadow-sm">
                ✔ Help users teach skills they know
              </li>
              <li className="bg-white rounded-lg p-3 shadow-sm">
                ✔ Let others learn skills for free
              </li>
              <li className="bg-white rounded-lg p-3 shadow-sm">
                ✔ Build a community of mutual learning
              </li>
              <li className="bg-white rounded-lg p-3 shadow-sm">
                ✔ Open to everyone (students, freelancers, professionals)
              </li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-xl p-6 shadow-md border border-gray-200 text-left">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              🧑‍🏫💻 Use Case Examples
            </h3>
            <ul className="space-y-3 list-disc list-inside text-gray-800 text-base leading-relaxed">
              <li className="bg-white rounded-lg p-3 shadow-sm">
                <strong>John</strong> knows UI/UX — he teaches it to{" "}
                <strong>Priya</strong>.
              </li>
              <li className="bg-white rounded-lg p-3 shadow-sm">
                <strong>Nimish</strong> teaches Java to <strong>Ali</strong>, who
                helps her with Python basics.
              </li>
              <li className="bg-white rounded-lg p-3 shadow-sm">
                <strong>Ajay</strong> helps <strong>Ram</strong> with Figma, and
                learn React in exchange.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10">
          <button
            onClick={scrollToExplore}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold shadow transition"
          >
            Explore More
          </button>
        </div>
      </section>

      {/* Explore Section */}
      <section
        ref={exploreRef}
        className="w-full px-4 sm:px-6 py-16 text-center"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-8 leading-tight">
          Explore Opportunities
        </h2>
        <p className="max-w-xl mx-auto text-base sm:text-lg mb-12">
          Find learners and mentors. Start exchanging your skills today!
        </p>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto">
          {/* Example Card 1 */}
          <div className="bg-white/80 border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-[1.02] text-left">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User 1"
                className="w-16 h-16 rounded-full border-2 border-blue-500"
              />
              <div>
                <h3 className="text-xl font-semibold">Ravi Mehra</h3>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <p>
              <strong>Knows:</strong> Data Structures, Java
            </p>
            <p>
              <strong>Wants to Learn:</strong> UI/UX, JavaScript
            </p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Request to Learn
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Offer to Teach
              </button>
            </div>
          </div>

          {/* Example Card 2 */}
          <div className="bg-white/80 border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-[1.02] text-left">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User 2"
                className="w-16 h-16 rounded-full border-2 border-pink-500"
              />
              <div>
                <h3 className="text-xl font-semibold">Neha Sharma</h3>
                <p className="text-sm text-gray-500">Freelancer</p>
              </div>
            </div>
            <p>
              <strong>Knows:</strong> UI/UX Design, Figma
            </p>
            <p>
              <strong>Wants to Learn:</strong> DSA, Python
            </p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Request to Learn
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                Offer to Teach
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center py-12">
          <button
            onClick={() => navigate("/login")}
            className="bg-pink-500 hover:bg-pink-600 w-11/12 sm:w-3/4 md:w-[600px] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition text-lg"
          >
            Join Now and Start Swapping Skills
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-8 px-6 flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base">
        <div className="mb-4 sm:mb-0 flex items-center gap-2 text-center sm:text-left">
          <FaLinkedin className="text-blue-400 text-lg" />
          <span>
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/nekalsingh/"
              className="text-blue-400 hover:text-blue-300 transition no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nekal Singh
            </a>
          </span>
        </div>
        <div className="text-center sm:text-right">
          <p>Any Suggestions?</p>
          <a
            href="mailto:nekalsingh987@gmail.com"
            className="text-red-400 hover:text-red-300 transition"
          >
            nekalsingh987@gmail.com
          </a>
          <p className="mt-1 text-gray-400 text-xs">
            © {new Date().getFullYear()} SwapSkill. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
