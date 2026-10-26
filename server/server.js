const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const UserRoute = require("./routes/student.route.js");
const AdminRoute = require("./routes/tutor.route.js");

app.use("/u", UserRoute);
app.use("/a", AdminRoute);

app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000")
})