import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { setCredentials, setLoading, setError } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await authService.register({ name, email, password, phone });
      dispatch(setCredentials(res.data));
      toast.success('Registration successful');
      navigate('/');
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Registration failed'));
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f6] lg:p-8 font-sans items-center justify-center">
      <div className="w-full max-w-[1000px] bg-white lg:rounded-md lg:shadow-[0_2px_4px_0_rgba(0,0,0,.1)] flex overflow-hidden flex-col lg:flex-row">
        
        {/* Left side - Blue Panel */}
        <div className="lg:w-[40%] bg-[#2874f0] p-6 lg:p-10 flex flex-col justify-center lg:justify-between text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-3 lg:mb-10">
              <h1 className="text-2xl lg:text-3xl font-bold italic tracking-tight flex items-center gap-2">
                ZEN-G <span className="text-yellow-400">WEAR</span>
              </h1>
            </Link>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-2 lg:mb-4">Looks like you're new here!</h2>
            <p className="text-[15px] lg:text-[17px] text-white/90 font-medium leading-snug lg:leading-relaxed">
              Sign up with your email to get started
            </p>
          </div>
          
          <ShoppingBag size={120} className="hidden lg:block mx-auto mt-12 text-white/50 relative z-10" strokeWidth={1} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-[60%] p-6 lg:p-10 bg-white relative flex-1 h-[100dvh] lg:h-auto overflow-y-auto">
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm font-medium">
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]">
                  Enter Full Name
                </label>
                <input
                  type="text" required
                  className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]">
                  Enter Mobile Number
                </label>
                <input
                  type="tel" required
                  className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]">
                Enter Email Address
              </label>
              <input
                type="email" required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]">
                Create Password
              </label>
              <input
                type={showPassword ? "text" : "password"} required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 pr-12 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-[#2874f0] font-semibold text-sm hover:text-blue-700 transition-colors bg-white px-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-[2px] shadow bg-[#fb641b] hover:bg-[#f3570b] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-block w-full max-w-xs text-center py-3 px-4 bg-white text-[#2874f0] font-bold text-[15px] shadow-[0_2px_4px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_8px_0_rgba(0,0,0,.3)] rounded-[2px] transition-all"
            >
              Existing User? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
