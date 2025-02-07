import express from 'express'
import { CreateService, UpdateService, GetAllServices, RemoveService } from '../controllers/serviceController.js'
import { uploadSingle } from '../config/multer.js';

const router = express.Router()
//create services
router.post('/create-service', uploadSingle, CreateService)

// Update service with image upload
router.put("/updateService/:id", uploadSingle, UpdateService);

// Get all services
router.get("/getAllServices", GetAllServices);

// Remove service
router.delete("/removeService/:id", RemoveService);


export default router;