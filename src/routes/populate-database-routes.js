const populate = require("../data/database/populate-database");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  populate.populateDatabase();
  res.status(200).send();
});

module.exports = router;
