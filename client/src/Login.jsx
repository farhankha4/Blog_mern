const API_URL = import.meta.env.VITE_API_URL;
import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { PenLine } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function log(e) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/login`, {
      method: "post",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong credentials. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8 bg-gradient-to-br from-indigo-50 via-sky-100 to-indigo-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 group"
          >
            <PenLine className="w-10 h-10 text-indigo-600 transition-colors group-hover:text-indigo-800" />
            <span className="text-4xl font-extrabold tracking-tight text-gray-900">
              InkEcho
            </span>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-700">
            Sign in to your account
          </h2>
        </div>


        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-100 hover:shadow-indigo-200 transition-all duration-300">
          <form onSubmit={log} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 active:scale-[0.98]"
            >
              Log in
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
