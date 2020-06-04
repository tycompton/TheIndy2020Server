const express = require("express");
const router = express.Router();

const { create, list } = require("../controllers/brewery");
// const { create, breweryById, read, update, remove, list } = require("../controllers/brewery");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");


// router.get('/brewery/:breweryId', read)
router.post("/brewery/create/:userId", requireSignin, isAuth, isAdmin, create);
// router.put("/brewery/:breweryId/:userId", requireSignin, isAuth, isAdmin, update);
// router.delete("/brewery/:breweryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/breweries", list);

// router.param('categoryId', breweryById);
router.param("userId", userById);

module.exports = router; 