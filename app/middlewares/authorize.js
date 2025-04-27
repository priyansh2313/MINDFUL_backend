const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers["authorization"]; // Extract token from header
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