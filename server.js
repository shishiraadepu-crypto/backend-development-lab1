
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Welcome to my Express server!");
});

app.get("/about", (req, res) => {
    res.status(200).json({
        name: "Adepu Shishira",
        section: "CSE CORE & 105"
    });
});

app.get("/time", (req, res) => {
    res.status(200).json({
        currentDateTime: new Date().toString()
    });
});

app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

app.listen(3000, () => {
    console.log("Express server running at http://localhost:3000");
});
