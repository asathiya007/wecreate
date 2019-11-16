const express = require("express");
const cors = require("cors");

const app = express(); 
app.use(express.json());
app.use(cors());

// @route   GET /
// @desc    wecreate endpoint
@access  public 
app.get("/", (req, res) => {
    res.json({msg: "WeCreate ready!"});
}); 

// @route   GET /test
// @desc    test api running endpoint
// @access  public 
app.get("/test", (req, res) => {
    res.json({ msg: "API running" });
}); 

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`server running on port ${PORT}`));