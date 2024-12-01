import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import './MonthlyUser.css';
import { Link } from 'react-router-dom';
import PaymentPopup from '../PaymentPopup/PaymentPopup';

const MonthlyUser = () => {
  const [users, setUsers] = useState([]);
  const [isPaymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/add-user');
        console.log('Fetched Users:', response.data); // Log fetched users
        setUsers(response.data);
       
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
const handlePayButtonClick = (user) => {
    setSelectedUser(user);
    setPaymentPopupOpen(true);
  };
 
 
  
  const handlePrizedChange = async (userId, newValue) => {
    try {
      // Determine current month for prizeMonth
      const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)

      // Make an API call to update the prized status in the backend
      await axios.put(`http://localhost:5000/api/add-user/${userId}`, {
        prized: newValue === 'Prized', // Adjusting the value based on user input
        prizeMonth: newValue === 'Prized' ? currentMonth : 0 // Set prizeMonth if prized
      });
      console.log(`Prized status for user ${userId} updated to ${newValue}`);
      const response = await axios.get('http://localhost:5000/api/add-user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating prized status:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 50, headerClassName: 'header-font-weight' },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      headerClassName: 'header-font-weight',
      renderCell: (params) => (
        <Link to={`/add-user/${params.row.customId}`} style={{ textDecoration: 'none', color: 'black', fontFamily: "'Montserrat', sans-serif'", fontWeight: 100, fontSize: '15px' }}>
          {params.value}
        </Link>
      ),
    },
    { field: 'customId', headerName: 'ID', width: 120, headerClassName: 'header-font-weight' },
    {
      field: 'totalAmountToPay',
      headerName: 'Total Amount to Pay',
      width: 180,
      headerClassName: 'header-font-weight',
      
    },
    { field: 'remainingAmount', headerName: 'Remaining Amount', width: 180, headerClassName: 'header-font-weight' },
    { field: 'plan', headerName: 'Plan', width: 150, headerClassName: 'header-font-weight' },
     // New Mobile Field Column
  {
    field: 'phoneNumber', // Assuming this field exists in your user database
    headerName: 'Mobile Number',
    width: 150,
    headerClassName: 'header-font-weight',
  
  },
    {
      field: 'pay',
      headerName: 'Pay',
      width: 110,
      renderCell: (params) => <button className="btn-color" onClick={() => handlePayButtonClick(params.row)}>Pay</button>,
      headerClassName: 'header-font-weight',
    },
   {
  field: 'prized',
  headerName: 'Prized/Non-Prized',
  width: 120,
  renderCell: (params) => {
    // Default to 'Non-Prized' if undefined
    const currentValue = params.value === undefined ? 'Non-Prized' : params.value;

    return (
      <select
        value={currentValue}
        onChange={async (event) => {
          const newValue = event.target.value;

          // Call the handler to update the prize status
          try {
            await handlePrizedChange(params.row.customId, newValue); // Update the prize status in the backend
          } catch (error) {
            console.error('Failed to update prize status:', error); // Log any errors
          }
        }}
      >
        <option value="Prized">Prized</option>
        <option value="Non-Prized">Non-Prized</option>
      </select>
    );
  },
  headerClassName: 'header-font-weight',
}
  ];

  const rows = users.map((user, index) => {
    if (!user) {
      return {};
    }
    return {
      id: index + 1,
      name: user.name,
      customId: user.customId,
      phoneNumber: user.mobileNum || 'N/A',
      plan: user.plan,
      remainingAmount:  user.remainingAmount,
      prized: user.prized || 'Non-Prized',
      totalAmountToPay:user.totalAmountToPay,
    };
  });
  
  return (
    <>
      <form className="product-search">
        <input type="text" id="search" placeholder="search" />
        <i className="fa-solid fa-magnifying-glass"></i>
      </form>
      <br />
      <div style={{ height: 400, width: '100%' }}>
        <h2>Monthly Users</h2>
        <br />
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
      <PaymentPopup isOpen={isPaymentPopupOpen} onClose={() => setPaymentPopupOpen(false)} user={selectedUser}  />
    </>
  );
};

export default MonthlyUser;













