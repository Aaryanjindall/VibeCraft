import { ExternalLink } from "lucide-react";

const Publiccard = ({pproject,onOpen}) => {
    return (
        <>
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5
      hover:bg-[#273449] hover:scale-[1.02] transition duration-200
      cursor-pointer shadow-md hover:shadow-indigo-500/20">
            <div>
                <h2>{pproject.name}</h2>
            </div>
            </div>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(pproject.createdAt).toDateString()}
            </p>
            <button onClick={()=> onOpen(pproject._id)}>
                <ExternalLink size={16} />
                Open
            </button>
        </>
    )
}
export default Publiccard;