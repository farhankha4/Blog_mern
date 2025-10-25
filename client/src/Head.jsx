
const API_URL = import.meta.env.VITE_API_URL;
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { PenLine } from 'lucide-react';
export function Head() {

    const { setUserInfo, userInfo, isLoading } = useContext(UserContext); 

    // 💥 REMOVE the useEffect hook that was here previously

    function logout() {
        fetch(`${API_URL}/logout`, {
            credentials: 'include',
            method: 'POST'
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;
    const buttonClasses = 'text-sm md:text-base px-3 py-1 border rounded-lg transition-colors font-semibold';

    // 💥 CRITICAL: Do not render buttons until loading is complete
    const navContent = isLoading ? (
        // Placeholder or skeleton while loading
        <div className='w-20 h-5 bg-indigo-700 rounded animate-pulse'></div>
    ) : (
        <div className='flex items-center space-x-6 font-medium'>
            {username ? (
                <>
                    <span className="text-indigo-200 text-sm md:text-base">Hello, {username}!</span>
                    
                    <Link 
                        to='/create'
                        className={`${buttonClasses} border-indigo-200 text-indigo-200 hover:bg-indigo-700 hover:text-white hidden sm:inline`}
                    >
                        New Post
                    </Link>
                    
                    <button 
                        onClick={logout}
                        className='text-sm md:text-base text-indigo-100 hover:text-red-300 transition-colors font-semibold'
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className='text-white hover:text-indigo-200 transition-colors'>
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
        <header className='flex items-center justify-between py-5 px-6 bg-indigo-600 text-white border-none sticky top-0 z-10 shadow-lg'>
            <Link to="/" className="inline-flex items-center gap-2 group">
                <PenLine className="w-6 h-6 text-white transition-colors group-hover:text-indigo-200" />
                <span className="text-xl font-extrabold tracking-tight text-white">
                    InkEcho
                </span>
            </Link>

            {/* 👈 Render the determined navigation content */}
            {navContent}
        </header>
    );
}