const API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PenLine } from "lucide-react";

export function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    
    async function reg(e){
        e.preventDefault();
        
        const response = await fetch(`${API_URL}/register`, {
            method:'post',
            body: JSON.stringify({ username, password }),
            headers: {'Content-Type':'application/json'}
        });

        if (response.status === 200) {
            setRedirect(true);
        } else {
            alert(`Registration failed.`);
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 min-h-screen py-8 
        bg-fixed bg-center bg-cover 
        bg-[url('https://i.pinimg.com/736x/ea/7c/1a/ea7c1a8e3e1a99a1c5397124c86d769c.jpg')] 
        ">
            <div className="w-full max-w-md space-y-8">
                
                <div className="text-center space-y-4">
                    <Link to="/" className="inline-flex items-center justify-center gap-2 group">
                        <PenLine className="w-10 h-10 text-indigo-600 transition-colors group-hover:text-indigo-800" />
                        <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                            InkEcho
                        </span>
                    </Link>
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Create a new account
                    </h2>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 transition-transform duration-300 hover:shadow-3xl">
                    <form onSubmit={reg} className="space-y-6">
                        
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input 
                                id="username"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input 
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                placeholder="Create a strong password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 active:scale-[0.98]"
                        >
                            Register
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? {' '}
                        <Link 
                            to="/login" 
                            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
}