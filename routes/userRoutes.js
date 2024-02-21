import { Router } from "express";
const router = Router();
import { renderHomepage } from "../utlis/render.js";
import { isAuthenticated } from "../middlewares/auth.js";


router.get('/', isAuthenticated, (req, res) => {
    console.log('req.user', req.user);
    renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
});

router.post("/logout", (req, res) => {
    console.log('Logging out');
    res.clearCookie('token');
    res.redirect('/');
});


export default router;
