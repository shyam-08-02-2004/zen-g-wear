import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../../components/ui/Toast';
import { setCredentials } from '../../redux/slices/authSlice';
import authService from '../../services/authService';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state) => state.auth);

  const initialFirstName = userInfo?.name?.split(' ')[0] || '';
  const initialLastName = userInfo?.name?.split(' ').slice(1).join(' ') || '';

  const [editPersonal, setEditPersonal] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [gender, setGender] = useState('Male');
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(userInfo?.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  const [editMobile, setEditMobile] = useState(false);
  const [mobile, setMobile] = useState(userInfo?.phone || '');
  const [savingMobile, setSavingMobile] = useState(false);

  // Keep state in sync if userInfo updates
  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.name?.split(' ')[0] || '');
      setLastName(userInfo.name?.split(' ').slice(1).join(' ') || '');
      setEmail(userInfo.email || '');
      setMobile(userInfo.phone || '');
    }
  }, [userInfo]);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      const res = await authService.updateDetails({ name: `${firstName} ${lastName}`.trim(), email: userInfo?.email });
      const updatedUser = res.data.data.user;
      dispatch(setCredentials({ ...userInfo, ...updatedUser, token }));
      notify.success('Personal Information updated successfully');
      setEditPersonal(false);
    } catch (err) {
      notify.error('Failed to update information');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSavingEmail(true);
    try {
      const res = await authService.updateDetails({ email });
      const updatedUser = res.data.data.user;
      dispatch(setCredentials({ ...userInfo, ...updatedUser, token }));
      notify.success('Email updated successfully');
      setEditEmail(false);
    } catch (err) {
      notify.error('Failed to update email');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setSavingMobile(true);
    try {
      const res = await authService.updateDetails({ phone: mobile });
      const updatedUser = res.data.data.user || {};
      
      // Force update phone locally in case backend drops it
      updatedUser.phone = mobile;
      
      dispatch(setCredentials({ ...userInfo, ...updatedUser, token }));
      notify.success('Mobile number updated successfully');
      setEditMobile(false);
    } catch (err) {
      notify.error('Failed to update mobile number');
    } finally {
      setSavingMobile(false);
    }
  };

  return (
    <div className="bg-white lg:rounded-sm lg:shadow-sm font-sans flex flex-col min-h-[500px]">
      {/* Mobile Top Header - Looks like Flipkart App */}
      <div className="lg:hidden p-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#2874f0] font-bold text-xl border-2 border-white shadow-sm">
          {userInfo?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-gray-900 leading-tight">Profile Details</h1>
          <p className="text-[13px] text-gray-500">{userInfo?.email}</p>
        </div>
      </div>

      <div className="p-4 lg:p-8 flex-1">
        
        {/* Personal Information */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[15px] lg:text-[17px] font-bold text-gray-900">Personal Information</h2>
            {!editPersonal ? (
              <button onClick={() => setEditPersonal(true)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Edit
              </button>
            ) : (
              <button onClick={() => setEditPersonal(false)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handlePersonalSubmit} className="max-w-[550px]">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative group">
                {editPersonal && <label className="block text-xs font-semibold text-gray-500 mb-1 group-focus-within:text-[#2874f0]">First Name</label>}
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!editPersonal}
                  className={`w-full text-sm font-medium outline-none transition-colors ${
                    editPersonal 
                      ? 'px-4 py-3 border border-gray-300 rounded-sm focus:border-[#2874f0] bg-white' 
                      : 'px-4 py-3 bg-gray-50/80 border-transparent text-gray-600 rounded-sm'
                  }`}
                  placeholder={!editPersonal ? "First Name" : ""}
                />
              </div>
              <div className="flex-1 relative group">
                {editPersonal && <label className="block text-xs font-semibold text-gray-500 mb-1 group-focus-within:text-[#2874f0]">Last Name</label>}
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!editPersonal}
                  className={`w-full text-sm font-medium outline-none transition-colors ${
                    editPersonal 
                      ? 'px-4 py-3 border border-gray-300 rounded-sm focus:border-[#2874f0] bg-white' 
                      : 'px-4 py-3 bg-gray-50/80 border-transparent text-gray-600 rounded-sm'
                  }`}
                  placeholder={!editPersonal ? "Last Name" : ""}
                />
              </div>
            </div>
            
            <div className="mt-4 mb-6">
              <p className="block text-[13px] text-gray-500 mb-3 font-semibold">Your Gender</p>
              <div className="flex gap-8">
                <label className={`flex items-center gap-2 cursor-pointer ${!editPersonal ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input 
                    type="radio" name="gender" value="Male" 
                    checked={gender === 'Male'} onChange={() => setGender('Male')} 
                    disabled={!editPersonal}
                    className="w-4 h-4 text-[#2874f0] accent-[#2874f0]" 
                  />
                  <span className="text-sm font-medium text-gray-700">Male</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer ${!editPersonal ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input 
                    type="radio" name="gender" value="Female" 
                    checked={gender === 'Female'} onChange={() => setGender('Female')} 
                    disabled={!editPersonal}
                    className="w-4 h-4 text-[#2874f0] accent-[#2874f0]" 
                  />
                  <span className="text-sm font-medium text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {editPersonal && (
              <button type="submit" disabled={savingPersonal} className="w-full sm:w-auto bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                {savingPersonal ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>

        {/* Email Address */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[15px] lg:text-[17px] font-bold text-gray-900">Email Address</h2>
            {!editEmail ? (
              <button onClick={() => setEditEmail(true)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">Edit</button>
            ) : (
              <button onClick={() => setEditEmail(false)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">Cancel</button>
            )}
          </div>

          <form onSubmit={handleEmailSubmit} className="max-w-[300px]">
            <div className="relative group mb-4">
              {editEmail && <label className="block text-xs font-semibold text-gray-500 mb-1 group-focus-within:text-[#2874f0]">Email Address</label>}
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editEmail}
                className={`w-full text-sm font-medium outline-none transition-colors ${
                  editEmail 
                    ? 'px-4 py-3 border border-gray-300 rounded-sm focus:border-[#2874f0] bg-white' 
                    : 'px-4 py-3 bg-gray-50/80 border-transparent text-gray-600 rounded-sm'
                }`}
                placeholder={!editEmail ? "Email Address" : ""}
              />
            </div>
            {editEmail && (
              <button type="submit" disabled={savingEmail} className="w-full sm:w-auto bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                {savingEmail ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>

        {/* Mobile Number */}
        <div className="mb-4 lg:mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[15px] lg:text-[17px] font-bold text-gray-900">Mobile Number</h2>
            {!editMobile ? (
              <button onClick={() => setEditMobile(true)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">Edit</button>
            ) : (
              <button onClick={() => setEditMobile(false)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">Cancel</button>
            )}
          </div>

          <form onSubmit={handleMobileSubmit} className="max-w-[300px]">
            <div className="relative group mb-4">
              {editMobile && <label className="block text-xs font-semibold text-gray-500 mb-1 group-focus-within:text-[#2874f0]">Mobile Number</label>}
              <input 
                type="text" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={!editMobile}
                className={`w-full text-sm font-medium outline-none transition-colors ${
                  editMobile 
                    ? 'px-4 py-3 border border-gray-300 rounded-sm focus:border-[#2874f0] bg-white' 
                    : 'px-4 py-3 bg-gray-50/80 border-transparent text-gray-600 rounded-sm'
                }`}
                placeholder={!editMobile ? "+91 XXXXXXXXXX" : ""}
              />
            </div>
            {editMobile && (
              <button type="submit" disabled={savingMobile} className="w-full sm:w-auto bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                {savingMobile ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* FAQs and Deactivate Links (Flipkart Style Footer) */}
      <div className="mt-auto border-t border-gray-100 flex flex-col divide-y divide-gray-100 bg-white">
        <a href="#" className="px-4 py-5 lg:p-6 text-[15px] font-bold text-gray-900 hover:text-[#2874f0] transition-colors flex items-center justify-between">
          FAQs
        </a>
        <a href="#" className="px-4 py-5 lg:p-6 text-[15px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center justify-between">
          Deactivate Account
        </a>
      </div>
    </div>
  );
};

export default ProfilePage;
