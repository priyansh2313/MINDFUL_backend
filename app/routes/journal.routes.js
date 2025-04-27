const journalController = require('../controllers/journal.controller.js');
const authorize = require('../middlewares/authorize.js');

module.exports = (router) => {
    router.post("/journal", authorize, journalController.createJournal);
    router.get("/journals", authorize, journalController.getJournals);
}