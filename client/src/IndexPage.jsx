const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { Post } from "./Post";

export function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/post`).then((response) => {
            response.json().then((posts) => {
                setPosts(posts);
            });
        });
    }, []);

    return (
        <div
            className="
            min-h-screen 
            bg-fixed bg-center bg-cover 
            bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')]


            bg-no-repeat
            text-gray-900
            "
        >
            <div className="backdrop-blur-sm bg-white/70 min-h-screen py-8 px-4 sm:px-8">
                {posts.length > 0 ? (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {posts.map((post) => (
                            <Post key={post._id} {...post} />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <p className="text-lg text-gray-600 animate-pulse">
                            Fetching stories for you...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
