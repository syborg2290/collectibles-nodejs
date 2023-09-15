import { Model, Table, Column, DataType } from "sequelize-typescript";

const validateEmail = (email: string) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

@Table({
  tableName: "users",
  timestamps: true, // Enable timestamps
  createdAt: 'created_at', // Custom name for createdAt column
  updatedAt: 'updated_at', // Custom name for updatedAt column
})
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.STRING(255),
    field: "fname",
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "First name cannot be empty"
      }
    }
  })
  fname?: string;

  @Column({
    type: DataType.STRING(255),
    field: "lname",
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Last name cannot be empty"
      }
    }
  })
  lname?: string;

  @Column({
    type: DataType.STRING(255),
    field: "email",
    allowNull: false,
    unique: true,
    validate: {
      isEmailOrEmpty(val: any) {
        if (!val || val === "" || validateEmail(val)) {
          return;
        }
        throw new Error('Email is invalid!');
      }
    }
  })
  email?: string;

  @Column({
    type: DataType.STRING(64),
    field: "password",
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password cannot be empty"
      },
    }
  })
  password?: string;


  @Column({
    type: DataType.BOOLEAN,
    field: "active",
    defaultValue: true,
  })
  active?: boolean;
}