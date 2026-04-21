

const PreviewPanel = ({ files = {} }) => {

    const getPreview = () => {

        if (!files || !files["index.html"]) return "";

        let html = files["index.html"];

        const css = `<style>${files["styles.css"] || ""}</style>`;

        const js = `<script>${files["script.js"] || ""}<\/script>`;

        if (html.includes("</head>")) {
            html = html.replace("</head>", css + "</head>");
        }

        if (html.includes("</body>")) {
            html = html.replace("</body>", js + "</body>");
        }

        return html;
    };

    return (
        <div style={{ height: "100%" }}>
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

export default PreviewPanel;