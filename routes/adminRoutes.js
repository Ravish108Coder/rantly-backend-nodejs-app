import { Router } from "express";
import { connection } from '../server.js';
import { renderHomepage } from "../utlis/render.js";
import { checkerLogTwo, isAuthenticated } from "../middlewares/auth.js";
import { getAllUsers } from "../utlis/allUsers.js";
import { getAllCorporates } from "../utlis/allCorporates.js";
import { renderOtherPage } from "../utlis/table.js";
const router = Router();


// router.get("/", isAuthenticated, (req, res) => {
//     renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
// });

// router.get('/login.html', (req, res) => {
//     res.render('login')
// });

// router.get('/booking.html', (req, res) => {
//     res.render('booking')
// });

// router.get('/account-dashboard.html', isAuthenticated, async (req, res) => {
//     if (req.user) {
//         const allUsers = await getAllUsers();
//         const allCorporates = await getAllCorporates();
//         return res.render('account-dashboard', {
//             UserName: req.user.name, UserEmail: req.user.email, Component1: 'myCustomers', Component2: 'myCorporates',
//             allUsers: allUsers, allCorporates: allCorporates
//         })
//     }
//     const user = {
//         name: 'Guest',
//         email: 'guest@email.com'
//     }
//     res.render('account-dashboard', { UserName: user.name, UserEmail: user.email })
// })

// router.get("/all", isAuthenticated, (req, res) => {
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



// router.get('/02_dark-index-1.html', isAuthenticated, renderOtherPage('02_dark-index-1.html')); // done css js images
// router.get('/02_dark-index-2.html', isAuthenticated, renderOtherPage('02_dark-index-2.html'));
// router.get('/index.html', isAuthenticated, renderOtherPage('index.html'));
// router.get('/index-2.html', isAuthenticated, renderOtherPage('index-2.html'));
// router.get('/index-3.html', isAuthenticated, renderOtherPage('index-3.html'));
// router.get('/index-4.html', isAuthenticated, renderOtherPage('index-4.html'));
// router.get('/index-5.html', isAuthenticated, renderOtherPage('index-5.html'));
// router.get('/index-6.html', isAuthenticated, renderOtherPage('index-6.html'));

// router.get('/cars.html', isAuthenticated, renderOtherPage('cars.html'));
// router.get('/02-dark-cars.html', isAuthenticated, renderOtherPage('02-dark-cars.html'));
// router.get('/cars-list.html', isAuthenticated, renderOtherPage('cars-list.html'));
// router.get('/02-dark-cars-list.html', isAuthenticated, renderOtherPage('02-dark-cars-list.html'));
// router.get('/car-single.html', isAuthenticated, renderOtherPage('car-single.html'));
// router.get('/02-dark-car-single.html', isAuthenticated, renderOtherPage('02-dark-car-single.html'));

// router.get('/booking.html', renderOtherPage('booking.html'));
// router.get('/account-profile.html', isAuthenticated, renderOtherPage('account-profile.html'));
// router.get('/account-booking.html', isAuthenticated, renderOtherPage('account-booking.html'));
// router.get('/account-favorite.html', isAuthenticated, renderOtherPage('account-favorite.html'));
// router.get('/about.html', checkerLogTwo, renderOtherPage('about.html'));
router.get('/sample.html', checkerLogTwo, renderOtherPage('sample.html'));

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
// router.get('/404.html', isAuthenticated, renderOtherPage('404.html'));
// router.get('*', renderOtherPage('404.html'));

// router.get('/login.html', isAuthenticated, (req, res) => {
//     if(req.user) {
//         return res.redirect('/');
//         res.render
//     }
// });

// router.post('/delete/:id', isAuthenticated, (req, res) => {
//     const id = req.params.id;
//     const query = `DELETE FROM users WHERE id = ${id}`;
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error deleting document:', err);
//             res.status(500).send('Error deleting document');
//         } else {
//             console.log('Document deleted successfully');
//             // res.status(200).send(results);
//             res.redirect('/admin/account-dashboard.html');
//         }
//     });
// });

export default router;