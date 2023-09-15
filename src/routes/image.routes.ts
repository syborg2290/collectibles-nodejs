import { Router } from "express";
import ImageController from "../controllers/image.controller";
import { authenticateToken } from "../middleware/jwt.middleware";
import ImageUploadController from "../controllers/image_upload.controller";

class ImageRoutes {
    router = Router();
    controller = new ImageController();
    uploadController = new ImageUploadController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Upload new Image
        this.router.post("/upload-single/:souvenirId", authenticateToken, this.uploadController.uploadImage);

        // Create a new Image
        this.router.post("/", authenticateToken, this.controller.create);

        // Retrieve all Images
        this.router.get("/all", this.controller.findAll);

        // Retrieve a single Image with id
        this.router.get("/:id", this.controller.findOne);

        // Update an Image with id
        this.router.put("/:id", authenticateToken, this.controller.update);

        // Delete an Image with id
        this.router.delete("/:id", authenticateToken, this.controller.delete);

        // Delete all Images
        this.router.delete("/", authenticateToken, this.controller.deleteAll);

        // Retrieve images for a specific Souvenir by Souvenir's id
        this.router.get("/souvenir/:souvenirId", this.controller.retrieveImagesBySouvenirId);

        this.router.get("/img-url/:filename", this.controller.generateImageUrl);
    }
}

export default new ImageRoutes().router;
