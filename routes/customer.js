import express from 'express';
import {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    addMeasurementToCustomer,
} from '../controllers/customer.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/common/Uploads.js';

const router = express.Router();

router.post('/create', isAuthenticated, upload, createCustomer);
router.get('/all', isAuthenticated, getAllCustomers);
router.post('/view', isAuthenticated, getCustomerById);
router.put('/update', isAuthenticated,upload, updateCustomer);
router.delete('/delete', isAuthenticated, deleteCustomer);

router.post('/:id/measurements', addMeasurementToCustomer);

export default router;
