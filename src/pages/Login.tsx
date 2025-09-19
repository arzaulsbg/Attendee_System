import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  return <LoginForm onToggleMode={toggleMode} isRegisterMode={isRegisterMode} />;
};

export default Login;