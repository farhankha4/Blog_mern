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
        bg-[url('https://i.pinimg.com/1200x/67/65/4e/67654e36b98c49da27328f0971979e88.jpg')] 
    ">
    {posts.length > 0 && posts.map(post =>(
        <Post key={post._id} {...post} />
    ))}
    </div>)
    ;
}