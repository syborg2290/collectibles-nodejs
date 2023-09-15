import { Request, Response } from "express";
import Souvenir from "../models/souvenir.model";
import souvenirRepository from "../repositories/souvenir.repository";

export default class SouvenirController {
    async create(req: Request, res: Response) {
        try {
            const souvenir: Souvenir = req.body;
            // Additional validation and sanitization of input data can be done here

            const savedSouvenir = await souvenirRepository.save(souvenir);

            return res.status(201).send(savedSouvenir);
        } catch (error: any) {
            // Handle the error, including uniqueness violation
            if (error.response && error.response.data) {
                if (error.response.data.error.name === "SequelizeUniqueConstraintError") {
                    const validationError = error.response.data.error.errors[0];
                    console.log("Validation Error:", validationError.message);
                    // Handle displaying the error message to the user
                    return res.status(400).send({
                        message: validationError.message
                    });
                } else {
                    console.error("API Error:", error.response.data);
                    // Handle other types of API errors
                    return res.status(400).send({
                        message: error.response.data
                    });
                }
            } else {

                console.error("Network Error:", error.message);
                return res.status(400).send({
                    message: error.message
                });
                // Handle network errors
            }
        }


    }

    async findAll(req: Request, res: Response) {
        const title = typeof req.query.title === "string" ? req.query.title : "";
        const category = typeof req.query.category === "string" ? req.query.category : "";
        const sub_category = typeof req.query.sub_category === "string" ? req.query.sub_category : "";

        try {
            const souvenirs = await souvenirRepository.retrieveAll({ title, category, sub_category, active: true });

            return res.status(200).send(souvenirs);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while retrieving souvenirs."
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const souvenir = await souvenirRepository.retrieveById(id);

            if (souvenir) return res.status(200).send(souvenir);
            else
                return res.status(404).send({
                    message: `Cannot find Souvenir with id=${id}.`
                });
        } catch (err) {
            return res.status(500).send({
                message: `Error retrieving Souvenir with id=${id}.`
            });
        }
    }

    async update(req: Request, res: Response) {
        let souvenir: Souvenir = req.body;
        souvenir.id = parseInt(req.params.id);

        try {
            const num = await souvenirRepository.update(souvenir);

            if (num == 1) {
                return res.send({
                    message: "Souvenir was updated successfully."
                });
            } else {
                return res.send({
                    message: `Cannot update Souvenir with id=${souvenir.id}. Maybe Souvenir was not found or req.body is empty!`
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Error updating Souvenir with id=${souvenir.id}.`
            });
        }
    }

    async delete(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const num = await souvenirRepository.delete(id);

            if (num == 1) {
                return res.send({
                    message: "Souvenir was deleted successfully!"
                });
            } else {
                return res.send({
                    message: `Cannot delete Souvenir with id=${id}. Maybe Souvenir was not found!`,
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Could not delete Souvenir with id==${id}.`
            });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const num = await souvenirRepository.deleteAll();

            return res.send({ message: `${num} Souvenirs were deleted successfully!` });
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while removing all souvenirs."
            });
        }
    }

    async findAllActiveSouvenirs(req: Request, res: Response) {
        try {
            const souvenirs = await souvenirRepository.retrieveAll({ active: true });

            return res.status(200).send(souvenirs);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while retrieving souvenirs."
            });
        }
    }

    async retrieveImagesBySouvenirId(req: Request, res: Response) {
        const souvenirId: number = parseInt(req.params.souvenirId);

        try {
            const images = await souvenirRepository.retrieveImagesBySouvenirId(souvenirId);

            return res.status(200).send(images);
        } catch (err) {
            return res.status(500).send({
                message: `Error retrieving images for Souvenir with id=${souvenirId}.`
            });
        }
    }
}
