import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { setCredentials, setLoading, setError } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { auth } from '../../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Determine if input is email or phone
    if (identifier.includes('@')) {
      setIsEmail(true);
    } else {
      setIsEmail(false);
    }
  }, [identifier]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (identifier.length !== 10 || isNaN(identifier)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    dispatch(setLoading(true));
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = '+91' + identifier;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpScreen(true);
      setCountdown(30);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    dispatch(setLoading(true));
    try {
      // 1. Verify OTP with Firebase
      await confirmationResult.confirm(otp);
      
      // 2. Authenticate with our Backend
      const res = await api.post('/auth/phone-login', { phone: '+91' + identifier });
      dispatch(setCredentials(res.data.data));
      toast.success('Logged in successfully');
      navigate('/');
      
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await authService.login({ email: identifier.trim(), password });
      dispatch(setCredentials(res.data));
      toast.success('Logged in successfully');
      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || 'Login failed'));
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#2874f0] lg:bg-white font-sans">
      <div id="recaptcha-container"></div>
      
      {/* Left side - Image (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#2874f0] items-center justify-center flex-col p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Login</h2>
        <p className="text-lg text-white/80 leading-relaxed mb-8">
          Get access to your Orders, Wishlist and Recommendations
        </p>
        <img 
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" 
          alt="Login" 
          className="w-full max-w-sm mt-auto mix-blend-multiply"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-end lg:justify-center">
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center justify-center py-10 px-4 text-white">
          <Link to="/" className="font-bold text-3xl italic tracking-tight mb-2">
            ZEN-G WEAR
          </Link>
          <p className="text-white/80 text-sm font-medium">Log in for the best experience</p>
        </div>

        <div className="w-full bg-white rounded-t-3xl lg:rounded-none px-6 pt-12 pb-8 sm:px-10 lg:px-20 xl:px-24 h-auto min-h-[70vh] lg:min-h-0 flex flex-col lg:justify-center relative">
          <div className="mx-auto w-full max-w-sm">
            
            {!showOtpScreen ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link to="/" className="hidden lg:block font-bold text-3xl italic text-[#2874f0] mb-8">
                  ZEN-G WEAR
                </Link>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={isEmail ? handleEmailLogin : handleSendOtp}>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 mb-2">Enter Email/Mobile number</label>
                    <input
                      type="text"
                      required
                      className="block w-full border-b-2 border-gray-300 px-0 py-2 focus:border-[#2874f0] focus:outline-none transition-colors text-black font-medium"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>

                  <AnimatePresence>
                    {isEmail && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="relative mt-6">
                          <label className="block text-xs font-bold text-gray-500 mb-2">Enter Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full border-b-2 border-gray-300 px-0 py-2 focus:border-[#2874f0] focus:outline-none transition-colors text-black font-medium pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-xs text-gray-500">
                    By continuing, you agree to Zen-G Wear's <span className="text-[#2874f0]">Terms of Use</span> and <span className="text-[#2874f0]">Privacy Policy</span>.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || identifier.length < 5}
                    className="w-full bg-[#fb641b] text-white font-bold py-3.5 px-4 rounded shadow hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Please wait...' : (isEmail ? 'Login' : 'Request OTP')}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Please enter the OTP sent to</h2>
                <p className="text-sm font-bold text-gray-600 mb-8">+91 {identifier} <button onClick={() => setShowOtpScreen(false)} className="text-[#2874f0] ml-2 font-bold hover:underline">Change</button></p>

                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div className="flex justify-center gap-4 mb-8">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      className="block w-full text-center text-3xl tracking-[1em] border-b-2 border-[#2874f0] px-0 py-2 focus:outline-none text-black font-bold"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#fb641b] text-white font-bold py-3.5 px-4 rounded shadow hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Not received your code?{' '}
                    {countdown > 0 ? (
                      <span className="font-bold text-gray-400">Resend code in {countdown}s</span>
                    ) : (
                      <button onClick={handleSendOtp} className="font-bold text-[#2874f0] hover:underline">Resend OTP</button>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {!showOtpScreen && (
              <div className="mt-auto pt-10 text-center">
                <Link to="/register" className="text-[#2874f0] font-bold hover:underline text-sm shadow-sm bg-white border border-[#e0e0e0] px-4 py-3 block w-full rounded hover:shadow-md transition-shadow">
                  New to Zen-G Wear? Create an account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
