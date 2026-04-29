import Editor from "@monaco-editor/react";
import { useEffect } from "react";

const Editorr = ({ files, activeFile, setFiles,isCollaborative = false ,onCodeChange }) => {

  const handleChange = (value) => {
    const updated = {
      ...files,
      [activeFile]: value || "",
    }

    setFiles(updated);
    
  };

  useEffect(()=>{

if(
 !isCollaborative ||
 !onCodeChange
) return;

const t=setTimeout(()=>{
 onCodeChange(files);
},400);

return ()=>clearTimeout(t);

},[files]);




  const getLanguage = (filename) => {

    if (!filename) return "javascript";

    if (filename.endsWith(".html")) return "html";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".js")) return "javascript";

    return "plaintext";
  };


  return (

    <div
      style={{
        flex: 1,
        height: "100%",
      }}
    >

      <Editor
        height="100%"
        theme="vs-dark"
        language={getLanguage(activeFile)}
        value={files?.[activeFile] || ""}
        onChange={handleChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />

    </div>

  );

};

export default Editorr;