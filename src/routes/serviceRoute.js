import express from 'express'
import { uploadServicePic } from '../utilities/multer.js'
import { CreateService, UpdateService, GetAllServices, RemoveService } from '../controllers/serviceController.js'

const router = express.Router()
//create services
router.post('/create-service', uploadServicePic.single('image'), CreateService)

// Update service with image upload
router.put("/updateService/:id", uploadServicePic.single("image"), UpdateService);

// Get all services
router.get("/getAllServices", GetAllServices);

// Remove service
router.delete("/removeService/:id", RemoveService);


export default router;