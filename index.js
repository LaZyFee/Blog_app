import { configDotenv } from "dotenv";
import app from './src/app.js'
configDotenv();

import { connectDB } from './src/config/connectDB.js';


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
export default app