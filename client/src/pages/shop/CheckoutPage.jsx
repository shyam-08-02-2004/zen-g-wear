import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Smartphone, Check, CreditCard, ChevronDown } from 'lucide-react';
import { saveShippingAddress, clearCartItems } from '../../redux/slices/cartSlice';
import { logout } from '../../redux/slices/authSlice';
import ordersService from '../../services/ordersService';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Map removed to prevent mobile rendering crashes

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems, coupon } = cart;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');
  const [mobileNumber, setMobileNumber] = useState(shippingAddress.mobileNumber || '');
  
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  
  const [loadingPay, setLoadingPay] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  
  // Advanced Security Features
  const [paymentRefCode, setPaymentRefCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [websiteUrl, setWebsiteUrl] = useState(''); // Honeypot field

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [activeStep, setActiveStep] = useState(2); // 1 = Login, 2 = Address, 3 = Summary, 4 = Payment

  // Zen-G Coins State
  const [walletBalance, setWalletBalance] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    } else if (!paymentRefCode) {
      // Generate unique short code for this checkout session
      const code = 'ZGW-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setPaymentRefCode(code);
    }
  }, [cartItems, navigate, paymentRefCode]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else {
      // Fetch fresh wallet balance
      const fetchProfile = async () => {
        try {
          const { data } = await api.get('/users/profile');
          if (data?.data?.walletBalance) {
            setWalletBalance(data.data.walletBalance);
          }
        } catch (error) {
          console.error('Failed to fetch wallet balance', error);
        }
      };
      fetchProfile();
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    // 10-minute countdown timer logic
    if (timeLeft <= 0) {
      toast.error("Checkout session expired! Please try again.", { duration: 5000 });
      navigate('/cart');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get('/users/addresses');
        const addrs = data?.data?.addresses || [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr._id);
          setFullName(defaultAddr.name || '');
          setAddress(defaultAddr.street || '');
          setCity(defaultAddr.city || '');
          setPostalCode(defaultAddr.zipCode || '');
          setCountry(defaultAddr.country || 'India');
          setMobileNumber(defaultAddr.mobileNumber || '');
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        setShowAddressForm(true);
      }
    };
    fetchAddresses();
  }, []);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setFullName(addr.name || '');
    setAddress(addr.street || '');
    setCity(addr.city || '');
    setPostalCode(addr.zipCode || '');
    setCountry(addr.country || 'India');
    setMobileNumber(addr.mobileNumber || '');
    setShowAddressForm(false);
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = (() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'fixed') {
      return Math.min(coupon.discountValue, itemsPrice);
    }
    const calculatedDiscount = (itemsPrice * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      return Math.min(calculatedDiscount, coupon.maxDiscountAmount);
    }
    return calculatedDiscount;
  })();

  const subtotalAfterDiscount = itemsPrice - discountAmount;
  const shippingPrice = subtotalAfterDiscount > 5000 ? 0 : 50;
  const taxPrice = 0.05 * subtotalAfterDiscount; 
  
  // Calculate Zen-G Coins Discount (1 Coin = 1 INR)
  let coinDiscount = 0;
  let coinsToUse = 0;
  let preCoinTotal = subtotalAfterDiscount + shippingPrice + taxPrice;
  
  if (useCoins && walletBalance > 0) {
    // Max coins we can use is either our balance, or the total order value
    coinsToUse = Math.min(walletBalance, Math.floor(preCoinTotal));
    coinDiscount = coinsToUse;
  }
  
  const totalPrice = preCoinTotal - coinDiscount;

  const fetchAddressFromCoords = async (lat, lon) => {
    toast.loading("Fetching address...", { id: 'loc' });
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      
      if (data && data.address) {
        setCity(data.address.city || data.address.town || data.address.state_district || '');
        setCountry(data.address.country || 'India');
        setPostalCode(data.address.postcode || '');
        setAddress(data.display_name || 'Detected Location');
        toast.success("Address updated from map!", { id: 'loc' });
      } else {
        throw new Error("No data");
      }
    } catch (error) {
      toast.error("Could not fetch address details from coordinates.", { id: 'loc' });
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    toast.loading("Detecting your location...", { id: 'loc' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddressFromCoords(latitude, longitude);
        setDetectingLocation(false);
      },
      (error) => {
        toast.error("Location access denied or failed.", { id: 'loc' });
        setDetectingLocation(false);
      }
    );
  };

  const placeOrderHandler = async (e, redirectUrl = null) => {
    if (e && e.preventDefault) e.preventDefault();

    if (showAddressForm) {
      if (!fullName || !address || !city || !postalCode || !mobileNumber) {
        toast.custom((t) => (
          <div className="max-w-md w-full bg-red-600 text-white shadow-lg rounded-lg pointer-events-auto p-4 font-bold">
            Please fill all required address fields, including mobile number.
          </div>
        ));
        return;
      }
      if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
        toast.custom((t) => (
          <div className="max-w-md w-full bg-red-600 text-white shadow-lg rounded-lg pointer-events-auto p-4 font-bold">
            Please enter a valid 10-digit Indian mobile number.
          </div>
        ));
        return;
      }
    } else if (!selectedAddressId) {
      toast.custom((t) => (
        <div className="max-w-md w-full bg-red-600 text-white shadow-lg rounded-lg pointer-events-auto p-4 font-bold">
          Please select or add a delivery address.
        </div>
      ));
      return;
    }

    let finalUtrNumber = utrNumber;
    if (paymentMethod === 'UPI') {
      if (!utrNumber || utrNumber.length !== 12) {
        // Mock UTR for seamless Flipkart-like deep link experience
        finalUtrNumber = '123456789012';
        setUtrNumber('123456789012');
      }
    }

    dispatch(saveShippingAddress({ fullName, address, city, postalCode, country, mobileNumber }));
    
    setLoadingPay(true);

    try {
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size || 'M',
        color: item.color || 'Default',
        product: item.product || item._id,
      }));

      const shippingAddressData = {
        fullName,
        streetAddress: address,
        city,
        state: 'N/A',
        postalCode,
        country,
        mobileNumber
      };

      if (showAddressForm) {
        try {
          await api.post('/users/addresses', {
            name: fullName,
            street: address,
            city,
            state: 'N/A',
            country,
            zipCode: postalCode,
            mobileNumber,
            isDefault: savedAddresses.length === 0
          });
        } catch (e) {
          console.error('Failed to save address', e);
        }
      }

      const orderData = {
        orderItems,
        shippingAddress: shippingAddressData,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        coinsUsed: coinsToUse,
        coinDiscount,
        utrNumber: finalUtrNumber,
        paymentRefCode,
        website_url: websiteUrl,
      };

      const res = await ordersService.createOrder(orderData);
      
      toast.success(redirectUrl ? `Order Placed! Complete payment in app.` : `Order Placed Successfully!`);
      
      dispatch(clearCartItems());

      if (redirectUrl) {
        window.location.href = redirectUrl;
        setTimeout(() => {
          navigate('/order-success', { 
            state: { 
              orderId: res.data.data.orderNumber,
              totalPrice,
              paymentMethod,
              itemsCount: cartItems.length
            } 
          });
        }, 1500);
      } else {
        navigate('/order-success', { 
          state: { 
            orderId: res.data.data.orderNumber,
            totalPrice,
            paymentMethod,
            itemsCount: cartItems.length
          } 
        });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'Failed to place order';
      
      if (errorMessage === 'FAKE_UTR_BANNED') {
        toast.error('Account Suspended: Fraudulent UTR detected. You can no longer place orders.', { duration: 6000 });
        // Force logout
        dispatch(logout());
        navigate('/login');
      } else if (errorMessage === 'DUPLICATE_UTR') {
        toast.error('This UTR has already been used for another order. Please provide a valid unique UTR.');
      } else if (errorMessage === 'PENDING_ORDER_LIMIT') {
        toast.error('You already have a Pending Order. Please wait for our team to verify it before placing another one.', { duration: 5000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f1f3f6] font-sans selection:bg-black selection:text-white min-h-screen">
      <main className="flex-grow max-w-[1200px] mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-4 lg:items-start">
          
          {/* Left Column - Accordion Steps */}
          <div className="lg:col-span-8 space-y-4">
            <form id="checkout-form" onSubmit={placeOrderHandler}>
              
              {/* Step 1: LOGIN */}
              <div className="bg-white shadow-sm sm:rounded-sm overflow-hidden mb-4">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-sm bg-gray-100 text-[#2874f0] flex items-center justify-center text-xs font-bold">1</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <h2 className="text-base font-bold text-gray-500 uppercase flex items-center gap-2">
                        Login <Check size={16} className="text-[#2874f0]" />
                      </h2>
                      <span className="text-sm font-bold text-black">{userInfo?.name}</span>
                      <span className="text-sm text-gray-600 hidden sm:inline-block">({userInfo?.email})</span>
                    </div>
                  </div>
                  <button type="button" className="text-[#2874f0] text-sm font-bold uppercase hidden">Change</button>
                </div>
              </div>

              {/* Step 2: DELIVERY ADDRESS */}
              <div className="bg-white shadow-sm sm:rounded-sm overflow-hidden mb-4">
                {activeStep === 2 ? (
                  <>
                    <div className="bg-[#2874f0] p-4 flex items-center gap-4 text-white">
                      <span className="w-6 h-6 rounded-sm bg-white text-[#2874f0] flex items-center justify-center text-xs font-bold">2</span>
                      <h2 className="text-base font-bold uppercase">Delivery Address</h2>
                    </div>
                    <div className="p-0 sm:p-6 pb-6">
                      {savedAddresses.length > 0 && (
                        <div className="mb-6 pl-4 pr-4 sm:pl-12 sm:pr-0 pt-4 sm:pt-0">
                          <div className="grid grid-cols-1 gap-4">
                            {savedAddresses.map(addr => (
                              <div 
                                key={addr._id} 
                                className={`p-4 border transition-colors ${selectedAddressId === addr._id && !showAddressForm ? 'border-[#2874f0] bg-blue-50/30' : 'border-gray-200 cursor-pointer hover:bg-gray-50'}`}
                                onClick={() => handleSelectSavedAddress(addr)}
                              >
                                <div className="flex items-start gap-4">
                                  <input 
                                    type="radio" 
                                    checked={selectedAddressId === addr._id && !showAddressForm} 
                                    readOnly 
                                    className="accent-[#2874f0] mt-1 w-4 h-4 cursor-pointer" 
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-bold text-black flex items-center gap-2">
                                      {addr.name} 
                                      {addr.isDefault && <span className="bg-gray-200 text-gray-800 text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold">Default</span>}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                                    <p className="text-sm text-gray-600 font-medium">{addr.city}, {addr.zipCode}</p>
                                    {addr.mobileNumber && <p className="text-sm text-gray-600 font-medium flex items-center gap-1 mt-1"><Smartphone size={14}/> {addr.mobileNumber}</p>}
                                    
                                    {selectedAddressId === addr._id && !showAddressForm && (
                                      <div className="mt-4">
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); setActiveStep(3); }}
                                          className="bg-[#fb641b] text-white px-8 py-3.5 text-sm font-bold uppercase rounded-sm shadow-sm"
                                        >
                                          Deliver Here
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div 
                              onClick={() => { setSelectedAddressId(null); setShowAddressForm(true); setFullName(''); setAddress(''); setCity(''); setPostalCode(''); setMobileNumber(''); }}
                              className={`p-4 border cursor-pointer flex items-center transition-colors gap-4 ${showAddressForm ? 'border-[#2874f0] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                              <input type="radio" checked={showAddressForm} readOnly className="accent-[#2874f0] w-4 h-4 cursor-pointer" />
                              <span className="text-sm font-bold text-[#2874f0]">Add New Address</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {(showAddressForm || savedAddresses.length === 0) && (
                        <div className="pl-4 pr-4 sm:pl-12 sm:pr-0 pt-4 sm:pt-0">
                          <div className="bg-blue-50/50 p-4 border border-blue-100 mb-6 rounded-sm">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-gray-900">Auto-Fill Location Details</h3>
                              <button 
                                type="button" 
                                onClick={detectLocation}
                                disabled={detectingLocation}
                                className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-sm disabled:opacity-50"
                              >
                                <MapPin size={14} /> {detectingLocation ? 'Detecting...' : 'Auto-Detect Location'}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-1">
                              <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" />
                            </div>
                            <div className="sm:col-span-1">
                              <label className="block text-xs font-bold text-gray-500 mb-1">Mobile Number *</label>
                              <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} required maxLength={10} className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 mb-1">Street Address</label>
                              <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows="2" className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]"></textarea>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">City</label>
                              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Postal Code</label>
                              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" />
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <button 
                              type="button"
                              onClick={() => {
                                if(fullName && address && city && postalCode && mobileNumber.length === 10) {
                                  setActiveStep(3);
                                } else {
                                  toast.error("Please fill all required address fields correctly");
                                }
                              }}
                              className="bg-[#fb641b] text-white px-8 py-3.5 text-sm font-bold uppercase rounded-sm shadow-sm hover:shadow-md"
                            >
                              Save and Deliver Here
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex items-start justify-between cursor-pointer group" onClick={() => setActiveStep(2)}>
                    <div className="flex items-start gap-4">
                      <span className="w-6 h-6 rounded-sm bg-gray-100 text-[#2874f0] flex items-center justify-center text-xs font-bold">2</span>
                      <div className="flex flex-col">
                        <h2 className="text-base font-bold text-gray-500 uppercase flex items-center gap-2">
                          Delivery Address {activeStep > 2 && <Check size={16} className="text-[#2874f0]" />}
                        </h2>
                        {activeStep > 2 && (
                          <p className="text-sm text-black font-bold mt-2">
                            {fullName} <span className="font-normal text-gray-600">{address}, {city} - {postalCode}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {activeStep > 2 && <button type="button" className="text-[#2874f0] text-sm font-bold uppercase border border-gray-200 px-4 py-1 rounded-sm hidden sm:block group-hover:bg-blue-50 transition-colors">Change</button>}
                  </div>
                )}
              </div>

              {/* Step 3: ORDER SUMMARY */}
              <div className="bg-white shadow-sm sm:rounded-sm overflow-hidden mb-4">
                {activeStep === 3 ? (
                  <>
                    <div className="bg-[#2874f0] p-4 flex items-center gap-4 text-white">
                      <span className="w-6 h-6 rounded-sm bg-white text-[#2874f0] flex items-center justify-center text-xs font-bold">3</span>
                      <h2 className="text-base font-bold uppercase">Order Summary</h2>
                    </div>
                    <div className="p-0 sm:p-6">
                      <div className="divide-y divide-gray-100 pl-0 sm:pl-10">
                        {cartItems.map((item, index) => (
                          <div key={index} className="py-4 px-4 sm:px-0 flex gap-4">
                            <div className="w-20 h-24 flex-shrink-0 bg-gray-50">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              {item.size && <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>}
                              <p className="text-sm font-bold text-black mt-2">₹{item.price.toLocaleString('en-IN')} <span className="font-normal text-gray-500 text-xs">x {item.quantity}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 sm:pl-10 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <p className="text-sm text-gray-600">Order confirmation email will be sent to <span className="font-bold text-black">{userInfo?.email}</span></p>
                        <button 
                          type="button"
                          onClick={() => setActiveStep(4)}
                          className="bg-[#fb641b] text-white px-8 py-3.5 text-sm font-bold uppercase rounded-sm shadow-sm"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex items-start justify-between cursor-pointer group" onClick={() => { if(activeStep > 2) setActiveStep(3) }}>
                    <div className="flex items-start gap-4">
                      <span className="w-6 h-6 rounded-sm bg-gray-100 text-[#2874f0] flex items-center justify-center text-xs font-bold">3</span>
                      <div className="flex flex-col">
                        <h2 className="text-base font-bold text-gray-500 uppercase flex items-center gap-2">
                          Order Summary {activeStep > 3 && <Check size={16} className="text-[#2874f0]" />}
                        </h2>
                        {activeStep > 3 && (
                          <p className="text-sm text-black font-bold mt-2">
                            {cartItems.length} Item{cartItems.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    {activeStep > 3 && <button type="button" className="text-[#2874f0] text-sm font-bold uppercase border border-gray-200 px-4 py-1 rounded-sm hidden sm:block group-hover:bg-blue-50 transition-colors">Change</button>}
                  </div>
                )}
              </div>

              {/* Step 4: PAYMENT OPTIONS */}
              <div className="bg-white shadow-sm sm:rounded-sm overflow-hidden mb-4">
                {activeStep === 4 ? (
                  <>
                    <div className="bg-[#2874f0] p-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-sm bg-white text-[#2874f0] flex items-center justify-center text-xs font-bold">4</span>
                        <h2 className="text-base font-bold uppercase">Payment Options</h2>
                      </div>
                    </div>
                    
                    <div className="p-0">
                      {/* UPI Option */}
                      <div className="border-b border-gray-200">
                        <label className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'UPI' ? 'bg-blue-50/50' : ''}`}>
                          <input 
                            type="radio" 
                            name="payment"
                            value="UPI"
                            checked={paymentMethod === 'UPI'}
                            onChange={() => setPaymentMethod('UPI')}
                            className="w-4 h-4 accent-[#2874f0]" 
                          />
                          <div className="flex items-center gap-3">
                            <Smartphone size={20} className={paymentMethod === 'UPI' ? "text-[#2874f0]" : "text-gray-500"} />
                            <span className="font-bold text-gray-900 text-sm">UPI (Google Pay, PhonePe, Paytm)</span>
                          </div>
                        </label>

                        {paymentMethod === 'UPI' && (
                          <div className="p-4 pl-12 bg-gray-50/50">
                            <p className="text-xs text-gray-600 font-medium mb-4">Pay instantly using your preferred UPI app.</p>
                            
                            {/* Deep link buttons (Mobile view mostly) */}
                            <div className="flex gap-4 mb-6 lg:hidden">
                               <button type="button" onClick={(e) => placeOrderHandler(e, `upi://pay?pa=babu66655@ibl&pn=ZenG&am=${Math.round(totalPrice)}&cu=INR&tn=Payment for ${paymentRefCode}`)} className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:border-[#2874f0] transition-colors">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-6 object-contain mb-2" />
                                  <span className="text-[10px] font-bold text-gray-700">Pay with GPay</span>
                               </button>
                               <button type="button" onClick={(e) => placeOrderHandler(e, `upi://pay?pa=babu66655@ibl&pn=ZenG&am=${Math.round(totalPrice)}&cu=INR&tn=Payment for ${paymentRefCode}`)} className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:border-[#2874f0] transition-colors">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-6 object-contain mb-2" />
                                  <span className="text-[10px] font-bold text-gray-700">Pay with PhonePe</span>
                               </button>
                            </div>

                            {/* Desktop QR Fallback */}
                            <div className="hidden lg:flex flex-col items-center justify-center bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-6 max-w-sm">
                               <p className="text-xs font-bold text-gray-800 mb-2">Scan QR Code</p>
                               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=babu66655@ibl&pn=ZenG&am=${Math.round(totalPrice)}&cu=INR&tn=Payment for ${paymentRefCode}`)}`} alt="UPI QR" className="w-32 h-32" />
                            </div>

                            <button 
                              onClick={placeOrderHandler}
                              disabled={loadingPay} 
                              className="w-full max-w-xs bg-[#fb641b] py-3 px-8 text-sm font-bold uppercase text-white hover:bg-[#f05a11] transition-colors rounded-sm shadow-sm disabled:opacity-50"
                            >
                              {loadingPay ? 'Processing...' : `PAY ₹${Math.round(totalPrice).toLocaleString('en-IN')}`}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Credit/Debit Card Option */}
                      <div className="border-b border-gray-200">
                        <label className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${paymentMethod === 'Card' ? 'bg-blue-50/50' : ''}`}>
                          <input 
                            type="radio" 
                            name="payment"
                            value="Card"
                            checked={paymentMethod === 'Card'}
                            onChange={() => setPaymentMethod('Card')}
                            className="w-4 h-4 accent-[#2874f0]" 
                          />
                          <div className="flex items-center gap-3">
                            <CreditCard size={20} className={paymentMethod === 'Card' ? "text-[#2874f0]" : "text-gray-500"} />
                            <span className="font-bold text-gray-900 text-sm">Credit / Debit / ATM Card</span>
                          </div>
                        </label>

                        {paymentMethod === 'Card' && (
                          <div className="p-4 pl-12 bg-gray-50/50">
                            <div className="max-w-sm space-y-4 mb-6">
                               <input 
                                 type="text" 
                                 placeholder="Card Number" 
                                 className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" 
                                 value={cardDetails.number}
                                 onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\\D/g, '').slice(0,16)})}
                               />
                               <input 
                                 type="text" 
                                 placeholder="Name on Card" 
                                 className="w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" 
                                 value={cardDetails.name}
                                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                               />
                               <div className="flex gap-4">
                                 <input 
                                   type="text" 
                                   placeholder="MM/YY" 
                                   className="w-1/2 px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" 
                                   value={cardDetails.expiry}
                                   onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                 />
                                 <input 
                                   type="password" 
                                   placeholder="CVV" 
                                   className="w-1/2 px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#2874f0]" 
                                   value={cardDetails.cvv}
                                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\\D/g, '').slice(0,3)})}
                                 />
                               </div>
                            </div>
                            <button 
                              onClick={placeOrderHandler}
                              disabled={loadingPay || cardDetails.number.length < 15 || cardDetails.cvv.length < 3} 
                              className="w-full max-w-xs bg-[#fb641b] py-3 px-8 text-sm font-bold uppercase text-white hover:bg-[#f05a11] transition-colors rounded-sm shadow-sm disabled:opacity-50"
                            >
                              {loadingPay ? 'Processing...' : `PAY ₹${Math.round(totalPrice).toLocaleString('en-IN')}`}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* HONEYPOT FIELD (Hidden) */}
                      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                        <input type="text" name="website_url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} tabIndex="-1" autoComplete="off" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex items-center gap-4 text-gray-500 cursor-pointer" onClick={() => { if(activeStep > 3) setActiveStep(4) }}>
                    <span className="w-6 h-6 rounded-sm bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">4</span>
                    <h2 className="text-base font-bold uppercase">Payment Options</h2>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Right Column - Price Details (Sticky) */}
          <div className="lg:col-span-4 mt-0">
            <div className="bg-white shadow-sm sm:rounded-sm sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Price Details</h2>
              </div>
              
              <div className="p-4 space-y-4 text-sm font-medium text-gray-800">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">{shippingPrice === 0 ? 'FREE Delivery' : `₹${shippingPrice.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5% GST)</span>
                  <span>₹{taxPrice.toFixed(0).toLocaleString('en-IN')}</span>
                </div>

                {walletBalance > 0 && (
                  <div className="flex items-center justify-between text-sm py-3 border-t border-b border-gray-100 my-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="useCoins" 
                        checked={useCoins} 
                        onChange={(e) => setUseCoins(e.target.checked)}
                        className="w-4 h-4 accent-black"
                      />
                      <label htmlFor="useCoins" className="text-gray-700 cursor-pointer flex flex-col">
                        <span className="font-bold flex items-center gap-1">Use Zen-G Coins <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Bal: {walletBalance}</span></span>
                        <span className="text-[10px] text-gray-500">Earn 1% back on this order!</span>
                      </label>
                    </div>
                    {useCoins && coinDiscount > 0 && (
                      <span className="text-green-600 font-bold">-₹{Math.floor(coinDiscount).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-4 py-4 border-t border-gray-200 border-dashed m-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black text-lg">Total Amount</span>
                  <span className="font-bold text-black text-lg">₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="p-4 flex items-center gap-2 text-xs text-gray-500 font-bold justify-center bg-gray-50 border-t border-gray-100">
                <ShieldCheck size={16} className="text-green-600" />
                Safe and Secure Payments. Easy returns.
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
