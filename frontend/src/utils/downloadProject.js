import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadProject = async(files) => {
    if(!files)return;
    const zip = new JSZip();
    Object.keys(files).forEach((name) => {
        zip.file(name,files[name]);
    });

    const content = await zip.generateAsync({
        type: "blob",
    });
    saveAs(content,"project.zip");
    
};