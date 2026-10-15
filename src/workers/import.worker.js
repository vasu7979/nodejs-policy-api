import { parentPort, workerData } from "node:worker_threads";
import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { parse } from "csv-parse/sync";

function readFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".xlsx" || extension === ".xls") {
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    return XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });
  }

  if (extension === ".csv") {
    return parse(fs.readFileSync(filePath, "utf8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });
  }

  throw new Error("Only CSV and XLSX files are supported");
}

try {
  const rows = readFile(workerData.filePath);

  parentPort.postMessage({
    success: true,
    rows,
  });
} catch (error) {
  parentPort.postMessage({
    success: false,
    error: error.message,
  });
}