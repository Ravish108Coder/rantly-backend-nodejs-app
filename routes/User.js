import { Router } from "express";
import { connection } from '../server.js';
const router = Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { renderHomepage } from "../utlis/render.js";

router.get("/", (req, res) => {
    res.send("User route");
});
router.get("/all", (req, res) => {
    const query = `SELECT * FROM User`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching documents:', err);
            res.status(500).send('Error fetching documents');
        } else {
            console.log('Documents fetched successfully');
            res.status(200).send(results);
        }
    });
});

router.post("/login", (req, res) => {
    console.log('Request body:', req.body);
    const { email, password } = req.body;

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS User (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableQuery, (tableErr) => {
        if (tableErr) {
            console.error('Error creating table:', tableErr);
            // return res.status(500).send('Error creating table');
            return res.redirect('/login.html');
        }

        // console.log(`Table created or already exists`);
    });

    const query = `SELECT * FROM User WHERE email = '${email}'`;

    connection.query(query, async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            // res.status(500).send('Error fetching user');
            return res.redirect('/login.html');
        } else {
            if (results.length > 0) {
                console.log('User logged in successfully');
                const userPassword = results[0].password;
                const isMatch = await bcrypt.compare(password, userPassword);
                if (!isMatch) {
                    // return res.status(400).json({ message: 'Invalid credentials', success: false });
                    console.log('Invalid credentials');
                    return res.redirect('/login.html');
                }

                jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, (jwtErr, token) => {
                    if (jwtErr) {
                        console.error('Error signing token:', jwtErr);
                        return res.status(500).send('Error signing token');
                    }
                    console.log('token :', token);
                    res.cookie('token', token, { httpOnly: true });
                    console.log('token set in cookies')
                    const tokeN = req.cookies.token;
                    console.log('token :', tokeN);

                    console.log('User Data', results[0]);
                    
                    res.redirect('/');
                });
            } else {
                console.log('Invalid credentials');
                res.status(400).json({ message: 'Invalid credentials', success: false });
            }
        }
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

router.post("/register", (req, res) => {
    console.log('Request body:', req.body);
    // take data from request body
    const { name, username, phone, email, password } = req.body;

    // Create table if not exists
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
    `;

    // Check if the user already exists in the table
    const checkUserQuery = `
        SELECT * FROM User WHERE email = '${email}'
    `;

    connection.query(createTableQuery, (tableErr) => {
        if (tableErr) {
            console.error('Error creating table:', tableErr);
            return res.status(500).send('Error creating table');
        }

        console.log(`Table created or already exists`);

        connection.query(checkUserQuery, async (checkErr, results) => {
            if (checkErr) {
                console.error('Error checking user:', checkErr);
                return res.status(500).send('Error checking user');
            }

            if (results.length > 0) {
                // User already exists
                console.log('User already exists');
                return res.status(400).json({ message: 'User already exists', success: false });
            }

            // Hash the password
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);

            // Insert document into the table
            const insertDocumentQuery = `
                INSERT INTO User (name, username, phone, email, password) VALUES
                 ('${name}', '${username}', '${phone}', '${email}', '${hashPassword}')
            `;

            connection.query(insertDocumentQuery, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting document:', insertErr);
                    return res.status(500).send('Error inserting document');
                }

                console.log('Document inserted successfully');
                return res.status(200).json({ message: 'Document inserted successfully', success: true });
            });
        });
    });
});


export default router;
