import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

const ProtectedRoute = ({children}) => {
    const { user, loading } = useUser();

    if(loading){
        return <div>Loading..</div>
    }

    if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}
export default ProtectedRoute;