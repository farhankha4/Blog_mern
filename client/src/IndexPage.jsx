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
            bg-[url('https://cdn.wallpapersafari.com/84/67/VXHLqb.jpg')]


            bg-no-repeat
            text-gray-900
            "
        >
            <div className=" min-h-screen py-8 px-4 sm:px-8">
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
