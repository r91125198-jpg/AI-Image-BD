
import React, { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../hooks/useGlobalState';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_NAME } from '../config';
import type { User } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SparklesIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch } = useGlobalState();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Admin Login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'admin',
          name: 'Admin',
          email: ADMIN_EMAIL,
          credits: Infinity,
          role: 'admin',
          status: 'active',
        };
        dispatch({ type: 'LOGIN', payload: adminUser });
        toast.success('Welcome, Admin!');
        return;
      }

      // User Login
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        if (user.status === 'blocked') {
            toast.error('Your account has been blocked.');
            return;
        }
        dispatch({ type: 'LOGIN', payload: user });
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        toast.error('Invalid credentials.');
      }
    } else {
      // Sign-Up
      if (state.users.some(u => u.email === email)) {
        toast.error('An account with this email already exists.');
        return;
      }
      const newUser: User = {
        id: new Date().toISOString(),
        name,
        email,
        password,
        credits: 10, // 10 free starter credits
        role: 'user',
        status: 'active',
      };
      dispatch({ type: 'REGISTER', payload: newUser });
      toast.success(`Welcome, ${name}! You have 10 free credits.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <SparklesIcon className="w-12 h-12 text-primary-500 mx-auto" />
                <h1 className="text-3xl font-bold text-white mt-2">{APP_NAME}</h1>
                <p className="text-gray-400">Your AI-powered image creation studio</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-8 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <Input 
                            label="Name" 
                            id="name" 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                        />
                    )}
                    <Input 
                        label="Email" 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <Input 
                        label="Password" 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <Button type="submit" className="w-full">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-500 hover:text-primary-400 ml-1">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
