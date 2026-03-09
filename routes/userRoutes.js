const express      = require('express');
const router       = express.Router();
const {
  getUsers,
  getUsersSortedByAge,
  getUserStatsByRole,
  getUser,
  addUser,
  editUser,
  removeUser,
} = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

// ── Exercise routes ──────────────────────
router.get('/sorted/by-age',  getUsersSortedByAge); 
router.get('/stats/count',    getUserStatsByRole);  

router.get('/',       getUsers);                
router.get('/:id',    getUser);                     
router.post('/',      validateUser, addUser);     
router.put('/:id',    editUser);                  
router.delete('/:id', removeUser);         

module.exports = router;
