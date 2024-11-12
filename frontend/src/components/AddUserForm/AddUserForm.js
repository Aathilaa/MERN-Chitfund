import React, { useState } from 'react';
import axios from 'axios';
import './AddUserForm.css';
import {useNavigate} from 'react-router-dom';

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        plan: '',
        mobileNum: '',
        joiningDate: '',
        address: '',
    });
    const [showPopup, setShowPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);  
        try {
            const response = await axios.post('http://localhost:5000/api/add-user/add', formData);
            if (response.status === 200) {
                setSuccessMessage('User added successfully! ✔️');
                setShowPopup(true);
                setFormData({ name: '', plan: '', mobileNum: '', joiningDate: '', address: '' });
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleGoBack = () => {
        // Navigate to the alert page or previous page
        window.history.back();
    };
    const handleShowButtonClick = () => {
        setShowPopup(false);
        navigate('/monthly-users'); // Replace with the correct path for your MonthlyUser component
    };
    return (
        <div className="add-user-container">
            <h2>Add User</h2><br></br>
            <form onSubmit={handleSubmit} className="add-user-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                /><br></br>
                <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="input-field"
                    required
                >
                    <option value="">Select a plan</option>
                    <option value="21month..50k">21 month..50k</option>
                    <option value="21month..1L">21 month..1L</option>
                    <option value="21month..2L">21 month..2L</option>
                    <option value="21week..50k">21 week..50k</option>
                </select> <br></br>
                <input
                    type="text"
                    name="mobileNum"
                    placeholder="Mobile Number"
                    value={formData.mobileNum}
                    onChange={handleChange}
                   className="input-field"
                    required
                /> <br></br>
                <input
                    type="date"
                    name="joiningDate"
                    placeholder="Date of Joining"
                    value={formData.joiningDate}
                    onChange={handleChange}
                   className="input-field"
                    required
                /> <br></br>
                <input
                    type="text"
                    name="address"
                    placeholder="Address (optional)"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                /> <br></br>
               <div className="form-buttons">
    <button type="submit" className="btn-submit">Add</button>
    <button type="button" onClick={handleGoBack} className="btn-submit">Go Back</button>
</div>

            </form>
            {showPopup && (
                <div className="overlay">
                    <div className="success-popup">
                        <p>{successMessage}</p><br />
                        <button onClick={handleShowButtonClick} className="btn-submit">Show</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddUserForm;
