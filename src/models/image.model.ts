import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";
import Souvenir from "./souvenir.model";

@Table({
    tableName: "image",
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Custom name for createdAt column
    updatedAt: 'updated_at', // Custom name for updatedAt column
})

export default class Image extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id?: number;

    @Column({
        type: DataType.STRING(255),
        field: "filename",
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Filename is required!"
            }
        }
    })
    filename?: string;

    @Column({
        type: DataType.STRING(255),
        field: "filepath",
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Filepath is required!"
            }
        }
    })
    filepath?: string;

    @ForeignKey(() => Souvenir) // Define the foreign key
    @Column({
        type: DataType.INTEGER,
        field: "souvenir_id",
    })
    souvenirId!: number; // This property will hold the associated souvenir's ID
}