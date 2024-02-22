import { connection } from "../server.js";

const allUsersQuery = `SELECT * FROM users where usertype = 'user'`;

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query(allUsersQuery, (err, results) => {
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