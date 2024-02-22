import jwt from "jsonwebtoken";
import { connection } from "../server.js";
import { renderHomepage } from "../utlis/render.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        console.log('isAuthenticated middleware');
        const { token } = req.cookies;

        if (!token) {
            console.log("no token found in cookies");
            return res.redirect('/login.html');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user already exists in the table
        const checkUserQuery = `
            SELECT * FROM users WHERE id = '${decoded.id}'
        `;

        // console.log('before promise')

        const results = await new Promise((resolve, reject) => {
            // console.log('inside promise')
            connection.query(checkUserQuery, (checkErr, queryResults) => {
                if (checkErr) {
                    console.error('Error checking user:', checkErr);
                    reject(checkErr);
                } else {
                    // console.log('User found:');
                    resolve(queryResults);
                }
            });
        });

        // console.log('after promise')

        if (results.length === 0) {
            console.log('no user found');
            return renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with a comfortable car");
        }

        console.log("User is authenticated");
        if (!req.user) req.user = results[0];
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkerLog = (req, res, next) => {
    console.log('checkerLog middleware');
    next();
}

export const checkerLogTwo = (req, res, next) => {
    console.log('checkerLog middleware part two');
    next();
}


export const isUserAdmin = (req, res, next) => {
    if (req.user.usertype === 'admin') {
        // console.log('User is admin');
        console.log('this is admin function')
        next();
    } else {
        console.log('User is not admin');
        res.redirect('/');
    }
}

export const isUserCustomer = (req, res, next) => {
    if (req.user.usertype === 'user') {
        console.log('User is customer');
        next();
    } else {
        console.log('User is not customer');
        res.redirect('/');
    }
}

export const isUserCorporate = (req, res, next) => {
    if (req.user.usertype === 'corporate') {
        console.log('User is corporate');
        next();
    } else {
        console.log('User is not corporate');
        res.redirect('/');
    }
}