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
    // return renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
    console.log('req.user 1st', req.user)
    const { usertype } = req.user;
    if (usertype === 'admin') return res.redirect('/admin');
    if (usertype === 'user') return res.redirect('/user');
    if (usertype === 'corporate') return res.redirect('/corporate');
  } else {
    renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
  }
});

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

// app.post('/:path', isAuthenticated, (req, res) => {
//   if(req.user){
//     const {usertype} = req.user;
//     req.query = req.body
//     console.log(req.body)
//     const path = req.params.path;
//     if(usertype === 'admin') return res.redirect(`/admin/${path}`);
//     if(usertype === 'user') return res.redirect(`/user/${path}`);
//     if(usertype === 'corporate') return res.redirect(`/corporate/${path}`);
//   }else{
//     res.redirect('/login.html')
//   }
// });


// app.get('/index-2.html',  (req, res) => {
//   res.redirect('/');
// });
// app.get('/account-profile.html', isAuthenticated, (req, res) => {
//   if(req.user) {
//     return res.render('account-profile', { UserName: req.user.name, UserEmail: req.user.email })
//   }else{
//     // const user = {
//     //   name: 'Guest',
//     //   email: 'guest@mail.com'
//     // }
//     // res.render('account-profile', { UserName: user.name, UserEmail: user.email })
//     res.redirect('/login.html')
//   }
// });


// app.get("/login.html", (req, res) => {
//   res.render('login')
// });
// app.post("/login.html", (req, res) => {
//   res.render('login')
// });

// app.get("/register.html", (req, res) => {
//   res.render('register')
// });

// app.get("/account-dashboard.html", isAuthenticated, (req, res) => {
//   if(req.user) {
//     // return res.render('account-dashboard', { user: req.user });
//     // console.log('req.user', req.user)
//     return res.render('account-dashboard', { UserName: req.user.name, UserEmail: req.user.email })
//   }
//   const user = {
//     name: 'Guest',
//     email: 'guest@email.com'
//   }
//   res.render('account-dashboard', {UserName: user.name, UserEmail: user.email})
// });

// app.get("/booking.html", isAuthenticated, (req, res) => {
//   res.render('booking');
// });

app.get('*', (req, res) => {
  res.render('404');
});