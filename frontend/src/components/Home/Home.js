import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogin = () => {
    navigate('/signin'); // Navigates to Signin component
  };
  return ( 
    <>
    <div className="img">
  <div className="home">
    
    <h1>Welcome to Kalyani ChitFund Admin Software</h1><br></br>
    <p>Empowering You to Manage Chit Funds with Confidence!</p><br></br>
    <button className="home-button" onClick={handleLogin}>Login</button>
</div>

</div>
<br></br>
<div class="news">
        <h2>Join Our News Letter</h2> <br></br>
        <p>Signup for our email newsletter to get exclusive discounts and updates and more</p>
        <br></br>
        <div>
            <input type="text" class="search"></input>
        </div>
       
        <div>
            <button>Subscribe</button>
        </div>
  </div>
   

</>
);
}



export default Home;