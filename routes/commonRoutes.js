import { Router } from "express";
import { connection } from '../server.js';
const router = Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createTableQuery } from "../utlis/table.js";


router.post("/login", (req, res) => {
    console.log('Request body:', req.body);
    const { email, password } = req.body;

    connection.query(createTableQuery, (tableErr) => {
        if (tableErr) {
            console.error('Error creating table:', tableErr);
            // return res.status(500).send('Error creating table');
            return res.redirect('/login.html');
        }

        // console.log(`Table created or already exists`);
    });

    const query = `SELECT * FROM users WHERE email = '${email}'`;

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

                jwt.sign({ id: results[0].id, role: results[0].usertype}, process.env.JWT_SECRET, (jwtErr, token) => {
                    if (jwtErr) {
                        console.error('Error signing token:', jwtErr);
                        // return res.status(500).send('Error signing token');
                        return res.redirect('/login.html');
                    }
                    // console.log('token :', token);
                    res.cookie('token', token, { httpOnly: true });
                    
                    res.redirect('/');
                });
            } else {
                console.log('Invalid credentials');
                return res.redirect('/login.html');
            }
        }
    });
});

router.post("/logout", (req, res) => {
    console.log('Logging out 1st');
    res.clearCookie('token');
    res.redirect('/');
});

router.post("/register", (req, res) => {
    console.log('Request body:', req.body);
    // take data from request body
    const { name, username, phone, email, password, re_password } = req.body;

    if (password !== re_password) {
        console.log('Passwords do not match');
        // return res.status(400).json({ message: 'Passwords do not match', success: false });
        return res.redirect('/register.html');
    }
    // Create table if not exists
    

    // Check if the user already exists in the table
    const checkUserQuery = `
        SELECT * FROM users WHERE email = '${email}'
    `;

    connection.query(createTableQuery, (tableErr) => {
        if (tableErr) {
            console.error('Error creating table:', tableErr);
            // return res.status(500).send('Error creating table');
            return res.redirect('/register.html');
        }

        // console.log(`Table created or already exists`);

        connection.query(checkUserQuery, async (checkErr, results) => {
            if (checkErr) {
                console.error('Error checking user:', checkErr);
                // return res.status(500).send('Error checking user');
                return res.redirect('/register.html');
            }

            if (results.length > 0) {
                // User already exists
                console.log('User already exists');
                // return res.status(400).json({ message: 'User already exists', success: false });
                return res.redirect('/login.html');
            }

            // Hash the password
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);

            let date = new Date();
            date = date.toISOString().slice(0, 19).replace("T", " ");

            // Insert document into the table
            const insertDocumentQuery = `
                INSERT INTO users (name, email, password, email_verified_at, remember_token, created_at, updated_at) VALUES
                 ('${name}', '${email}', '${hashPassword}', '${date}', NULL, '${date}', '${date}')
            `;

            connection.query(insertDocumentQuery, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting document:', insertErr);
                    // return res.status(500).send('Error inserting document');
                    return res.redirect('/register.html');
                }

                console.log('Document inserted successfully');
                // return res.status(200).json({ message: 'Document inserted successfully', success: true });
                res.redirect('/login.html');
            });
        });
    });
});


export default router;
