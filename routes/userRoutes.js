import { Router } from "express";
const router = Router();
import { connection } from "../server.js";
import { renderHomepage } from "../utlis/render.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { bookingsTableQuery, renderOtherPage } from "../utlis/table.js";
import moment from "moment";


router.get('/', isAuthenticated, (req, res) => {
    // console.log('req.user', req.user);
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.get('/booking.html', renderOtherPage('booking.html'));
router.get('/account-booking.html', renderOtherPage('account-booking.html'));

router.get('/account-dashboard.html', isAuthenticated, (req, res)=> {
    if(req.user) {
        // return res.render('account-dashboard', { user: req.user });
        // console.log('req.user', req.user)
        return res.render('account-dashboard', {UserName: req.user.name, UserEmail: req.user.email, Component1: 'myRecentOrders', Component2: 'myFavourites' })
      }
      const user = {
        name: 'Guest',
        email: 'guest@email.com'
      }
      res.render('account-dashboard', {UserName: user.name, UserEmail: user.email})
})

router.post('/booking', (req, res) => {
    const { id, name, email } = req.user;
    const { Car_Type, Pick_Up_Date, Collection_Date, Pick_Up_Time, Collection_Time } = req.body;
    // Combine date and time
  let pickUpCombinedDateTime = `${Pick_Up_Date} ${Pick_Up_Time}`;
  pickUpCombinedDateTime = moment(pickUpCombinedDateTime, 'MMMM DD, YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
  let collectionCombinedDateTime = `${Collection_Date} ${Collection_Time}`;
  collectionCombinedDateTime = moment(collectionCombinedDateTime, 'MMMM DD, YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
console.log(pickUpCombinedDateTime, collectionCombinedDateTime)

    const reqBodyData = req.body;
    console.log(reqBodyData)
    console.log('i am in /booking post method')
    // res.json({userData, bookingData});
    // connection.query('')
    connection.query(bookingsTableQuery, (tableErr) => {
        if (tableErr) {
            console.error('Error creating table:', tableErr);
            // return res.status(500).send('Error creating table');
            return res.redirect('/booking.html');
        }
        // Insert document into the table
        const insertDocumentQuery = `
        INSERT INTO bookings (user_id, name, car_name, email, booking_from, booking_till) VALUES
         ('${id}', '${name}', '${Car_Type}', '${email}', '${pickUpCombinedDateTime}', '${collectionCombinedDateTime}')
    `;

        connection.query(insertDocumentQuery, (insertErr) => {
            if (insertErr) {
                console.error('Error inserting document:', insertErr);
                // return res.status(500).send('Error inserting document');
                return res.redirect('/booking.html');
            }

            console.log('Document inserted successfully');
            // return res.status(200).json({ message: 'Document inserted successfully', success: true });
            res.redirect('/account-booking.html');
        });

    });
})

router.post("/logout", (req, res) => {
    console.log('Logging out');
    res.clearCookie('token');
    res.redirect('/');
});


export default router;
