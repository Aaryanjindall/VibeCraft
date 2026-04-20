import ProjectCard from "./ProjectCard"
import Publiccard from "./Publiccard"
import { useProject } from "../hooks/useProject"
import { useNavigate } from "react-router-dom"


const PublicProjectGrid = ({Publicprojects}) => {
    const {loadProject} = useProject();
    const navigate = useNavigate();
    const handleOpen = async(id) => {
        await loadProject(id);
        window.open(`/viewer/${id}`, "_blank");
    }
    return(
        <>
        {
            Array.isArray(Publicprojects) && Publicprojects.map((p) => (
                <Publiccard
                    key={p._id}
                    pproject={p}
                    onOpen={handleOpen}
                />
            ))
        }
        </>
    )
}

export default PublicProjectGrid