"use client";
import Ham from "../assets/hamburger-icon.svg";
import Ic from "./OLIcon";
import SIco from "../assets/icons8-search (1).svg";
import Image from "next/image";
import { Router } from "next/router";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";


type User={
    name:string,
    email:string,
    id:number,
}
export default function Nav() {
    const {user,setUser} = useUser()
    // const [user,setUser]=useState()
    const router=useRouter()
    // useEffect(()=>{
    //     const userFromCookies=Cookies.get('user');
    //     if(userFromCookies){
    //         setUser(JSON.parse(userFromCookies))
    //     }
    // },[])
    console.log(user)

    const logout=()=>{
        Cookies.remove("user")
        Cookies.remove("token")
        router.push("/")
        setUser(null)
    }
  return (
    <nav className=" bg-[#f3edd7] flex space-x-3 justify-between items-center np-2">
      <div className="pl-5">
        <Link href={'/'}>
        <Ic />
        </Link>
      </div>

      <div className=" flex items-center">
        {/* <input
            type="text"
            name="q"
            placeholder=" Search"
            aria-label="Search"
            autoComplete="on"
            className="block placeholder:text-gray-400 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          /> */}
        <SearchBar />

      
        <Link href='/liked-books'>
        <h3 className="mr-3">{user?.name}</h3>
        </Link>
        
       { user?<div>
        <button onClick={logout} className="rounded bg-red-500 p-2">Logout</button>
       <Link href="/create"><button className="bg-slate-400 rounded p-2 ml-1">Create Book</button></Link>
        </div>
       
       :<div>

         <Link href="/login"><button className="bg-blue-500 p-2 text-white rounded">Login</button></Link>
        <Link
          href="/signup"
          className="bg-[#0376b8] h-10 m-4 p-2 justify-items-end text-white rounded"
        >
          Sign up
        </Link>
       </div> 
       
       
       }

        {/* <Ham className="m-4" /> */}
        <div className="m-4">
          <Image src={Ham} alt="Menu" />
        </div>
      </div>
    </nav>
  );
}
