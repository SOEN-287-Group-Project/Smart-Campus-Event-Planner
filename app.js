import express from "express";
import { router } from "./routes/authRoutes.js";

const app = express();

app.set('view engine', 'ejs')

// app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.sendFile("index.html", {root: "views"})
})

app.use("/", router)

// start server
app.listen(3000, "localhost");