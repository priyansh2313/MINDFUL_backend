const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.authToken; // Extract token from httpOnly cookie
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = decoded; 
        next();
    });
}