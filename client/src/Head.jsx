import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { PenLine } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function Head() {
  const { setUserInfo, userInfo, isLoading } = useContext(UserContext);

  function logout() {
    fetch(`${API_URL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;
  const buttonClasses =
    "text-sm md:text-base px-3 py-1 border rounded-lg transition-colors font-semibold";

  const navContent = isLoading ? (
    <div className="w-24 h-5 bg-indigo-400 rounded animate-pulse"></div>
  ) : (
    <div className="flex items-center space-x-5 font-medium">
      {username ? (
        <>
          <span className="text-indigo-100 text-sm md:text-base font-medium">
            👋 Hi, <span className="font-semibold">{username}</span>
          </span>

          <Link
            to="/create"
            className={`${buttonClasses} border-indigo-200 text-indigo-200 hover:bg-indigo-700 hover:text-white`}
          >
            + New Post
          </Link>

          <button
            onClick={logout}
            className="text-sm md:text-base text-indigo-100 hover:text-red-300 transition-colors font-semibold"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-white hover:text-indigo-200 transition-colors font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            className={`${buttonClasses} border-white bg-white text-indigo-600 hover:bg-indigo-100`}
          >
            Register
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="flex items-center justify-between py-4 px-6 md:px-10 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white sticky top-0 z-10 shadow-md backdrop-blur-md bg-opacity-90">
      <Link
        to="/home"
        className="inline-flex items-center gap-2 group hover:scale-[1.02] transition-transform duration-300"
      >
        <PenLine className="w-6 h-6 text-white group-hover:text-indigo-100 transition-colors" />
        <span className="text-2xl font-extrabold tracking-tight">InkEcho</span>
      </Link>

      {navContent}
    </header>
  );
}
