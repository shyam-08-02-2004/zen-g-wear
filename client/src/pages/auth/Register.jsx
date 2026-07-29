import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { setCredentials, setLoading, setError } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState('');
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
      const res = await authService.register({ name, email, password });
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
      <div className="w-full max-w-[850px] bg-white lg:rounded-md lg:shadow-[0_2px_4px_0_rgba(0,0,0,.1)] flex overflow-hidden min-h-screen lg:min-h-[600px] flex-col lg:flex-row">
        
        {/* Left side - Blue Panel */}
        <div className="lg:w-2/5 bg-[#2874f0] p-8 lg:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Header Mobile / Desktop */}
          <div className="relative z-10">
            <Link to="/" className="inline-block mb-8 lg:mb-10">
              <h1 className="text-3xl font-bold italic tracking-tight flex items-center gap-2">
                ZEN-G <span className="text-yellow-400">WEAR</span>
              </h1>
            </Link>
            <h2 className="text-3xl font-semibold mb-4">Looks like you're new here!</h2>
            <p className="text-[17px] text-white/90 font-medium leading-relaxed">
              Sign up with your email to get started
            </p>
          </div>
          
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
            alt="Shopping" 
            className="hidden lg:block w-full max-w-[200px] mx-auto mt-12 mix-blend-multiply relative z-10"
          />
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-3/5 p-8 lg:p-14 flex flex-col bg-white relative flex-1">
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm font-medium">
              {error}
            </motion.div>
          )}

          <form className="space-y-6 mt-4 lg:mt-0" onSubmit={handleSubmit}>
            <div className="group">
              <label 
                htmlFor="name"
                className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
              >
                Enter Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="group">
              <label 
                htmlFor="email"
                className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
              >
                Enter Email Address
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

            <div className="relative group">
              <label 
                htmlFor="password"
                className="block text-xs font-semibold text-gray-500 mb-1 transition-colors group-focus-within:text-[#2874f0]"
              >
                Create Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full border-b-[1.5px] border-gray-300 px-0 py-2 pr-12 text-gray-900 focus:border-[#2874f0] focus:outline-none transition-colors bg-transparent text-[16px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-[#2874f0] font-semibold text-sm hover:text-blue-700 transition-colors bg-white px-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-[2px] shadow bg-[#fb641b] hover:bg-[#f3570b] text-white font-bold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </span>
              ) : 'Continue'}
            </button>
          </form>

          <div className="mt-auto pt-10">
            <Link 
              to="/login" 
              className="block w-full text-center py-3.5 px-4 bg-white text-[#2874f0] font-bold text-[15px] shadow-[0_2px_4px_0_rgba(0,0,0,.2)] hover:shadow-[0_2px_8px_0_rgba(0,0,0,.3)] rounded-[2px] transition-all"
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
