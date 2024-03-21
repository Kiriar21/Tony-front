import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import Login from '../../Pages/Login/Login';
import Home from '../../Pages/Home/Home';
import ErrorPage from '../../Pages/ErrorPage/ErrorPage';
import Account from '../../Pages/Account/Account';
import Talk from '../../Pages/Talk/Talk';
import MainLayout from '../../Layouts/MainLayout/MainLayout';
import axios from "axios";

function App() {
  const [isValidToken, setIsValidToken] = useState(!!sessionStorage.getItem('accessToken'));
  const [token, setToken] = useState(sessionStorage.getItem('accessToken'));

  const T2S = window.speechSynthesis || speechSynthesis; 


  useEffect(() => {
    const handleSessionStorageChange = async() => {
      if (sessionStorage.getItem('accessToken') !== token) {
        setIsValidToken(!!sessionStorage.getItem('accessToken'));
        setToken(sessionStorage.getItem('accessToken'));
      }
    }

    const handleSessionStorageCheck = async() => {
      const response = await axios.post(process.env.REACT_APP_API_SECURITY, { token });
      if (response?.data?.isValid) {
        setIsValidToken(true);
      } else {
        setIsValidToken(false);
      }
    }
    
    window.addEventListener('storage', handleSessionStorageChange);
    window.addEventListener('storage', handleSessionStorageCheck);

    return () => {
      window.removeEventListener('storage', handleSessionStorageChange);
      window.removeEventListener('storage', handleSessionStorageCheck);
    };

  }, [token]);

  return (
    <Router>
      <MainLayout>
          <Routes>
            <Route path='/*'>
                <Route path='login' element={<Login />} />
                <Route path='account'
                  element={ isValidToken ? ( <Account T2S={T2S} /> ) : ( <Navigate replate to='/login' />) } />
                <Route path='talk' 
                  element={ isValidToken ? ( <Talk T2S={T2S} /> ) : ( <Navigate replate to='/login' />) } />
                <Route path="" 
                  element={ isValidToken ? ( <Home T2S={T2S} /> ) : ( <Navigate replate to='/login' />) } />
                <Route path="*" 
                  element={ isValidToken ? ( <ErrorPage T2S={T2S} /> ) : ( <Navigate replate to='/login' />) } />
            </Route>
          </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
