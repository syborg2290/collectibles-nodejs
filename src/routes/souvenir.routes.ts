import { Router } from "express";
import SouvenirController from "../controllers/souvenir.controller";
import { authenticateToken } from "../middleware/jwt.middleware";

class SouvenirRoutes {
    router = Router();
    controller = new SouvenirController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Create a new Souvenir
        this.router.post("/", authenticateToken, this.controller.create);

        // Retrieve all Souvenirs
        this.router.get("/all", this.controller.findAll);

        // Retrieve a single Souvenir by id
        this.router.get("/:id", this.controller.findOne);

        // Update a Souvenir by id
        this.router.put("/:id", authenticateToken, this.controller.update);

        // Delete a Souvenir by id
        this.router.delete("/:id", authenticateToken, this.controller.delete);

        // Delete all Souvenirs
        this.router.delete("/all", authenticateToken, this.controller.deleteAll);

        // Retrieve Images for a Souvenir by id
        this.router.get("/:id/images", this.controller.retrieveImagesBySouvenirId);
    }
}

export default new SouvenirRoutes().router;
