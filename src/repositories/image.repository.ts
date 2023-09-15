import { Op } from "sequelize";
import fs from "fs";
import Image from "../models/image.model";
import souvenirRepository from "./souvenir.repository";

interface IImageRepository {
    save(image: Image): Promise<Image>;
    retrieveAll(searchParams: { filename: string, filepath: string }): Promise<Image[]>;
    retrieveById(imageId: number): Promise<Image | null>;
    update(image: Image): Promise<number>;
    delete(imageId: number): Promise<number>;
    deleteAll(): Promise<number>;
    retrieveBySouvenirId(souvenirId: number): Promise<Image[]>;
}

interface SearchCondition {
    [key: string]: any;
}

class ImageRepository implements IImageRepository {
    async save(image: Image): Promise<Image | any> {
        try {
            const souvenir = await souvenirRepository.retrieveById(image.souvenirId);

            if (!souvenir) {
                return { data: null, message: "Couldn't find any souvenir!" }
            }

            const savedImage = await Image.create({
                filename: image.filename,
                filepath: image.filepath,
                souvenirId: image.souvenirId,
            });

            return { data: savedImage, message: "Success" }
        } catch (err) {
            throw new Error("Failed to save Image!");
        }
    }

    async retrieveAll(searchParams: { filename: string, filepath: string }): Promise<Image[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams.filename) {
                condition.filename = { [Op.iLike]: `%${searchParams.filename}%` };
            }

            if (searchParams.filepath) {
                condition.filepath = { [Op.iLike]: `%${searchParams.filepath}%` };
            }

            const images = await Image.findAll({ where: condition });
            return images;
        } catch (error) {
            throw new Error("Failed to retrieve Images!");
        }
    }

    async retrieveById(imageId: number): Promise<Image | null> {
        try {
            const image = await Image.findByPk(imageId);
            return image;
        } catch (error) {
            throw new Error("Failed to retrieve Image!");
        }
    }

    async update(image: Image): Promise<number> {
        const { id, filename, filepath } = image;

        try {
            const affectedRows = await Image.update(
                { filename, filepath },
                { where: { id: id } }
            );

            return affectedRows[0];
        } catch (error) {
            throw new Error("Failed to update Image!");
        }
    }

    async delete(imageId: number): Promise<number> {
        try {
            const image = await this.retrieveById(imageId);
            if (image) {
                await fs.promises.unlink(image.filepath!);

            } else {
                throw new Error("Failed to delete Image!");
            }
            const affectedRows = await Image.destroy({ where: { id: imageId } });
            return affectedRows;
        } catch (error) {
            throw new Error("Failed to delete Image!");
        }
    }

    async deleteAll(): Promise<number> {
        try {
            const affectedRows = await Image.destroy({ where: {} });
            return affectedRows;
        } catch (error) {
            throw new Error("Failed to delete Images!");
        }
    }

    async retrieveBySouvenirId(souvenirId: number): Promise<Image[]> {
        try {
            const images = await Image.findAll({ where: { souvenirId: souvenirId } });
            return images;
        } catch (error) {
            throw new Error("Failed to retrieve Images for Souvenir!");
        }
    }
}

export default new ImageRepository();
