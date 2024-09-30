import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import cors from 'cors'
import path from 'path'


dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));  // Increase JSON payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use("/images", express.static(path.resolve(__dirname, "../public/uploads")));app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);
 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
