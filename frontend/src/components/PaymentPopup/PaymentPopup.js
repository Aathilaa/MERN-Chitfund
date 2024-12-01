// PaymentPopup.js
import React, { useState, useEffect } from 'react';
import './PaymentPopup.css'; // Import the CSS file for styles
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import MonthlyUser from '../MonthlyUser/MonthlyUser';

const PaymentPopup = ({ handlePayment,userId, isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        amount: '',
        plan: '',
        paymentMode: '',
        id: '', // Add ID field
        paymentDate: '', // Add Payment Date field
        paymentTime: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                id: user.customId,
                plan: user.plan,
                paymentDate: '',
                paymentTime: '',
            }));
        }
    }, [user]);

    if (!isOpen) return null; // Do not render if not open

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate the form data
        if (!user.customId || !formData.paymentDate || !formData.plan || !formData.amount || !formData.paymentMode) {
            console.error("Missing required payment information");
            return;
        }
    
        const paymentData = {
            userId: user.customId,
            name: user.name,
            date: new Date(formData.paymentDate),
            time: formData.paymentTime,
            plan: formData.plan,
            amount: parseFloat(formData.amount),  // Ensure the amount is in float format
            modeOfPayment: formData.paymentMode,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/payments/add', paymentData);
            if (response.status === 201) {
                setSuccessMessage('Payment submitted successfully! ✔️');
                const updatedUser = response.data.updatedUser;
    
                console.log("Updated User Remaining Amount", updatedUser.remainingAmount);
                
                setFormData({
                    amount: '',
                    plan: '',
                    paymentMode: '',
                    id: '',
                    paymentDate: '',
                    paymentTime: '',
                });
            }
        } catch (error) {
            console.error("Error submitting payment:", error.response?.data || error.message);
        }
    };
    

    const handleGoBack = () => {
        onClose(); // Close the popup
    };

    const handleShowButtonClick = () => {
        navigate('/payment-history'); // Navigate to the payment history
    };

    // Utility function to format time to hh:mm AM/PM
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12) || 12; // Convert '0' to '12'
        return `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    return (
        <>
            <div className="popup-overlay">
                <div className="popup-content" style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', background: 'white', borderRadius: '10px' }}>
                    <h2>Payment for {user?.name}</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            type="text"
                            name="id"
                            placeholder="User ID"
                            value={formData.id}
                            readOnly // Make the ID field read-only
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                        />
                        <input
                            type="text"
                            name="amount"
                            placeholder="Enter Amount"
                            required
                            value={formData.amount}
                            onChange={handleChange}
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                        />
                        <select
                            name="plan"
                            required
                            value={formData.plan}
                            onChange={handleChange}
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                        >
                            <option value="">Select a Plan</option>
                            <option value="21month..50k">21 month..50k</option>
                            <option value="21month..1L">21 month..1L</option>
                            <option value="21month..2L">21 month..2L</option>
                            <option value="21week..50k">21 week..50k</option>
                        </select>
                        <select
                            name="paymentMode"
                            required
                            value={formData.paymentMode}
                            onChange={handleChange}
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                        >
                            <option value="">Select Mode of Payment</option>
                            <option value="GPay">GPay</option>
                            <option value="PhonePe">PhonePe</option>
                            <option value="Cash">Cash</option>
                        </select>
                        <input
                            type="text" // Change to text for manual input
                            name="paymentTime"
                            placeholder="Enter Time (hh:mm AM/PM)"
                            value={formData.paymentTime}
                            onChange={handleChange}
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                            disabled={formData.paymentMode !== 'GPay' && formData.paymentMode !== 'PhonePe'} // Enable only for GPay and PhonePe
                        />
                        <input
                            type="date"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            style={{ border: 'none', borderBottom: '1px dashed #000', marginBottom: '10px', height: '40px', fontSize: '16px' }}
                        />
                        <div className="form-buttons">
                            <button type="submit" className="btn-submit">Pay</button>
                            <button type="button" onClick={handleGoBack} className="btn-submit">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            {successMessage && (
                <div className="success-popup">
                    <p>{successMessage}</p>
                    <br />
                    <button onClick={handleShowButtonClick} className="btn-submit" >Show</button>
                </div>
            )}
        </>
    );
};

export default PaymentPopup;






