const userController = require("../controllers/user.controller.js")

module.exports = (router) => {
    router.post("/users/register", userController.registerUser);
    router.post("/users/login", userController.loginUser);
    // router.get("/users/profile/:id", userController.getUserProfile);
    // router.delete("/users/delete/:id", userController.deleteUser);
}