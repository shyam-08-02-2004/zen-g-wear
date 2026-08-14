import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, { password });
      toast.success('Password has been reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] lg:min-h-screen bg-[#f1f3f6] lg:p-8 font-sans items-center justify-center">
      <div className="w-full max-w-[850px] bg-white lg:rounded-md lg:shadow-[0_2px_4px_0_rgba(0,0,0,.1)] flex overflow-hidden h-full lg:h-auto lg:min-h-[600px] flex-col lg:flex-row">
        
        {/* Left side - Blue Panel */}
        <div className="lg:w-2/5 bg-[#2874f0] p-6 lg:p-10 flex flex-col justify-center lg:justify-between text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-3 lg:mb-10">
              <h1 className="text-2xl lg:text-3xl font-bold italic tracking-tight flex items-center gap-2">
                ZEN-G <span className="text-yellow-400">WEAR</span>
              </h1>
            </Link>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-2 lg:mb-4">Create New Password</h2>
            <p className="text-[15px] lg:text-[17px] text-white/90 font-medium leading-snug lg:leading-relaxed">
              Your new password must be different from previous used passwords.
            </p>
          </div>
          
          <ShoppingBag size={120} className="hidden lg:block mx-auto mt-12 text-white/50 relative z-10" strokeWidth={1} />
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-3/5 p-6 lg:p-14 flex flex-col justify-center bg-white relative flex-1">
          <form className="space-y-6 lg:space-y-8 mt-4 lg:mt-0" onSubmit={handleSubmit}>
            <div className="group">
              <label 
                htmlFor="password"
                className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="group">
              <label 
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-[2px] shadow bg-[#fb641b] hover:bg-[#f3570b] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-[#2874f0] font-semibold text-[15px] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
