import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import type { FormEvent } from 'react';

export default function Login() {
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return setError("Mobile number must be 10 digits");
    if (password.length !== 4) return setError("Password must be 4 digits"); 

    const result = login(mobile, password);
    if (!result.success) {
      setError(result.message || "Login failed"); 
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">HabitForge</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border rounded-md"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">4-Digit Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
              maxLength={4}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
}