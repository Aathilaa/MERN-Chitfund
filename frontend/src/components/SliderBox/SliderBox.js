// SliderBox.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SliderBox.css'; // Ensure this CSS file is created

const SliderBox = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Define boxes and their paths
    const boxes = [
        { id: 1, text: 'Add User', path: '/add-user' },
        { id: 2, text: 'Payment History', path: '/payment-history' },
        { id: 3, text: 'Customer Details', path: '/monthly-users' },
        { id: 4, text: 'Admin', path: '/admin' },
    ];

    // Duplicate the boxes for seamless scrolling
    const duplicatedBoxes = [...boxes, ...boxes];

    return (
        <div className="slider-container">
            <div
                className={`slider ${isHovered ? 'stop' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {duplicatedBoxes.map((box) => (
                    <Link to={box.path} className="slider-box" key={box.id}>
                        {box.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SliderBox;

