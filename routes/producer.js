const express = require("express");
const router = express.Router();

const { create, producerById, read, update, remove, list } = require("../controllers/producer");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get('/producer/:producerId', read)
router.post("/producer/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/producer/:producerId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/producer/:producerId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/producers", list);

router.param('producerId', producerById);
router.param("userId", userById);

module.exports = router;    