import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './history.css';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate(); // useNavigate hook to redirect

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/transactions/${user.id}`);
          setTransactions(response.data);
        } catch (error) {
          console.error('Error fetching transaction history:', error.message);
        }
      }
    };

    fetchData();
  }, []);

  // Handle the button click to navigate to the dashboard
  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Transaction History</h2>
      
      {/* Button to navigate to dashboard */}
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleNavigateToDashboard}>
          Go to Dashboard
        </button>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Type</th> {/* New column for transaction type */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.type === "income" ? "Income" : "Expense"}</td> {/* Displaying type */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
