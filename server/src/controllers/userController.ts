/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
import {Request, Response} from 'express';
const bcrypt = require("bcrypt");

class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const user = await User.findOneUserById(req.params.userId);
    
            if (!user) {
                res.status(404).json("user doesn`t exists");
                return;
            }
    
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({error: err});
        }
    }    
    
    async putUser(req: Request, res: Response) {
        if (req.body._id === req.params.userId) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    return res.status(500).json(err);
                }
            }
            try {
                delete req.body._id;
                await User.findUserByIdAndUpdate(req.params.userId, req.body);
                res.status(200).json("Account has been updated");
            } catch (err) {
                res.status(500).json({error: err});
            }
        } else {
            return res.status(403).json("You can update only your account!");
        }
    }

    async deleteUser(req: Request, res: Response) {
        if (req.body._id === req.params.userId) {
            try {
                await User.deleteUserById(req.params.userId);
                res.status(200).json("Account has been deleted");
            } catch (err) {
                res.status(500).json({error: err});
            }
        } else {
            return res.status(403).json("You can delete only your account!");
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            
        } catch (e) {

        }
    }
}

module.exports = new UserController()