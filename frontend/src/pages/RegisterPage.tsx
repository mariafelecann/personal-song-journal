import axios from 'axios';
import {useState} from 'react';
import './LoginPage.style.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const connection = process.env.BACKEND_URL || 'http://localhost:3000';
    const handleRegister = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                connection + '/welcome/register',
                {
                    username,
                    password,
                },
            );

            console.log(response.data);
            alert('Register complete!');
        } catch (error: any) {
            console.error(error.response.data);
            setErrorMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className='form-group'>
                    <label>Username:</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label>Password:</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='login-button' type='submit'>
                    Register
                </button>
            </form>
            {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}
        </div>
    );
};

export default RegisterPage;
