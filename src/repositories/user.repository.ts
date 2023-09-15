import { Op } from "sequelize";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import { jwtsecret } from "../config/jwt-secret";

interface IUserRepository {
    login(email: string, password: string): Promise<User | null>
    save(user: User): Promise<User>;
    retrieveAll(searchParams: { fname: string, lname: string, active: boolean }): Promise<User[]>;
    retrieveById(userId: number): Promise<User | null>;
    update(user: User): Promise<number>;
    delete(userId: number): Promise<number>;
    deleteAll(): Promise<number>;
}

interface SearchCondition {
    [key: string]: any;
}

class UserRepository implements IUserRepository {

    async login(email: string, password: string): Promise<User | any> {
        try {
            // Find the user by email
            const user = await User.findOne({ where: { email: email } });

            if (!user) {
                return { data: null, message: "User account could not found!" }; // User not found
            }

            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return { data: null, message: "Incorrect password!" }; // Invalid password
            }

            // Generate JWT token with user's id
            const token = jwt.sign({ userId: user.id }, jwtsecret, { expiresIn: '7d' });


            return { data: user, token, message: "Success" }; // User and password are valid
        } catch (err) {
            throw new Error('Error during login');
        }
    }

    async save(user: User): Promise<User | any> {
        try {
            const userForEmail = await this.retrieveByEmail(user.email!);
            if (userForEmail) {
                return { data: null, message: "Email already used!" };
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const savedUser = await User.create({
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                password: hashedPassword,
                active: true,
            });
            return { data: savedUser, messsage: "Success" }
        } catch (err) {
            throw new Error("Failed to create new User!");
        }
    }

    async retrieveAll(searchParams: { fname?: string, lname?: string, active?: boolean }): Promise<User[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.active) condition.active = true;

            if (searchParams?.fname)
                condition.fname = { [Op.iLike]: `%${searchParams.fname}%` };

            if (searchParams?.lname)
                condition.lname = { [Op.iLike]: `%${searchParams.lname}%` };

            return await User.findAll({ where: condition });
        } catch (error) {
            throw new Error("Failed to retrieve Users!");
        }
    }

    async retrieveById(userId: number): Promise<User | null> {
        try {
            return await User.findByPk(userId);
        } catch (error) {
            throw new Error("Failed to get User!");
        }
    }

    async retrieveByEmail(email: string): Promise<User | null> {
        try {
            const user = await User.findOne({ where: { email: email } });
            return user;
        } catch (error) {
            throw new Error("Failed to get User!");
        }
    }

    async update(user: User): Promise<number> {
        const { id, fname, lname, email } = user;

        try {
            const affectedRows = await User.update(
                { fname, lname, email },
                { where: { id: id } }
            );

            return affectedRows[0];
        } catch (error) {
            throw new Error("Failed to update User!");
        }
    }

    async delete(userId: number): Promise<number> {
        try {
            const affectedRows = await User.destroy({ where: { id: userId } });

            return affectedRows;
        } catch (error) {
            throw new Error("Failed to delete User!");
        }
    }

    async deleteAll(): Promise<number> {
        try {
            return User.destroy({
                where: {},
                truncate: false
            });
        } catch (error) {
            throw new Error("Failed to delete Users!");
        }
    }
}

export default new UserRepository();