import { connection } from "../server.js";

export const getAllBookings = async (req, res) => {
    
    const { id } = req.user;

    const allBookingsQuery = `
    SELECT bookings.*, users.email_verified_at, users.remember_token, users.created_at, users.updated_at
    FROM bookings
    INNER JOIN users ON bookings.user_id = users.id
    WHERE bookings.user_id = ${id};
  `;

    return new Promise((resolve, reject) => {
        connection.query(allBookingsQuery, (err, results) => {
            if (err) {
                console.error('Error fetching bookings:', err);
                reject([]);
            } else {
                console.log('Bookings fetched successfully');
                resolve(results);
            }
        });
    });
}