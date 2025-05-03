const authorize  = require("../middlewares/authorize");
const caseHistoryController = require("../controllers/caseHistory.controller.js");

module.exports = (router) => {
    router.post("/caseHistory", authorize, caseHistoryController.createCaseHistory);
    router.get("/caseHistory", authorize, caseHistoryController.getCaseHistoryByUserId);
}