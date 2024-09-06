import {my_router} from '@/routes'
import {RouterProvider} from 'react-router-dom'
import {useEffect} from "react";
import {cleanConnection, createConnectionToLong} from "@/ztcp/sender.ts";

function MyApp() {

    return (
        <RouterProvider router={my_router}/>
    )
}

export default MyApp

