// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import WelcomePage from './pages/WelcomePage';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <WelcomePage />
//     </React.StrictMode>,
// );
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './pages/Home';
import WelcomePage from './pages/WelcomePage';

import Cookies from 'js-cookie';

const checkAuth = () => {
    const token = Cookies.get('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    } else {
        return false;
    }
};

const App = () => {
    const isAuthenticated = checkAuth();
    return isAuthenticated ? <Home /> : <WelcomePage />;
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
