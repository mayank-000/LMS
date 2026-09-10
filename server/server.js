const express = require("express");
const prisma = require("./config/db.js");

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT NOW()`;
        res.status(200).json({ message: "Good Health!" });
    } catch (err) {
        res.status(500).json({ message: "Bad Health!" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000")
})