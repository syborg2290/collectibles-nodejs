import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticateToken } from "../middleware/jwt.middleware";

class UserRoutes {
    router = Router();
    controller = new UserController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {

        // check token validity
        this.router.post("/token-check", this.controller.verifyToken);
        // Login
        this.router.post("/login", this.controller.login);

        // Create a new User
        this.router.post("/", this.controller.create);

        // Retrieve all Users
        this.router.get("/all", this.controller.findAll);

        // Retrieve all actived Users
        this.router.get("/activated", this.controller.findAllActiveUsers);

        // Retrieve a single User with id
        this.router.get("/:id", authenticateToken, this.controller.findOne);

        // Update a User with id
        this.router.put("/:id", authenticateToken, this.controller.update);

        // Delete a User with id
        this.router.delete("/:id", authenticateToken, this.controller.delete);

        // Delete all Users
        this.router.delete("/", this.controller.deleteAll);
    }
}

export default new UserRoutes().router;