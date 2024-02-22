import { Router } from "express";
const router = Router();
import { renderHomepage } from "../utlis/render.js";
import { isAuthenticated } from "../middlewares/auth.js";


router.get('/', isAuthenticated, (req, res) => {
    // console.log('req.user', req.user);
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.get('/booking.html', (req, res) => {
    res.render('booking')
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

router.post("/logout", (req, res) => {
    console.log('Logging out');
    res.clearCookie('token');
    res.redirect('/');
});


export default router;
