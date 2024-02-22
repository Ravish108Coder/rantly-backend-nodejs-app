import { Router } from "express";
import { renderHomepage } from "../utlis/render.js";
import { getAllUsers } from "../utlis/allUsers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = Router();


router.get('/', isAuthenticated, (req, res) => {
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.get('/booking.html', (req, res) => {
    res.render('booking')
});

router.get('/account-dashboard.html', isAuthenticated, async (req, res) => {
    if (req.user) {
        const allUsers = await getAllUsers();

        return res.render('account-dashboard', { UserName: req.user.name, UserEmail: req.user.email, Component1: 'myCustomers', Component2: 'myBookings', allUsers: allUsers })
    }
    const user = {
        name: 'Guest',
        email: 'guest@email.com'
    }
    res.render('account-dashboard', { UserName: user.name, UserEmail: user.email })
})

export default router;