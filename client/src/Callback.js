import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
