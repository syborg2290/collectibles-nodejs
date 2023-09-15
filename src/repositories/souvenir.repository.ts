import { Op } from "sequelize";
import Souvenir from "../models/souvenir.model";
import Image from "../models/image.model";
import imageRepository from "./image.repository";

interface ISouvenirRepository {
    save(souvenir: Souvenir): Promise<Souvenir>;
    retrieveAll(searchParams: { title: string, category: string, sub_category: string, active: boolean }): Promise<Souvenir[]>;
    retrieveById(souvenirId: number): Promise<Souvenir | null>;
    update(souvenir: Souvenir): Promise<number>;
    delete(souvenirId: number): Promise<number>;
    deleteAll(): Promise<number>;
    retrieveImagesBySouvenirId(souvenirId: number): Promise<Image[]>;
}

interface SearchCondition {
    [key: string]: any;
}

class SouvenirRepository implements ISouvenirRepository {

    async save(souvenir: Souvenir): Promise<Souvenir> {
        try {
            const savedSouvenir = await Souvenir.create({
                category: souvenir.category,
                sub_category: souvenir.sub_category,
                title: souvenir.title,
                description: souvenir.description,
                active: true,
            });
            return savedSouvenir;
        } catch (err: any) {
            throw err;
        }
    }

    async retrieveAll(searchParams: { title?: string, category?: string, sub_category?: string, active?: boolean }): Promise<Souvenir[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams.active !== undefined) {
                condition.active = searchParams.active;
            }

            if (searchParams.title) {
                condition.title = { [Op.like]: `%${searchParams.title}%` };
            }

            if (searchParams.category) {
                condition.category = { [Op.like]: `%${searchParams.category}%` };
            }

            if (searchParams.sub_category) {
                condition.sub_category = { [Op.like]: `%${searchParams.sub_category}%` };
            }

            const souvenirs = await Souvenir.findAll({
                where: condition,
                include: "images",

            });

            return souvenirs;
        } catch (error) {
            console.log(error)
            throw new Error("Failed to retrieve Souvenirs!");
        }
    }

    async retrieveById(souvenirId: number): Promise<Souvenir | null> {
        try {
            const souvenir = await Souvenir.findByPk(souvenirId, {
                include: Image, // Include associated images
            });
            return souvenir;
        } catch (error) {
            throw new Error("Failed to retrieve Souvenir!");
        }
    }

    async update(souvenir: Souvenir): Promise<number> {
        const { id, title, category, sub_category } = souvenir;

        try {
            const affectedRows = await Souvenir.update(
                { title, category, sub_category },
                { where: { id: id } }
            );

            return affectedRows[0];
        } catch (error) {
            throw new Error("Failed to update Souvenir!");
        }
    }

    async delete(souvenirId: number): Promise<number> {
        const transaction = await Souvenir.sequelize?.transaction();

        try {
            // Retrieve the souvenir to get associated image IDs
            const souvenir = await Souvenir.findByPk(souvenirId, {
                include: Image, // Include associated images
                transaction,
            });

            if (!souvenir) {
                throw new Error("Souvenir not found!");
            }

            // Retrieve associated image IDs
            const imageIds = souvenir.images.map(image => image.id);

            // Delete images associated with the souvenir
            await Promise.all(imageIds.map(async (imageId) => {
                // Your logic to delete the image based on imageId within the transaction
                await imageRepository.delete(imageId!);
            }));

            // Delete the souvenir record
            const affectedRows = await Souvenir.destroy({ where: { id: souvenirId }, transaction });

            // Commit the transaction if all operations are successful
            await transaction?.commit();

            return affectedRows;
        } catch (error) {
            // Roll back the transaction if an error occurs
            await transaction?.rollback();
            throw new Error("Failed to delete Souvenir!");
        }
    }


    async deleteAll(): Promise<number> {
        try {
            const affectedRows = await Souvenir.destroy({ where: {} });
            return affectedRows;
        } catch (error) {
            throw new Error("Failed to delete Souvenirs!");
        }
    }

    async retrieveImagesBySouvenirId(souvenirId: number): Promise<Image[]> {
        try {
            const souvenir = await Souvenir.findByPk(souvenirId, {
                include: Image, // Include associated images
            });

            if (!souvenir) {
                throw new Error("Souvenir not found!");
            }

            return souvenir.images;
        } catch (error) {
            throw new Error("Failed to retrieve Images for Souvenir!");
        }
    }
}

export default new SouvenirRepository();
