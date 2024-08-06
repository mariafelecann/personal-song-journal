import axios from 'axios';
import Cookies from 'js-cookie';
import {useState} from 'react';
import {PageEnum} from '../components/PageEnum';
import Home from './Home';
import './LoginPage.style.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [ShownPage, SetShownPage] = useState(PageEnum.login);
    const connection = process.env.BACKEND_URL;
    const handleLogin = async () => {
        try {
            const response = await axios.post(connection + '/welcome/login', {
                username,
                password,
            });

            const token = response.data.token;
            console.log(token);
            //localStorage.setItem('token', token);
            //console.log('Token after login:', localStorage.getItem('token'));
            Cookies.set('token', token);
            console.log('Token after login:', Cookies.get('token'));

            SetShownPage(PageEnum.list);
        } catch (error: any) {
            setError(error.response.data.error);
        }
    };

    return (
        <div className='welcome-container'>
            <section className='welcome-section'>
                {ShownPage == PageEnum.login && (
                    <div>
                        <h2>Login</h2>
                        <div className='form-group'>
                            <label htmlFor='username'>Username:</label>
                            <input
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password:</label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div style={{color: 'red'}}>{error}</div>}
                        <button className='login-button' onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                )}
                {ShownPage == PageEnum.list && <Home />}
            </section>
        </div>
    );
};

export default LoginPage;
