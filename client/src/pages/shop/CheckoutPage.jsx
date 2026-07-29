import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Smartphone } from 'lucide-react';
import { saveShippingAddress, clearCartItems } from '../../redux/slices/cartSlice';
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
  
  const paymentMethod = 'UPI'; // ONLY QR/UPI payment allowed now
  
  const [loadingPay, setLoadingPay] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

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
  const taxPrice = 0.18 * subtotalAfterDiscount; 
  const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice;

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

  const placeOrderHandler = async (e) => {
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

    if (!utrNumber || utrNumber.length < 4) {
      toast.custom((t) => (
        <div className="max-w-md w-full bg-red-600 text-white shadow-lg rounded-lg pointer-events-auto p-4 font-bold">
          Please enter a valid UTR/Reference number.
        </div>
      ));
      return;
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
        utrNumber,
      };

      const res = await ordersService.createOrder(orderData);
      
      toast.success(`QR Payment Verified! Order Sent to Admin for Dispatch.`);
      
      dispatch(clearCartItems());
      navigate('/order-success', { 
        state: { 
          orderId: res.data.data.orderNumber,
          totalPrice,
          paymentMethod,
          itemsCount: cartItems.length
        } 
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f1f3f6] font-sans selection:bg-black selection:text-white">
      <main className="flex-grow max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-black mb-8">
          Secure Checkout
        </h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-8">
            <form id="checkout-form" onSubmit={placeOrderHandler} className="space-y-6">
              
              {/* Shipping Section */}
              <section className="bg-white p-6 shadow-sm rounded-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-sm bg-[#2874f0] text-white flex items-center justify-center text-sm font-bold">1</span>
                    <h2 className="text-base font-bold uppercase text-gray-900">Delivery Address</h2>
                  </div>
                </div>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-6 pl-12">
                    <div className="grid grid-cols-1 gap-4">
                      {savedAddresses.map(addr => (
                        <div 
                          key={addr._id} 
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-4 border cursor-pointer transition-colors ${selectedAddressId === addr._id && !showAddressForm ? 'border-[#2874f0] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-bold text-black flex items-center gap-2">
                                {addr.name} 
                                {addr.isDefault && <span className="bg-gray-200 text-gray-800 text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold">Default</span>}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                              <p className="text-sm text-gray-600 font-medium">{addr.city}, {addr.zipCode}</p>
                              {addr.mobileNumber && <p className="text-sm text-gray-600 font-medium flex items-center gap-1 mt-1"><Smartphone size={14}/> {addr.mobileNumber}</p>}
                            </div>
                            <input 
                              type="radio" 
                              checked={selectedAddressId === addr._id && !showAddressForm} 
                              readOnly 
                              className="accent-[#2874f0] mt-1 w-4 h-4" 
                            />
                          </div>
                        </div>
                      ))}
                      <div 
                        onClick={() => { setSelectedAddressId(null); setShowAddressForm(true); setFullName(''); setAddress(''); setCity(''); setPostalCode(''); setMobileNumber(''); }}
                        className={`p-4 border cursor-pointer flex items-center justify-center transition-colors ${showAddressForm ? 'border-[#2874f0] bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-sm font-bold text-[#2874f0]">+ Add New Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {showAddressForm && (
                  <div className="pl-0 sm:pl-12">
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
                        <input 
                          type="text" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-[#2874f0] transition-colors" 
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          value={mobileNumber} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setMobileNumber(val);
                          }} 
                          required 
                          maxLength={10}
                          pattern="[6-9][0-9]{9}"
                          placeholder="e.g. 9876543210"
                          autoComplete="nope"
                          className={`w-full px-4 py-3 border rounded-sm text-sm font-medium focus:outline-none transition-colors ${mobileNumber && mobileNumber.length === 10 && /^[6-9]/.test(mobileNumber) ? 'border-green-400 focus:border-green-500' : mobileNumber.length > 0 ? 'border-red-300 focus:border-red-400' : 'border-gray-300 focus:border-[#2874f0]'}`} 
                        />
                        {mobileNumber.length > 0 && mobileNumber.length < 10 && (
                          <p className="text-[10px] text-red-500 mt-1 font-bold">{10 - mobileNumber.length} more digit(s) needed</p>
                        )}
                        {mobileNumber.length === 10 && !/^[6-9]/.test(mobileNumber) && (
                          <p className="text-[10px] text-red-500 mt-1 font-bold">Number must start with 6, 7, 8, or 9</p>
                        )}
                        {mobileNumber.length === 10 && /^[6-9]/.test(mobileNumber) && (
                          <p className="text-[10px] text-green-600 mt-1 font-bold">✓ Valid number</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-[#2874f0] transition-colors" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">City</label>
                        <input 
                          type="text" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-[#2874f0] transition-colors" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          value={postalCode} 
                          onChange={(e) => setPostalCode(e.target.value)} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm font-medium focus:outline-none focus:border-[#2874f0] transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Payment Section */}
              <section className="bg-white p-6 shadow-sm rounded-sm">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-8 rounded-sm bg-[#2874f0] text-white flex items-center justify-center text-sm font-bold">2</span>
                  <h2 className="text-base font-bold uppercase text-gray-900">Payment Options</h2>
                </div>
                
                <div className="pl-0 sm:pl-12">
                  <div className="border border-[#2874f0] bg-blue-50/10 rounded-sm overflow-hidden">
                    <div className="p-4 flex items-center gap-3 border-b border-blue-100 bg-blue-50/50">
                      <input 
                        type="radio" 
                        checked={true}
                        readOnly
                        className="w-4 h-4 accent-[#2874f0]" 
                      />
                      <span className="text-sm font-bold text-black flex items-center gap-2">
                        <Smartphone size={18} className="text-[#2874f0]" /> UPI QR Payment
                      </span>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="bg-white p-3 border border-gray-200 shadow-sm mb-4 rounded-xl">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=zen-g@upi&pn=ZenG&am=${Math.round(totalPrice)}&cu=INR`} alt="UPI QR Code" className="mx-auto w-40 h-40 border-4 border-white shadow-sm rounded-lg" />
                        <p className="mt-4 text-sm font-bold text-gray-900">Scan to Pay ₹{Math.round(totalPrice).toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">Open any UPI app (GPay, PhonePe, Paytm) and scan the QR code to confirm your order.</p>
                      
                      <div className="w-full max-w-xs mb-6 text-left">
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-widest">
                          Enter 12-Digit UTR Number *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                          placeholder="e.g., 312345678901"
                          minLength={12}
                          maxLength={12}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm text-sm font-bold text-center tracking-[0.2em] focus:outline-none focus:border-[#2874f0] transition-colors" 
                        />
                        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                          After paying, check your bank/UPI app for the 12-digit UPI Reference Number (UTR). We need this to verify your payment.
                        </p>
                      </div>

                      <div className="bg-green-50 border border-green-200 px-4 py-2 flex items-center gap-2 rounded-sm w-full max-w-xs justify-center">
                        <ShieldCheck size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-green-700">100% Safe and Secure Payments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-sm sticky top-20">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-500 uppercase">Price Details</h2>
              </div>
              
              <div className="p-4 space-y-4 text-sm font-medium text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} items)</span>
                  <span>Rs {itemsPrice.toLocaleString('en-IN')}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs {discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">{shippingPrice === 0 ? 'FREE' : `Rs ${shippingPrice.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (18%)</span>
                  <span>Rs {taxPrice.toFixed(0).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="px-4 py-4 border-t border-gray-200 border-dashed">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black text-lg">Total Payable</span>
                  <span className="font-bold text-black text-lg">Rs {totalPrice.toFixed(0).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                <motion.button 
                  whileTap={{ scale: 0.98 }} 
                  form="checkout-form"
                  type="submit" 
                  disabled={loadingPay} 
                  className="w-full bg-[#fb641b] py-3.5 px-8 text-sm font-bold uppercase text-white hover:bg-[#f05a11] transition-colors rounded-sm shadow-sm disabled:opacity-50"
                >
                  {loadingPay ? 'Processing...' : 'CONFIRM ORDER'}
                </motion.button>
                <p className="text-[10px] text-gray-500 mt-3">By placing order you confirm you have scanned and paid via the QR Code above and provided a valid UTR.</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
