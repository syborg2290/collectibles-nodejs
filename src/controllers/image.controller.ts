import { Request, Response } from "express";
import Image from "../models/image.model";
import imageRepository from "../repositories/image.repository";

import fs from "fs";
import path from "path";

export default class ImageController {
    async create(req: Request, res: Response) {
        try {
            const image: Image = req.body;
            const savedImage = await imageRepository.save(image);
            if (savedImage.data === null) {
                return res.status(404).send({
                    message: savedImage.message
                });
            }
            return res.status(201).send(savedImage.data);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while creating image."
            });
        }
    }

    async findAll(req: Request, res: Response) {
        const filename = typeof req.query.filename === "string" ? req.query.filename : "";
        const filepath = typeof req.query.filepath === "string" ? req.query.filepath : "";

        try {
            const images = await imageRepository.retrieveAll({ filename, filepath });
            return res.status(200).send(images);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while retrieving images."
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const image = await imageRepository.retrieveById(id);

            if (image) return res.status(200).send(image);
            else
                return res.status(404).send({
                    message: `Cannot find Image with id=${id}.`
                });
        } catch (err) {
            return res.status(500).send({
                message: `Error retrieving Image with id=${id}.`
            });
        }
    }

    async update(req: Request, res: Response) {
        let image: Image = req.body;
        image.id = parseInt(req.params.id);

        try {
            const num = await imageRepository.update(image);

            if (num == 1) {
                return res.send({
                    message: "Image was updated successfully."
                });
            } else {
                return res.send({
                    message: `Cannot update Image with id=${image.id}. Maybe Image was not found or req.body is empty!`
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Error updating Image with id=${image.id}.`
            });
        }
    }

    async delete(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const num = await imageRepository.delete(id);

            if (num == 1) {
                return res.send({
                    message: "Image was deleted successfully!"
                });
            } else {
                return res.send({
                    message: `Cannot delete Image with id=${id}. Maybe Image was not found!`,
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Could not delete Image with id==${id}.`
            });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const num = await imageRepository.deleteAll();

            return res.send({ message: `${num} Images were deleted successfully!` });
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while removing all images."
            });
        }
    }

    async retrieveImagesBySouvenirId(req: Request, res: Response) {
        const souvenirId: number = parseInt(req.params.souvenirId);

        try {
            const images = await imageRepository.retrieveBySouvenirId(souvenirId);
            return res.status(200).send(images);
        } catch (err) {
            return res.status(500).send({
                message: `Error retrieving images for Souvenir with id=${souvenirId}.`
            });
        }
    }

    generateImageUrl(req: Request, res: Response) {
        try {
            const filename = req.params.filename;

            const imagePath = path.join(__dirname, "..", "..", "uploads", filename);


            //Check if the image file exists
            // if (!fs.existsSync(imagePath)) {
            //     return res.status(404).json({ message: "Image not found." });
            // }

            // Generate and send the image URL
            const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

            return res.status(200).json({ imageUrl });
        } catch (error) {
            console.error("Error generating image URL:", error);
            return res.status(500).json({ message: "Error generating image URL." });
        }
    }
}
