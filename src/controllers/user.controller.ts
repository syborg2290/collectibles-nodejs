import { Request, Response } from "express";
import User from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { jwtsecret } from "../config/jwt-secret";
import jwt from 'jsonwebtoken';

export default class UserController {

    async verifyToken(req: Request, res: Response) {
        const token = req.headers['authorization'];

        try {
            jwt.verify(token?.split(" ")[1], jwtsecret, (err: any, decoded: any) => {
                if (err) {
                    return res.status(400).json({ message: 'Invalid token' });
                }

                return res.status(200).json({ message: 'Valid' });
            });



        } catch (err) {
            return res.status(500).json({ message: 'Invalid Token' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await userRepository.login(email, password);

            if (user.data === null && user.message) {
                return res.status(401).json({ message: user.message });
            }

            if (!user.data) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            return res.status(200).json({ message: 'Authentication successful', token: user.token, user: user.data });

        } catch (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }
    }
    async create(req: Request, res: Response) {
        if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.password) {
            res.status(400).send({
                message: "Firstname, lastname, email and password can not be empty!"
            });
            return;
        }

        try {
            const user: User = req.body;
            if (!user.active) user.active = false;

            const savedUser = await userRepository.save(user);

            if (savedUser.data === null) {
                return res.status(400).send({
                    message: savedUser.message
                })
            }

            return res.status(201).send(savedUser.data);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while creating user."
            });
        }
    }

    async findAll(req: Request, res: Response) {
        const fname = typeof req.query.fname === "string" ? req.query.fname : "";
        const lname = typeof req.query.lname === "string" ? req.query.lname : "";

        try {
            const users = await userRepository.retrieveAll({ fname, lname, active: true });

            return res.status(200).send(users);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while retrieving users."
            });
        }
    }

    async findOne(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const user = await userRepository.retrieveById(id);

            if (user) return res.status(200).send(user);
            else
                return res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
        } catch (err) {
            return res.status(500).send({
                message: `Error retrieving User with id=${id}.`
            });
        }
    }

    async update(req: Request, res: Response) {
        let user: User = req.body;
        user.id = parseInt(req.params.id);

        try {
            const num = await userRepository.update(user);

            if (num == 1) {
                return res.send({
                    message: "User was updated successfully."
                });
            } else {
                return res.send({
                    message: `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Error updating User with id=${user.id}.`
            });
        }
    }

    async delete(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        try {
            const num = await userRepository.delete(id);

            if (num == 1) {
                return res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                return res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                });
            }
        } catch (err) {
            return res.status(500).send({
                message: `Could not delete User with id==${id}.`
            });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const num = await userRepository.deleteAll();

            res.send({ message: `${num} Users were deleted successfully!` });
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while removing all users."
            });
        }
    }

    async findAllActiveUsers(req: Request, res: Response) {
        try {
            const users = await userRepository.retrieveAll({ active: true });

            res.status(200).send(users);
        } catch (err) {
            return res.status(500).send({
                message: "Some error occurred while retrieving users."
            });
        }
    }
}