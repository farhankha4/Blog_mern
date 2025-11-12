const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "./UserContext";
import { PenLine } from "lucide-react";

export function Postpage() {
    const { userInfo } = useContext(UserContext);
    const [postInfo, setPostInfo] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch(`${API_URL}/post/${id}`);
                if (response.ok) {
                    const postInfo = await response.json();
                    setPostInfo(postInfo);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            }
        }
        fetchPost();
    }, [id]);

    if (!postInfo)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-xl text-gray-600">
                Loading post...
            </div>
        );

    const isAuthor = userInfo?.id === postInfo.author._id;

    return (
        <div
            className="min-h-screen bg-fixed bg-center bg-cover 
        bg-[url('https://i.pinimg.com/736x/ea/7c/1a/ea7c1a8e3e1a99a1c5397124c86d769c.jpg')]
            py-12 px-4 md:px-0 bg-fixed bg-cover bg-center"
        >
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight text-center mb-4">
                    {postInfo.title}
                </h1>

                <div className="text-center text-gray-500 mb-8 flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <time className="font-medium">
                        {formatISO9075(new Date(postInfo.createdAt))}
                    </time>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-semibold text-indigo-600">
                        By {postInfo.author.username}
                    </span>
                </div>

                {isAuthor && (
                    <div className="flex justify-center mb-10">
                        <Link
                            className="flex items-center gap-2 px-5 py-2 border border-indigo-600 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
                            to={`/edit/${postInfo._id}`}
                        >
                            <PenLine className="w-5 h-5" />
                            Edit this post
                        </Link>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl shadow-lg mb-12">
                    <img
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        src={postInfo.cover}
                        alt={postInfo.title}
                    />
                </div>

                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed break-words"
                    dangerouslySetInnerHTML={{ __html: postInfo.content }}
                />
            </div>
        </div>
    );
}
