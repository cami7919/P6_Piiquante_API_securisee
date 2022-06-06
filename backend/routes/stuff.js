//importations
const express = require('express');
const router = express.Router();

const stuffCtrl = require ('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

//routes:
router.post('/', auth, multer, stuffCtrl.createSauce);          
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, multer, stuffCtrl.removeSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.get('/', auth, stuffCtrl.getSauces);
router.post("/:id/like", auth, stuffCtrl.likeSauce);


module.exports = router ;
