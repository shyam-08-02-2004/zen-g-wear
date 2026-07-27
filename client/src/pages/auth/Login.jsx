import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { setCredentials, setLoading, setError } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await authService.login({ email: email.trim(), password });
      dispatch(setCredentials(res.data));
      toast.success('Logged in successfully');
      // Redirect based on role
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Login failed'));
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#2874f0] lg:bg-white font-sans">
      {/* Left side - Image (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80" 
          alt="Fashion Model" 
          className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-16 left-16 text-white max-w-md">
          <h2 className="font-display text-4xl font-black uppercase tracking-widest mb-4 leading-tight">Enter The <br />Exclusive</h2>
          <p className="text-sm font-bold text-white/90 uppercase tracking-widest leading-relaxed">Sign in to discover the latest collections.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-end lg:justify-center">
        {/* Mobile Header (Flipkart style) */}
        <div className="lg:hidden flex flex-col items-center justify-center py-10 px-4 text-white">
          <Link to="/" className="font-bold text-3xl italic tracking-tight mb-2">
            ZEN-G WEAR
          </Link>
          <p className="text-white/80 text-sm font-medium">Log in for the best experience</p>
        </div>

        <div className="w-full bg-white rounded-t-3xl lg:rounded-none px-6 py-8 sm:px-10 lg:px-20 xl:px-24 h-auto min-h-[70vh] lg:min-h-0 flex flex-col lg:justify-center">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <Link to="/" className="hidden lg:block font-bold text-3xl italic text-[#2874f0] mb-8">
              ZEN-G WEAR
            </Link>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Access your account.</p>

            {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest">
              {error}
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-none border border-gray-200 px-4 py-3 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                placeholder="EMAIL@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-widest" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors underline underline-offset-4">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-none border border-gray-200 px-4 py-3 pr-12 placeholder-gray-400 focus:border-black focus:outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-xs font-bold text-white bg-black hover:bg-gray-900 focus:outline-none disabled:opacity-50 transition-colors uppercase tracking-widest mt-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Don't have an account?</p>
            <Link to="/register" className="inline-block border border-black px-8 py-3 text-xs font-bold text-black uppercase tracking-widest hover:bg-gray-50 transition-colors w-full">
              Create Account
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
