import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout isLogin={isLogin} setIsLogin={setIsLogin}>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <LoginForm 
            key="login" 
            setIsLogin={setIsLogin} 
          />
        ) : (
          <RegisterForm 
            key="register" 
            setIsLogin={setIsLogin} 
          />
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthPage;