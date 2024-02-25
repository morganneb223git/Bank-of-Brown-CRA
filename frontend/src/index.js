import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './navbar';
import Home from './home';
import CreateAccount from './createaccount';
import Login from './login';
import Deposit from './deposit';
import Withdraw from './withdraw';
import Balance from './balance';
import AllData from './alldata';

function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return (
    <>
      <NavBar />
      <UserContext.Provider value={{users:[{name:'abel',email:'abel@mit.edu',password:'secret',balance:100}]}}>
        <div className="container" style={{padding: "20px"}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/deposit" element={<ProtectedRoute component={Deposit} />} />
            <Route path="/withdraw" element={<ProtectedRoute component={Withdraw} />} />
            <Route path="/balance" element={<ProtectedRoute component={Balance} />} />
            <Route path="/alldata" element={<ProtectedRoute component={AllData} />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}>
      <HashRouter>
        <App />
      </HashRouter>
    </Auth0Provider>
  </React.StrictMode>
);