import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import Image from "./image.model";

@Table({
    tableName: "souvenir",
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Custom name for createdAt column
    updatedAt: 'updated_at', // Custom name for updatedAt column
})

export default class Souvenir extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id?: number;

    @Column({
        type: DataType.STRING(255),
        field: "category",
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Category is required!"
            }
        }
    })
    category?: string;

    @Column({
        type: DataType.STRING(255),
        field: "sub_category",
        allowNull: true,
    })
    sub_category?: string;

    @Column({
        type: DataType.STRING(255),
        field: "title",
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Title is required!"
            }
        }
    })
    title?: string;

    @Column({
        type: DataType.STRING(255),
        field: "description",
        allowNull: false
    })
    description?: string;

    @Column({
        type: DataType.BOOLEAN,
        field: "active",
        defaultValue: true,
    })
    active?: boolean;

    @HasMany(() => Image) // Define the association
    images!: Image[];
}