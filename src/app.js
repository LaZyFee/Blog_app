import { configDotenv } from "dotenv";
import express from 'express'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";


//routes import
import userRoute from './routes/userRoute.js'
import serviceRoute from './routes/serviceRoute.js'
import blogRoute from './routes/blogRoute.js'
import teamRoute from './routes/teamRoute.js'

configDotenv();

const app = express();
// Manually create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route
app.use('/api/v1', userRoute)
app.use('/api/v1', serviceRoute)
app.use('/api/v1', blogRoute)
app.use('/api/v1', teamRoute)


export default app