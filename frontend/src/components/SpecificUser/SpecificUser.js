import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PaymentHistory from '../PaymentHistory/PaymentHistory';

const SpecificUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // Modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/add-user/${userId}`);
        const userData = { ...response.data, payments: response.data.payments || [] };
  
      // Fetch payments data for the specific user
      const paymentsResponse = await axios.get(`http://localhost:5000/api/payments`);
      const userPayments = paymentsResponse.data.filter(payment => payment.userId === userId);
      
      // Sort payments by date and time in descending order (most recent first)
      const sortedPayments = userPayments.sort((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time || ''}`);
        const dateTimeB = new Date(`${b.date} ${b.time || ''}`);
        return dateTimeB - dateTimeA;
      });

  
        // Set user and payments after sorting
        const updatedUserData = { ...userData, payments: sortedPayments };
        setUser(updatedUserData);
  
        await generateRows(updatedUserData, sortedPayments);  // Pass sortedPayments here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [userId]);

  const formatDate = (date) => {
    if (!date) return ''; // Handle case where date is undefined
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const monthlyPay = async (user, monthIndex) => {
    if (!user || !user.plan || user.prizeMonth === undefined) return 0;

    const { plan, prized, prizeMonth, joiningDate } = user;
    const planAmount = parseInt(plan.split('..')[1].replace('k', '000').replace('L', '00000'));
    const baseAmountPerMonth = planAmount / 20;
    const interestPerMonth = planAmount * 0.01;

    const currentDate = new Date();
    const joiningDateObj = new Date(joiningDate);
    const monthsSinceJoining = (currentDate.getFullYear() - joiningDateObj.getFullYear()) * 12 +
                               (currentDate.getMonth() - joiningDateObj.getMonth()) + 1;

    if (prized) {
      if (monthsSinceJoining === prizeMonth) {
        return parseFloat(baseAmountPerMonth.toFixed(2));
      } else if (monthsSinceJoining > prizeMonth) {
        return parseFloat((baseAmountPerMonth + interestPerMonth).toFixed(2));
      }
    }

    return parseFloat(baseAmountPerMonth.toFixed(2));
  };

  const generateRows = async (user, sortedPayments) => {
    const startDate = new Date(user.joiningDate);
    const months = [];
    const planAmount = parseInt(user.plan.split('..')[1].replace('k', '000').replace('L', '00000'));
    const interestPerMonth = planAmount * 0.01;
  
    // Generate month labels based on the user's joining date
    for (let i = 0; i < 21; i++) {
        const nextMonth = new Date(startDate);
        nextMonth.setMonth(startDate.getMonth() + i);
        months.push(nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
  
    const newRows = [];
  
    // Generate rows for each month
    for (let index = 0; index < months.length; index++) {
        const month = months[index];
        const monthlyPayValue = await monthlyPay(user, index);  // Calculate the monthly pay
        const currentAmount = planAmount + (interestPerMonth * index);  // Calculate current amount

        // Find the latest payment for the current month
        const monthlyPayments = sortedPayments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getFullYear() === startDate.getFullYear() && 
                   paymentDate.getMonth() === startDate.getMonth() + index;
        });
  
        const latestPayment = monthlyPayments[monthlyPayments.length - 1];
        const formattedDate = latestPayment ? formatDate(latestPayment.date) : '';
        const modeOfPayment = latestPayment ? latestPayment.modeOfPayment : '';

        // Create the row
        const row = {
            id: index + 1,
            month,
            date: formattedDate,
            amount: currentAmount,  // Use currentAmount as the static amount
            monthlyPay: monthlyPayValue,
            modeOfPay: modeOfPayment,
        };

        newRows.push(row);  // Add the row to newRows
    }
    console.log(newRows); // Add this to check the structure of newRows
    
    
    // Update state with the fully generated rows
    setRows(newRows);
};

  

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const columns = [
    { field: 'id', headerName: 'S.No', width: 70 },
    { field: 'month', headerName: 'Month', width: 170 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 170 },
    { field: 'monthlyPay', headerName: 'Monthly Pay', width: 150 },
    { field: 'modeOfPay', headerName: 'Mode of Pay', width: 150 },
  ];

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
  };
  
  return (
    <div>
      <h2 style={{ marginTop: '75px', textAlign: 'center' }}>{user.name}'s Passbook</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Plan:</strong> {user.plan}</p>
          <p><strong>Total Amount to Pay:</strong> {user.totalAmountToPay}</p>
          <p><strong>Remaining Amount:</strong> {user.remainingAmount}</p>
        </div>
        <div>
          <p><strong>Prized Status:</strong> {user.prized ? 'Prized' : 'Non-Prized'}</p>
          <p><strong>Phone Number:</strong> {user.mobileNum}</p>
          <p><strong>Joining Date:</strong> {formatDate(user.joiningDate)}</p>
          <p><strong>Plan End Date:</strong> {formatDate(addMonths(user.joiningDate, 21))}</p>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            View History
          </Button>
        </div>
      </div>

      <div style={{ height: 300, width: '100%' }}>
     
        <DataGrid rows={rows} columns={columns} pageSize={5} disableSelectionOnClick />
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle }}>
          <PaymentHistory userId={userId} />
          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            style={{ float: 'right', marginBottom: '10px' }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SpecificUser;  




