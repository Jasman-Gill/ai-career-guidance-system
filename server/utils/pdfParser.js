import { PDFParse } from "pdf-parse";

const parsePDF = async (dataBuffer) => {
    const parser = new PDFParse({ data: dataBuffer });

    try {
        const data = await parser.getText();
        return data.text;
    } finally {
        await parser.destroy();
    }
};

export default parsePDF;
