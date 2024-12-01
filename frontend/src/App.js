import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import MonthlyUser from './components/MonthlyUser/MonthlyUser';
import SpecificUser from './components/SpecificUser/SpecificUser';
import PaymentHistory from './components/PaymentHistory/PaymentHistory';
import Header from './components/Header/Header';
import Signin from './components/Signin/Signin';
import Alert from './components/Alert/Alert';
import AddUserForm from './components/AddUserForm/AddUserForm';

function App() {
  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {/* Header component, passing login status */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* Define your routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass the setIsLoggedIn to Signin component */}
        <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />

        {/* Only render the admin-related routes if the user is logged in */}
        {isLoggedIn ? (
          <>
            <Route path="/alert" element={<Alert />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/monthly-users" element={<MonthlyUser />} />
     
            <Route path="/add-user/:userId" element={<SpecificUser />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/add-user" element={<AddUserForm />} />
          </>
        ) : (
          <Route path="*" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;



