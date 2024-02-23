import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";
import { connection } from "../server.js";
import { renderHomepage } from "../utlis/render.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { bookingsTableQuery, renderOtherPage } from "../utlis/table.js";
import moment from "moment";
import { getAllBookings } from "../utlis/allBookings.js";
import { render } from "ejs";


router.get('/', isAuthenticated, (req, res) => {
    // console.log('req.user', req.user);
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.get('/login.html', (req, res) => {
    res.redirect('/login.html');
});

router.get('/account-profile.html', renderOtherPage('account-profile.html'));

router.get('/booking.html', renderOtherPage('booking.html'));
router.get('/account-booking.html', async(req, res) => {
    if(req.user){
        const allBookings = await getAllBookings(req, res);
        return res.render('account-booking', {UserName: req.user.name, UserEmail: req.user.email, allBookings: allBookings})
    }
    renderOtherPage('account-booking.html');
});



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

router.post("/updateProfile/:id", async(req, res) => {
    const id = req.params.id;
    const { username, email_address, user_password, user_password_re_enter } = req.body;
    if(user_password !== user_password_re_enter) {
        console.log('Password does not match');
        return res.redirect('/account-profile.html');
    }
    const data = req.body;
    console.log(data);
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(user_password, saltRounds);
    const query = `UPDATE users SET name = '${username}', email = '${email_address}', password = '${hashPassword}'
     WHERE id = ${id}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error updating document:', err);
        } else {
            console.log('Document updated successfully');
        }
        res.redirect('/account-profile.html');
    });
});

export default router;
