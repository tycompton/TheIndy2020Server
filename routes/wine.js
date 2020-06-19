const express = require("express");
const router = express.Router();
 
const { 
  create, 
  wineById, 
  read, 
  remove, 
  update, 
  list,  
  listSearch,
  listRelated, 
  listTypes, 
  listBySearch,
  image 
} = require("../controllers/wine");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
          
router.get('/wine/:wineId', read);
router.post("/wine/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete('/wine/:wineId/:userId', requireSignin, isAuth, isAdmin, remove); 
router.put('/wine/:wineId/:userId', requireSignin, isAuth, isAdmin, update);

router.get('/wines', list);
router.get("/wines/search", listSearch);
router.get('/wines/related/:wineId', listRelated);
router.get('/wines/types', listTypes )
router.post("/wines/by/search", listBySearch);
router.get('/wine/image/:wineId', image);

router.param("userId", userById);
router.param("wineId", wineById);

module.exports = router; 
