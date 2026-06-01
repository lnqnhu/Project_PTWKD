const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
    "DAN_CONNECTION_STRING_CUA_BAN"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("NutriBae Server Running");
});

app.listen(3000, () => {
    console.log("Server Running On Port 3000");
});