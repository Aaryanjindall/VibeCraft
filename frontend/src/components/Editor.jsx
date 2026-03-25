import Editor from "@monaco-editor/react";

const Editorr = ({ files, activeFile, setFiles }) => {

  const handleChange = (value) => {

    setFiles({
      ...files,
      [activeFile]: value || "",
    });

  };


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