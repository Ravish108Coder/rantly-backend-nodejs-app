import jwt from "jsonwebtoken";
import { connection } from "../server.js";
import { renderHomepage } from "../utlis/render.js";

export const isAuthenticated = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            console.log("no token found in cookies");
            return res.redirect('/login.html')
            // return res.render('login', { message: 'Please login to continue' })
            // return renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user already exists in the table
        const checkUserQuery = `
        SELECT * FROM users WHERE id = '${decoded.id}'
        `;

        connection.query(checkUserQuery, (checkErr, results) => {
            if (checkErr) {
                console.error('Error checking user:', checkErr);
                return renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
            }

            if (results.length === 0) {
                return renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
            }
            console.log("User is authenticated");
            // console.log(results);
            if(!req.user) req.user = results[0];
            // console.log('req ka user attrb', req.user)
            next();
        });
    
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};