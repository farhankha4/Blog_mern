import { Link } from 'react-router-dom'
import { asset } from './assets/asset'
import { useContext, useEffect, useState} from 'react'
import { UserContext } from './UserContext'

export function Head(){
  const{setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile',{
      credentials: 'include'
    }).then(response =>{
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    })
  }, []);
  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials: 'include',
      method: 'POST'
    });
    setUserInfo(null);
  }
  const username = userInfo?.username;

    return(
    <>
    <header className='flex pt-10 px-10 pb-7 justify-between max-w-500 m-0'>
        <Link to="/">
          <img className='h-6 cursor-pointer' src={asset.logo} alt="logo" />
        </Link>

        <div className='space-x-5 text-[#696465] font-bold '>
          {username && (
            <>
            <Link to='/create'className='hover:text-[#474445]'>New post</Link>
            <Link className='hover:text-[#474445]' onClick={logout}>Logout</Link>
            </>
          )}
          {!username && (
            <>
            <Link to="/login" className='hover:text-[#474445]'>Login</Link>
            <Link to="/register" className='hover:text-[#474445]'>Register</Link>
            </>
          )}
        </div>
    </header>
    </>)
}