import { Router } from "express";
import { connection } from '../server.js';
const router = Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTableQuery } from "../utlis/table.js";


router.get('/', (req, res) => {
    res.render('index-2');
});

export default router;