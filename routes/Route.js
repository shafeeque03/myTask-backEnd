import express from 'express'
import { addRole,getRole,deleteRole, editRole } from '../controller/roleController.js';
import { registerUser,getUser,deleteUser,updateUser,login } from '../controller/userController.js';
const myRoute = express.Router();

//roleRoute
myRoute.post('/addRole',addRole);
myRoute.get('/getRole',getRole);
myRoute.post('/deleteRole',deleteRole);
myRoute.post('/editRole',editRole);


//userRoute
myRoute.post('/addUser',registerUser);
myRoute.get('/getUsers',getUser);
myRoute.post('/deleteUser',deleteUser);
myRoute.post('/editUser',updateUser);
myRoute.post('/login',login)


export default myRoute