import { useEffect } from "react";
import { useProject } from "../hooks/useProject";
import PublicProjectGrid from "../components/Publicprojectgrid";


const Explore = () => {
    const {loadpublic,Publicprojects} = useProject();
    useEffect(()=> {
        loadpublic();
    },[])
    return(
        <>
            <div>
                <PublicProjectGrid 
                    Publicprojects={Publicprojects}
                />
            </div>
        </>
    )
}
export default Explore;