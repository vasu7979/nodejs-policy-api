import importService from "../services/import.service.js";

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV or XLSX file",
      });
    }

    console.log("1. Upload controller reached");
    console.log("2. Uploaded file:", req.file?.path);

    const result = await importService.importFile(req.file.path);

    console.log("3. Import result:", result);

    return res.status(200).json({
      success: true,
      message: "File processed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  uploadFile,
};
