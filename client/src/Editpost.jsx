const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/post/` + id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                });
            });
    }, [id]);

    async function updatePost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch(`${API_URL}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        } else {
            alert('Post update failed.');
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 min-h-screen py-8 
        bg-fixed bg-center bg-cover 
        bg-[url('https://i.pinimg.com/736x/ea/7c/1a/ea7c1a8e3e1a99a1c5397124c86d769c.jpg')]">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                Edit Post
            </h1>
            <form onSubmit={updatePost} className="flex flex-col mx-auto max-w-4xl p-6 bg-white rounded-xl shadow-2xl border border-gray-100">

                <input
                    type="text"
                    className='w-full block border-2 px-4 py-3 mb-4 text-xl border-gray-300 rounded-lg placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none'
                    placeholder="Post Title (required)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="text"
                    className='w-full block border-2 px-4 py-3 mb-4 text-lg border-gray-300 rounded-lg placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition focus:outline-none'
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summary: A brief description of the post"
                />

                <label className="mb-4 block text-gray-700 font-medium">
                    New Cover Image (optional):
                    <input
                        type="file"
                        onChange={e => setFiles(e.target.files)}
                        className="w-full mt-1 border border-indigo-200 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-300 cursor-pointer"
                    />
                </label>

                <div className="mb-8">
                    <Editor value={content} onChange={setContent} />
                </div>

                <button
                    type="submit"
                    className="w-full md:w-1/3 self-center py-3 px-6 text-xl font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-lg active:scale-[0.98]"
                >
                    Update Post
                </button>
            </form>
        </div>
    );
}