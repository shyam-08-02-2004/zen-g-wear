import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      setSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send reset link');
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
            <h2 className="text-2xl lg:text-3xl font-semibold mb-2 lg:mb-4">Reset Password</h2>
            <p className="text-[15px] lg:text-[17px] text-white/90 font-medium leading-snug lg:leading-relaxed">
              Get back access to your account by resetting your password.
            </p>
          </div>
          
          <ShoppingBag size={120} className="hidden lg:block mx-auto mt-12 text-white/50 relative z-10" strokeWidth={1} />
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-3/5 p-6 lg:p-14 flex flex-col justify-center bg-white relative flex-1">
          
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-500 mb-6">We have sent a password reset link to <br/><span className="font-semibold text-gray-900">{email}</span></p>
              <Link to="/login" className="inline-block py-3 px-8 bg-[#2874f0] text-white font-bold rounded shadow hover:bg-[#0a2885] transition-colors">
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <form className="space-y-6 lg:space-y-8 mt-4 lg:mt-0" onSubmit={handleSubmit}>
                <div className="group">
                  <label 
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
                  >
                    Enter Registered Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    A reset link will be sent to your email to help you recover your account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-[2px] shadow bg-[#fb641b] hover:bg-[#f3570b] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Link...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <Link to="/login" className="text-[#2874f0] font-semibold text-[15px] hover:underline">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
