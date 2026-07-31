import express from "express";

const app = express();

app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.sendFile("index.html", {root: "views"})
})



// start server
// app.listen(3000, "0.0.0.0");

app.listen(0, () => {

    console.log(app.address());

});