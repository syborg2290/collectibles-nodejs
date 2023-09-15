import { Application } from "express";
import homeRoutes from "./home.routes";
import userRoutes from "./user.routes";
import souvenirRoutes from "./souvenir.routes";
import imageRoutes from "./image.routes";

export default class Routes {
    constructor(app: Application) {
        app.use("/api", homeRoutes);
        app.use("/api/user", userRoutes);
        app.use("/api/souvenir", souvenirRoutes);
        app.use("/api/image", imageRoutes);
    }
}