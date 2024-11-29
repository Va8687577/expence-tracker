import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';  
import './dashboard.css';
import axios from 'axios';

// Register necessary components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    type: 'expense', // Default to 'expense'
    category: 'Other', // Default category
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.email);
      fetchTransactions(user.id); // Fetch transactions for the logged-in user
    }
  }, []);

  const fetchTransactions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const totalExpenses = transactions
    .filter(t => t.type === 'expense') 
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income') 
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const netSavings = totalIncome - totalExpenses;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (formData.description && formData.amount && formData.date) {
      try {
        if (selectedTransaction) {
          await axios.put(`http://localhost:5000/api/transactions/${selectedTransaction._id}`, {
            ...formData,
            userId: user.id,
          });
        } else {
          await axios.post('http://localhost:5000/api/transactions/add', {
            ...formData,
            userId: user.id,
          });
        }
        fetchTransactions(user.id); // Refresh the transaction list
        setFormData({ description: '', amount: '', date: '', type: 'expense', category: 'Other' }); // Reset form
        setSelectedTransaction(null); // Clear selected transaction
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/'); 
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date.split('T')[0], 
      type: transaction.type, 
      category: transaction.category || 'Other', // Include category for editing
    });
  };

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchTransactions(user.id); 
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Pie chart data
  const pieData = {
    labels: ['Expenses', 'Income'], 
    datasets: [
      {
        label: 'Total',
        data: [totalExpenses, totalIncome], 
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expenses Tracker</h1>
        <div className="user-info">
          User: {userName} | <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="summary">
        <div className="summary-item">
          <h2>Total Expenses</h2>
          <p>₹{totalExpenses}</p>
        </div>
        <div className="summary-item">
          <h2>Total Income</h2>
          <p>₹{totalIncome}</p>
        </div>
        <div className="summary-item">
          <h2>Net Savings</h2>
          <p>₹{netSavings}</p>
        </div>
      </div>
      <div className="chart">
        <h3>Financial Overview</h3>
        <div className="chart-placeholder">
          <Pie data={pieData} />
        </div>
      </div>
      <div className="recent-transactions">
  <h3>Recent Transactions</h3>
  <ul>
    {transactions.map((transaction, index) => (
      <li key={index} className="transaction-item">
        <span>{transaction.description} ({transaction.type} - {transaction.category}): </span>
        <span>₹{transaction.amount}</span>
        <span> ({new Date(transaction.date).toLocaleDateString()})</span>
        <div className="transaction-buttons">
          <button className="btn btn-edit" onClick={() => handleEdit(transaction)}>Edit</button>
          <button className="btn btn-delete" onClick={() => handleDelete(transaction._id)}>Delete</button>
        </div>
      </li>
    ))}
  </ul>
</div>

      <div className="input-form">
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Other">Other</option>
            <option value="Home Rent">Home Rent</option>
            <option value="Grocery">Grocery</option>
            <option value="Salary">Salary</option>
            <option value="Commission">Commission</option>
          </select>
          <button type="submit">{selectedTransaction ? 'Update' : 'Add'} Transaction</button>
        </form>
      </div>
      <div className="link-to-history">
        <Link to="/history" className="btn btn-secondary">View Transaction History</Link>
      </div>
    </div>
  );
};

export default Dashboard;
