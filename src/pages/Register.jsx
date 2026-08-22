import React, { useState } from 'react';
import { API_BASE_URL } from '../api'; // अपनी जरूरत के अनुसार पाथ सेट करें
import { Eye, EyeOff } from 'lucide-react';

function Register({ onSwitchToLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        address: '',
        mobile: '',
        email: '',
        password: '',
        role: 'client_admin',
        product_id: 'Finance_Tracker' // आपके प्रोजेक्ट के अनुसार
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/client-admin/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'रजिस्ट्रेशन फेल हो गया!');
            }

            alert('रजिस्ट्रेशन सफल रहा!');
            if (onRegisterSuccess) onRegisterSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register New Account</h2>

                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                        <div className="relative flex items-center mt-1">
                            <input
                                type="text"
                                name="user_id"
                                placeholder=""
                                value={formData.user_id}
                                onChange={handleChange}
                                required
                                className="w-full p-2 pr-28 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute right-3 text-gray-400 text-sm pointer-events-none select-none">
                                @spreeti.com
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative flex items-center mt-1 border rounded-lg bg-white overflow-hidden">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="flex-1 p-2 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-3 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button onClick={onSwitchToLogin} className="text-sm text-blue-600 hover:underline">
                        Already have an account? Login here
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;