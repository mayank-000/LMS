const express = require("express");
const prisma = require("./config/db.js");

const app = express();
app.use(express.json());

const UserRoute = require("./routes/student.route.js");
const AdminRoute = require("./routes/tutor.route.js");

app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT NOW()`;
        res.status(200).json({ message: "Good Health!" });
    } catch (err) {
        res.status(500).json({ message: "Bad Health!" });
    }
});

app.use("/u", UserRoute);
app.use("/a", AdminRoute);

app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000")
})