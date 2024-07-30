import {useState} from 'react';
import {PageEnum} from '../components/PageEnum';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import './WelcomePage.style.css';

const WelcomePage = () => {
    const [ShownPage, SetShownPage] = useState(PageEnum.welcome);
    const handleLoginClick = () => {
        SetShownPage(PageEnum.login);
    };
    const handleRegisterClick = () => {
        SetShownPage(PageEnum.register);
    };
    return (
        <div className='welcome-container'>
            <section className='welcome-section'>
                {ShownPage == PageEnum.welcome && (
                    <div>
                        <h2>Welcome!</h2>
                        <div className='buttons'>
                            <button
                                className='login-button'
                                onClick={handleLoginClick}
                            >
                                Login
                            </button>
                            <button
                                className='register-button'
                                onClick={handleRegisterClick}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                )}
                {ShownPage == PageEnum.login && <LoginPage />}
                {ShownPage == PageEnum.register && <RegisterPage />}
            </section>
        </div>
    );
};
export default WelcomePage;
