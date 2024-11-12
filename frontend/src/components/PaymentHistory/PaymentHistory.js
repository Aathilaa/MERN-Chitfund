import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

// Utility function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
// Utility function to format time to hh:mm AM/PM
   // Function to format time to hh:mm AM/PM
   const formatTime = (timeString) => {
    const timePattern = /^(0?[1-9]|1[0-2]):([0-5][0-9])(AM|PM)$/i;

    // Check if the input matches the pattern
    const match = timeString.match(timePattern);
    if (!match) {
        return 'N/A'; // Return 'N/A' if the format is incorrect
    }

    let [_, hours, minutes, ampm] = match;

    // Ensure hours are in the range 1-12
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Format hours to two digits and append AM/PM
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm.toUpperCase()}`;
};
const PaymentHistory = ({userId}) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/payments'); // Backend API endpoint
                setPayments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment history:', error);
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);
    const filteredPayments = userId
    ? payments.filter(payment => payment.userId === userId)
    : payments;

  // Sort payments by date and time in descending order (most recent first)
  const sortedPayments = filteredPayments.sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time || ''}`);
    const dateTimeB = new Date(`${b.date} ${b.time || ''}`);
    return dateTimeB - dateTimeA;
  });
    const columns = [
        { field: 'id', headerName: 'S.No', width: 90 }, // Auto-generate an index
        { field: 'userId', headerName: 'User ID', width: 160 },
        { field: 'name', headerName: 'Name', width: 160 },
        { field: 'date', headerName: 'Date', width: 160 },
        { field: 'time', headerName: 'Time', width: 160 }, 
        { field: 'plan', headerName: 'Plan', width: 160 },
        { field: 'modeOfPayment', headerName: 'Mode of Payment', width: 160 },
        { field: 'amount', headerName: 'Amount', width: 160 },
    ];

  
const rows = sortedPayments.map((payment, index) => ({
    id: index + 1, // Generating serial number
    userId: payment.userId,
    name: payment.name,
    date: formatDate(payment.date), // Formatting date
    time: payment.time ? formatTime(payment.time) : 'N/A', // Default to 'N/A' if time is not present
    plan: payment.plan,
    modeOfPayment: payment.modeOfPayment,
    amount: payment.amount,
}));

    return (
        <div style={{ height: 400, width: '100%' , marginTop:'80px'}}>
            <h2>Payment History</h2><br></br>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                loading={loading}
                disableSelectionOnClick
            />
        </div>
    );
};

export default PaymentHistory;
