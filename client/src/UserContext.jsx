
import { createContext, useState, useEffect } from "react";

// You need to ensure API_URL is accessible here, e.g., by defining it outside or importing it
const API_URL = import.meta.env.VITE_API_URL; 

export const UserContext = createContext({});

export function UserContextProvider({children}){
    // Change initial state from {} to null/undefined for clarity on logged-out state
    const [userInfo, setUserInfo] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); // 👈 NEW: State to track if profile check is finished

    useEffect(() => {
        async function fetchProfile() {
            try {
                // Fetch profile using the token cookie the browser sends
                const response = await fetch(`${API_URL}/profile`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data); // Set user info if valid token found
                } else {
                    setUserInfo(null); // Clear state if token is invalid/expired
                }
            } catch (error) {
                console.error("Profile check failed:", error);
                setUserInfo(null);
            } finally {
                setIsLoading(false); // 👈 CRITICAL: Set loading to false when check is done
            }
        }
        
        // Only run this check if userInfo is null (i.e., on initial load/refresh)
        if (!userInfo) {
            fetchProfile();
        } else {
            setIsLoading(false); // User is already known, so stop loading
        }
    }, [userInfo]); // Re-run if userInfo changes (e.g., after login/logout)

    return(
        // 👈 Include isLoading in the context value
        <UserContext.Provider value = {{userInfo, setUserInfo, isLoading}}> 
            {children}
        </UserContext.Provider>
    )    
}