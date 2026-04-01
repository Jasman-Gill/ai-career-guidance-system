import fs from "fs";
import { PDFParse } from "pdf-parse";

const parsePDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });

    try {
        const data = await parser.getText();
        return data.text;
    } finally {
        await parser.destroy();
    }
};

export default parsePDF;