import fs from "fs";
import pdf from "pdf-parse";
import path from "path";

/*
    Source to the original package repo : https://gitlab.com/autokent/pdf-parse
*/

interface PdfData {
  numpages: number;
  numrender: number;
  info: any;
  metadata: any;
  version: string;
  text: string;
}

class PdfParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfParseError";
  }
}

export async function parsePdf(pdfPath: string): Promise<PdfData> {
  try {
    if (!pdfPath) {
      throw new PdfParseError("PDF path is required");
    }
    if (path.extname(pdfPath).toLowerCase() !== ".pdf") {
      throw new PdfParseError("File must be a PDF");
    }

    if (!fs.existsSync(pdfPath)) {
      throw new PdfParseError(`PDF file not found at path: ${pdfPath}`);
    }

    const dataBuffer = fs.readFileSync(pdfPath);

    const data = await pdf(dataBuffer);

    return {
      numpages: data.numpages,
      numrender: data.numrender,
      info: data.info,
      metadata: data.metadata,
      version: data.version,
      text: data.text,
    };
  } catch (error) {
    if (error instanceof PdfParseError) {
      throw error;
    }
    throw new PdfParseError(
      `Failed to parse PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
