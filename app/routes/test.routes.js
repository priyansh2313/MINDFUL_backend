const testController = require("../controllers/test.controller");
const authorize = require("../middlewares/authorize")

module.exports = (router) => {
    router.post("/test", authorize, testController.createResult);
    router.get("/test", authorize, testController.getResults);
}