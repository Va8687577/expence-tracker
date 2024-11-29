const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Add a new transaction
router.post('/add', async (req, res) => {
  try {
    const { description, amount, date, userId, type } = req.body; // Add type to destructuring

    // Validate incoming data
    if (!description || !amount || !date || !userId || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTransaction = new Transaction({ description, amount, date, userId, type }); // Include type
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error.message); // Improved error logging
    res.status(500).json({ message: 'Error saving transaction', error });
  }
});

// Get all transactions for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    res.status(500).json({ message: 'Error updating transaction', error });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

module.exports = router;
