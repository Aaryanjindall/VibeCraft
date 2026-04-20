// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function MockPreview() {
//   const { id } = useParams();
//   const [srcDoc, setSrcDoc] = useState("");

//   useEffect(() => {
//     const history = JSON.parse(localStorage.getItem("publishHistory") || "[]");
//     const record = history.find((r) => r.id === id);

//     if (!record || !record.files) {
//       setSrcDoc("");
//       return;
//     }

//     const files = record.files;

//     const indexHtml = files["index.html"] || `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head><title>Empty Preview</title></head>
//       <body><h1>No index.html found</h1></body>
//       </html>
//     `;

//     const stylesCss = files["styles.css"] || "";
//     const scriptJs = files["script.js"] || "";

//     let htmlWithCss = indexHtml.includes("</head>")
//       ? indexHtml.replace("</head>", `<style>${stylesCss}</style></head>`)
//       : `<head><style>${stylesCss}</style></head>` + indexHtml;

//     let finalHtml = htmlWithCss.includes("</body>")
//       ? htmlWithCss.replace("</body>", `<script>${scriptJs}</script></body>`)
//       : htmlWithCss + `<script>${scriptJs}</script>`;

//     setSrcDoc(finalHtml);
//   }, [id]);

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       {srcDoc ? (
//         <iframe
//           title="Mock Preview"
//           srcDoc={srcDoc}
//           style={{ width: "100%", height: "100%" }}
//           frameBorder="0"
//           sandbox="allow-scripts allow-same-origin"
//         />
//       ) : (
//         <p style={{ color: "red", textAlign: "center" }}>
//           Project not found or no files saved.
//         </p>
//       )}
//     </div>
//   );
// }
