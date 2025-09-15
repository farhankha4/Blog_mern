import { useState } from "react";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function reg(e){
    e.preventDefault();
    const response = await fetch("http://localhost:4000/register",{
        method:'post',
        body: JSON.stringify({username,password}),
        headers: {'Content-Type':'application/json'}
    });
    if(response.status === 200){
      alert('registration successful');
    }
    else{
      alert('registration failed');
    }
    
  }

  return (
    <main className="mx-auto">
      <form action="" onSubmit={reg} className="flex flex-col h-100">
        <h1 className="font-bold mt-20 text-center text-3xl">Register</h1>
        <div className="mt-5 flex flex-col space-y-1 px-20  ">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-3 border-[#ababab] rounded-lg px-3 focus:outline-none"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-3 border-[#ababab] rounded-lg px-3 focus:outline-none"
          />
          <button className="bg-[#474747] border-3 border-[#474747] cursor-pointer rounded-lg text-white px-2 py-1 text-sm transition active:scale-95">
            Register
          </button>
        </div>
      </form>
    </main>
  );
}
