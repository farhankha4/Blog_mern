import { useState } from "react"
import { Navigate } from "react-router-dom";
import { Post } from "./post";

export function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    async function log(e){
        e.preventDefault();
        const response = await fetch("http://localhost:4000/login",{
            method:'post',
            body: JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials:'include'
        });
        if(response.ok){
            setRedirect(true);
        }
        else{
            alert('wrong credentials');
        }
    }
    if(redirect){
        return <Navigate to={'/'} />
    }


    return(
    <main className="mx-auto">
        <form action="" 
        onSubmit={log}
        className="flex flex-col h-100">
        <h1 className="font-bold mt-20 text-center text-3xl">Login</h1>
        <div className="mt-5 flex flex-col space-y-1 px-20  ">
            <input type="text" 
            className="border-3 border-[#ababab] rounded-lg px-3 focus:outline-none" 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            placeholder="Username" />
            <input type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border-3 border-[#ababab] rounded-lg px-3 focus:outline-none"/>
           <button className="bg-[#474747] border-3 border-[#474747] cursor-pointer rounded-lg text-white px-2 py-1 text-sm transition active:scale-95">
            Login
            </button>
        </div>
        </form>
    </main>)
}