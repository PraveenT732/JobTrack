import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PublicRoute({children}){
    const {user, loading} = useAuth();
    console.log("PublicRoute user: ",user);
    console.log("PublicRoute loading: ",loading);
    if(loading){
        return <p>Checking authentication...</p>
    }
    if(user){
        return <Navigate to="/dashboard" replace/>
    }
    return children;
}