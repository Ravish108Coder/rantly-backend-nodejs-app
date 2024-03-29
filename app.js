import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
export const app = express();
import path from 'path';
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import corporateRoutes from "./routes/corporateRoutes.js";
import commonRouter from "./routes/commonRoutes.js";
import { checkerLog, isAuthenticated, isUserAdmin, isUserCorporate, isUserCustomer } from "./middlewares/auth.js";
import { renderHomepage } from "./utlis/render.js";
import {sendMail} from "./controllers/sendMail.js";

const __dirname = path.resolve(path.dirname(''));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

app.use("/",  commonRouter);
app.use("/admin", isAuthenticated, isUserAdmin, adminRoutes);
app.use("/user", isAuthenticated, isUserCustomer, userRoutes);
app.use("/corporate", isAuthenticated, isUserCorporate, corporateRoutes);

app.get("/", isAuthenticated, (req, res) => {
  if (req.user) {
    const { usertype } = req.user;
    if (usertype === 'admin') return res.redirect('/admin');
    if (usertype === 'user') return res.redirect('/user');
    if (usertype === 'corporate') return res.redirect('/corporate');
  } else {
    renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
  }
});

app.get('/mail', sendMail);

app.get("/login.html", (req, res) => {
  res.render('login')
});
app.post("/login.html", (req, res) => {
  res.render('login')
});

app.get("/register.html", (req, res) => {
  res.render('register')
});

app.get('/:path', isAuthenticated, (req, res) => {
  if (req.user) {
    const { usertype } = req.user;
    const path = req.params.path;
    console.log('path', path)
    if (usertype === 'admin') return res.redirect(`/admin/${path}`);
    if (usertype === 'user') return res.redirect(`/user/${path}`);
    if (usertype === 'corporate') return res.redirect(`/corporate/${path}`);
  } else {
    res.redirect('/login.html')
  }
});

app.get('*', (req, res) => {
  res.render('404');
});