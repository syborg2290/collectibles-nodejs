import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import imageRepository from "../repositories/image.repository";
import Image from "../models/image.model";

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, "uploads/"); // Specify the directory to save uploaded images
    },
    filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueSuffix + fileExtension); // Rename the uploaded file
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    // Check if the file is an image
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image files are allowed!"), false); // Reject the file
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default class ImageUploadController {
    async uploadImage(req: Request, res: Response) {
        try {
            const souvenirId = parseInt(req.params.souvenirId);

            upload.single("image")(req, res, async (err: any) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: "Error uploading image." });
                } else if (err) {
                    return res.status(500).json({ message: "Internal server error." });
                }

                if (!req.file) {
                    return res.status(400).json({ message: "No image file provided." });
                }

                const imagePath = req.file.path;
                const imageFileName = req.file.filename;
                const imageOriginalName = req.file.originalname;

                // console.log(imagePath);
                // console.log(imageFileName);
                // console.log(imageOriginalName);

                const _image = new Image();
                _image.filename = imageFileName;
                _image.filepath = imagePath;
                _image.souvenirId = souvenirId;

                const savedImage = await imageRepository.save(_image);

                if (savedImage.data === null) {
                    // Delete the image from the file system
                    try {
                        await fs.promises.unlink(imagePath);
                        console.log("Image deleted from file system.");
                    } catch (deleteError) {
                        console.error("Error deleting image from file system:", deleteError);
                    }
                    return res.status(400).json({ message: savedImage.message });
                }

                // You can save the imagePath to the database or perform any necessary actions
                return res.status(201).json({ message: "Success", data: savedImage });
            });
        } catch (err) {
            return res.status(500).json({ message: "Error uploading image." });
        }
    }
}
