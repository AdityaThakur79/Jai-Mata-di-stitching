import express from "express";
import multer from "multer";
import uploadImages from "../utils/common/Uploads.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { getAllCatalogues, getCatalogueById, createCatalogue, updateCatalogue, deleteCatalogue, viewCataloguePdf } from "../controllers/catalogue.js";

const router = express.Router();

// No file upload now; keep multer for compatibility but without file field
const upload = multer();

router.get("/", getAllCatalogues);
router.get("/:id", getCatalogueById);
router.get("/:id/view", viewCataloguePdf);

// protect create/update/delete
// For featured image upload via field "featuredImage"
router.post("/", isAuthenticated, (req, res, next) => uploadImages(req, res, next), createCatalogue);
router.put("/:id", isAuthenticated, (req, res, next) => uploadImages(req, res, next), updateCatalogue);
router.delete("/:id", isAuthenticated, deleteCatalogue);

export default router;


