
import React, { useState} from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './Signin.css';
function Signin({setIsLoggedIn}) {
    const [isSignDivVisible, setIsSignDivVisible] = useState(false);
    const [signUpObj, setSignUpObj] = useState({ name: '', email: '', password: '' });
    const [loginObj, setLoginObj] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', signUpObj);
            console.log('Register:', response.data.message); // Handle success
            setSignUpObj({ name: '', email: '', password: '' });
            navigate('/alert'); // Redirect to home page
        } catch (error) {
            console.error('Signup error:', error.response.data.message);
            alert(error.response.data.message);
        }
    };
    
    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', loginObj);
            console.log('Login:', response.data.message); // Handle success
            setIsLoggedIn(true);
            setLoginObj({ email: '', password: '' });
          
            
            navigate('/alert'); // Redirect to home page
        } catch (error) {
            console.error('Login error:', error.response.data.message);
            alert(error.response.data.message);
        }
    };
    
    return (
        <div className="parent">
            <div className={`container ${isSignDivVisible ? 'active' : ''}`} id="container">
                <div className="form-container sign-up">
                    <form onSubmit={onRegister}>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <Link to="/google" className="icon"><i className="fa-brands fa-google-plus-g"></i></Link>
                            <Link to="/facebook" className="icon"><i className="fa-brands fa-facebook-f"></i></Link>
                            <Link to="/github" className="icon"><i className="fa-brands fa-github"></i></Link>
                            <Link to="/linkedin" className="icon"><i className="fa-brands fa-linkedin-in"></i></Link>
                        </div>
                        <span>or use your email for registration</span>
                        <input
                            type="text"
                            name="name"
                            value={signUpObj.name}
                            onChange={(e) => setSignUpObj({ ...signUpObj, name: e.target.value })}
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            name="email"
                            value={signUpObj.email}
                            onChange={(e) => setSignUpObj({ ...signUpObj, email: e.target.value })}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={signUpObj.password}
                            onChange={(e) => setSignUpObj({ ...signUpObj, password: e.target.value })}
                            placeholder="Password"
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={onLogin}>
                        <h1>Sign In</h1>
                        <div className="social-icons">
                            <Link to="/google" className="icon"><i className="fa-brands fa-google-plus-g"></i></Link>
                            <Link to="/facebook" className="icon"><i className="fa-brands fa-facebook-f"></i></Link>
                            <Link to="/github" className="icon"><i className="fa-brands fa-github"></i></Link>
                            <Link to="/linkedin" className="icon"><i className="fa-brands fa-linkedin-in"></i></Link>
                        </div>
                        <span>or use your email and password</span>
                        <input
                            type="email"
                            name="email"
                            value={loginObj.email}
                            onChange={(e) => setLoginObj({ ...loginObj, email: e.target.value })}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={loginObj.password}
                            onChange={(e) => setLoginObj({ ...loginObj, password: e.target.value })}
                            placeholder="Password"
                        />
                        <Link to="/linkedin">Forget Your Password?</Link>
                        <button type="submit">Sign In</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all site features</p>
                            <button type="button" className="hidden" id="login" onClick={() => setIsSignDivVisible(false)}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all site features</p>
                            <button type="button" className="hidden" id="register" onClick={() => setIsSignDivVisible(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
