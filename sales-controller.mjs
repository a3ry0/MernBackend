import express from 'express';
import * as sales from './sales-model.mjs';

const router = express.Router();

// CREATE controller
router.post('/sales', (req, res) => {
    sales.createSale(req.body)
        .then(sale => {
            console.log(`"${sale.product_name}" was added to the sales tracker.`);
            res.status(201).json(sale);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Failed to add the sale. Please check the input data.' });
        });
});

// RETRIEVE all sales
router.get('/sales', (req, res) => {
    sales.retrieveSales()
        .then(allSales => {
            if (allSales.length > 0) {
                console.log('All sales retrieved.');
                res.json(allSales);
            } else {
                res.status(404).json({ Error: 'No sales found.' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Failed to retrieve sales.' });
        });
});

// RETRIEVE sale by ID
router.get('/sales/:_id', (req, res) => {
    sales.retrieveSaleByID(req.params._id)
        .then(sale => {
            if (sale) {
                console.log(`Sale "${sale.product_name}" retrieved.`);
                res.json(sale);
            } else {
                res.status(404).json({ Error: `No sale found with ID: ${req.params._id}` });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Failed to retrieve the sale.' });
        });
});

// UPDATE controller
router.put('/sales/:_id', (req, res) => {
    sales.updateSale(req.params._id, req.body)
        .then(updatedSale => {
            console.log(`Sale "${updatedSale.product_name}" updated.`);
            res.json(updatedSale);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Failed to update the sale.' });
        });
});

// DELETE controller
router.delete('/sales/:_id', (req, res) => {
    sales.deleteSaleById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                console.log(`Sale with ID "${req.params._id}" deleted.`);
                res.status(200).json({ Success: 'Sale deleted.' });
            } else {
                res.status(404).json({ Error: `No sale found with ID: ${req.params._id}` });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ Error: 'Failed to delete the sale.' });
        });
});

export default router;