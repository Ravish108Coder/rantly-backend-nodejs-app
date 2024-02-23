import { Router } from "express";
import { connection } from '../server.js';
import { renderHomepage } from "../utlis/render.js";
import { checkerLogTwo } from "../middlewares/auth.js";
import { getAllUsers } from "../utlis/allUsers.js";
import { getAllCorporates } from "../utlis/allCorporates.js";
import { bookingsTableQuery, renderOtherPage } from "../utlis/table.js";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
const router = Router();


router.get("/", (req, res) => {
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.get('/login.html', (req, res) => {
    res.render('login')
});

// router.get('/booking.html', (req, res) => {
//     res.render('booking')
// });

router.get('/account-dashboard.html', async (req, res) => {
    if (req.user) {
        const allUsers = await getAllUsers();
        const allCorporates = await getAllCorporates();
        return res.render('account-dashboard', {
            UserName: req.user.name, UserEmail: req.user.email, Component1: 'myCustomers', Component2: 'myCorporates',
            allUsers: allUsers, allCorporates: allCorporates
        })
    }
    const user = {
        name: 'Guest',
        email: 'guest@email.com'
    }
    res.render('account-dashboard', { UserName: user.name, UserEmail: user.email })
})

// router.get("/all", (req, res) => {
//     const query = `SELECT * FROM users`;
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching documents:', err);
//             res.status(500).send('Error fetching documents');
//         } else {
//             console.log('Documents fetched successfully');
//             res.status(200).send(results);
//         }
//     });
// });



router.get('/02_dark-index-1.html', renderOtherPage('02_dark-index-1.html')); // done css js images
router.get('/02_dark-index-2.html', renderOtherPage('02_dark-index-2.html'));
router.get('/index.html', renderOtherPage('index.html'));
router.get('/index-2.html', renderOtherPage('index-2.html'));
router.get('/index-3.html', renderOtherPage('index-3.html'));
router.get('/index-4.html', renderOtherPage('index-4.html'));
router.get('/index-5.html', renderOtherPage('index-5.html'));
router.get('/index-6.html', renderOtherPage('index-6.html'));

router.get('/cars.html', renderOtherPage('cars.html'));
router.get('/02-dark-cars.html', renderOtherPage('02-dark-cars.html'));
router.get('/cars-list.html', renderOtherPage('cars-list.html'));
router.get('/02-dark-cars-list.html', renderOtherPage('02-dark-cars-list.html'));
router.get('/car-single.html', renderOtherPage('car-single.html'));
router.get('/02-dark-car-single.html', renderOtherPage('02-dark-car-single.html'));

router.get('/booking.html', renderOtherPage('booking.html'));
router.get('/account-profile.html', renderOtherPage('account-profile.html'));
router.get('/account-booking.html', renderOtherPage('account-booking.html'));
router.get('/account-favorite.html', renderOtherPage('account-favorite.html'));
router.get('/about.html', checkerLogTwo, renderOtherPage('about.html'));
router.get('/sample.html', renderOtherPage('sample.html'));

router.get('/about.html', (req, res) => {
    res.render('about')
});

// router.get('/about.html', (req, res) => {
//     // console.log('hi')
//     // const pagetitle = page.split('.html')[0];
//     // res.render('about');
//     // res.end();
//     res.send('hi from about')
// });


// router.get('/contact.html', renderOtherPage('contact.html'));
// router.get('/404.html', renderOtherPage('404.html'));
// router.get('*', renderOtherPage('404.html'));

// router.get('/login.html', (req, res) => {
//     if(req.user) {
//         return res.redirect('/');
//         res.render
//     }
// });

router.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM users WHERE id = ${id}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error deleting document:', err);
            res.status(500).send('Error deleting document');
        } else {
            console.log('Document deleted successfully');
            // res.status(200).send(results);
            res.redirect('/admin/account-dashboard.html');
        }
    });
});


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



export default router;