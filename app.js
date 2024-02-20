import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
export const app = express();
import path from 'path';
import userRouter from "./routes/User.js";
// import { renderHomepage } from "./utlis/render.js";
import { isAuthenticated } from "./middlewares/auth.js";
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

// app.get("/", (req, res) => {
//   res.send('Server nice working');
// });

app.get("/", isAuthenticated, (req, res) => {
  if (req.user) {
    return renderHomepage(req, res, "Sign Out", "/logout", `Welcome ${req.user.name}!`);
  }
  console.log('user nhi hai bhai')
  console.log(req.user)
  renderHomepage(req, res, "Sign In", "/login.html", "Explore the world with comfortable car");
});

app.get("/login.html", (req, res) => {
  res.render('login')
});

app.get("/register.html", (req, res) => {
  res.render('register')
});

app.post("/login.html", (req, res) => {
  res.render('login')
});
app.use("/", userRouter);

// module.exports = { app };