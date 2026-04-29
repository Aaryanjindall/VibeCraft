import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";
import Collab from "../components/Collboration";

const LiveRoomPage = () => {

const { id } = useParams();


return(
<Collab 
projectId={id}/>
)

}

export default LiveRoomPage;