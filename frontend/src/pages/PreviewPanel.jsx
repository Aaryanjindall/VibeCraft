
const PreviewPanel = ({files}) => {
    const getPreview = () => {
        if(!files["index.html"]) {
            return `<div style="background:#0b1120;color:#94a3b8;height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;">No files to preview...</div>`;
        }
        let html = files["index.html"];

        const css = `<style>${files["styles.css"] || ""}</style>`

        const js = `<script>${files["script.js"] || ""}</script>`;

        html = html.replace("</head>",css+"</head>");
        html = html.replace("</body>",js+"</body>");
        return html;
    };

    return(
        <div style={{ height: "100%" }}>
            <iframe
            title="preview"
            srcDoc={getPreview()}
            style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: files["index.html"] ? "white" : "#0b1120"
            }}
            />
        </div>
    );
};
export default PreviewPanel