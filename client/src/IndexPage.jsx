const API_URL = import.meta.env.VITE_API_URL;
import { useEffect } from "react"
import { Post } from "./Post";
import { useState } from "react";

export function IndexPage(){
    const [posts,setPosts] = useState([])
    
    useEffect(()=>{
        fetch(`${API_URL}/post`).then(response =>{
            response.json().then(posts=> {
                setPosts(posts);
            });
        });
    },[]);

    return(
    <div className="
        min-h-screen py-8 
        bg-fixed bg-center bg-cover 
        bg-[url('https://i.pinimg.com/736x/ea/7c/1a/ea7c1a8e3e1a99a1c5397124c86d769c.jpg')] 
    ">
    {posts.length > 0 && posts.map(post =>(
        <Post key={post._id} {...post} />
    ))}
    </div>)
    ;
}