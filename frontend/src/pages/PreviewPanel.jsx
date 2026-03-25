
const PreviewPanel = ({files}) => {
    const getPreview = () => {
        if(!files["index.html"])return "";
        let html = files["index.html"];

        const css = `<style>${files["styles.css"] || ""}</style>`

        const js = `<script>${files["script.js"] || ""}<\/script>`;

        html = html.replace("</head>",css+"</head>");
        html = html.replace("<body>",js+"</body>");
        return html;
    };

    return(
        <div>
            <iframe
            title="preview"
            srcDoc={getPreview()}
            style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "white"
            }}
            />
        </div>
    );
};
export default PreviewPanel