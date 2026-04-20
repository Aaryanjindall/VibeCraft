export const runProjectInNewTab = (files) => {

  if (!files || !files["index.html"]) return;

  let html = files["index.html"];

  const css = `<style>${files["styles.css"] || ""}</style>`;
  const js = `<script>${files["script.js"] || ""}<\/script>`;

  if (html.includes("</head>")) {
    html = html.replace("</head>", css + "</head>");
  }

  if (html.includes("</body>")) {
    html = html.replace("</body>", js + "</body>");
  }

  const blob = new Blob([html], { type: "text/html" });

  const url = URL.createObjectURL(blob);
  console.log(url);
  window.open(url, "_blank");

};