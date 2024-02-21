import { Router } from "express";
import { connection } from '../server.js';
import { renderHomepage } from "../utlis/render.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = Router();

router.get("/", isAuthenticated, (req, res) => {
    renderHomepage(req, res, "Sign Out", "/logout", "Welcome Admin!");
});

router.get('/account-dashboard.html', isAuthenticated, (req, res)=> {
    if(req.user) {
        // return res.render('account-dashboard', { user: req.user });
        // console.log('req.user', req.user)
        return res.render('account-dashboard', { UserName: req.user.name, UserEmail: req.user.email })
      }
      const user = {
        name: 'Guest',
        email: 'guest@email.com'
      }
      res.render('account-dashboard', {UserName: user.name, UserEmail: user.email})
})

router.get("/all", isAuthenticated, (req, res) => {
    const query = `SELECT * FROM users`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching documents:', err);
            res.status(500).send('Error fetching documents');
        } else {
            console.log('Documents fetched successfully');
            res.status(200).send(results);
        }
    });
});


export default router;