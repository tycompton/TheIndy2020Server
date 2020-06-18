const express = require("express");
const router = express.Router();

const { create, typeById, read, update, remove, list } = require("../controllers/type");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get('/type/:typeId', read)
router.post("/type/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/type/:typeId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/type/:typeId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/types", list); 

router.param('typeId', typeById);
router.param("userId", userById);

module.exports = router;