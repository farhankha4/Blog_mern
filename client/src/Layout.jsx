import { Outlet } from "react-router-dom"
import { Head } from "./Head"



export function Layout(){

    return(
    <div>
        <Head/>
        <Outlet/>
    </div>
    )
}