import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import dbconnect from './config/Database.js';
dbconnect()
let app = express();
import Route from './routes/Route.js';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin:"http://localhost:3000",
    methods:['GET','POST','PUT','PATCH'],
    credentials:true
}));
app.use('/',Route)
app.listen(7000,()=>console.log('server running on port 7000'))
