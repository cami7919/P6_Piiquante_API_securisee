//importations
const express = require('express');
const router = express.Router();

const sauceCtrl = require ('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

//routes:
router.post('/', auth, multer, sauceCtrl.createSauce);          
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, sauceCtrl.removeSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getSauces);
router.post("/:id/like", auth, sauceCtrl.likeSauce);


module.exports = router ;
