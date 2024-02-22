import { connection } from "../server.js";

const allCorporatesQuery = `SELECT * FROM users where usertype = 'corporate'`;

export const getAllCorporates = () => {
    return new Promise((resolve, reject) => {
        connection.query(allCorporatesQuery, (err, results) => {
            if (err) {
                console.error('Error fetching documents:', err);
                reject([]);
            } else {
                console.log('Documents fetched successfully');
                resolve(results);
            }
        });
    });
};