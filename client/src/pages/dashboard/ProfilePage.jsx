import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../../components/ui/Toast';
import { setCredentials } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import { ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state) => state.auth);

  const initialFirstName = userInfo?.name?.split(' ')[0] || '';
  const initialLastName = userInfo?.name?.split(' ').slice(1).join(' ') || '';

  const [editPersonal, setEditPersonal] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [gender, setGender] = useState('Male'); // Mock gender for UI
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(userInfo?.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  const [editMobile, setEditMobile] = useState(false);
  const [mobile, setMobile] = useState(userInfo?.phone || '+91 9876543210'); 
  const [savingMobile, setSavingMobile] = useState(false);

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
      const updatedUser = res.data.data.user;
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
    <div className="bg-white rounded-sm shadow-sm font-sans flex flex-col lg:min-h-[500px]">
      <div className="p-6 lg:p-8">
        
        {/* Personal Information */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[17px] font-bold text-gray-900">Personal Information</h2>
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
              <div className="flex-1">
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!editPersonal}
                  className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors ${
                    editPersonal ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100/70 border-transparent text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="First Name"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!editPersonal}
                  className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors ${
                    editPersonal ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100/70 border-transparent text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Last Name"
                />
              </div>
            </div>
            
            <div className="mt-4 mb-6">
              <p className="block text-[13px] text-gray-500 mb-3">Your Gender</p>
              <div className="flex gap-8">
                <label className={`flex items-center gap-2 cursor-pointer ${!editPersonal ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Male" 
                    checked={gender === 'Male'} 
                    onChange={() => setGender('Male')} 
                    disabled={!editPersonal}
                    className="w-4 h-4 text-[#2874f0] accent-[#2874f0]" 
                  />
                  <span className="text-sm font-medium text-gray-700">Male</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer ${!editPersonal ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Female" 
                    checked={gender === 'Female'} 
                    onChange={() => setGender('Female')} 
                    disabled={!editPersonal}
                    className="w-4 h-4 text-[#2874f0] accent-[#2874f0]" 
                  />
                  <span className="text-sm font-medium text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {editPersonal && (
              <button 
                type="submit" 
                disabled={savingPersonal}
                className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingPersonal ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>

        {/* Email Address */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[17px] font-bold text-gray-900">Email Address</h2>
            {!editEmail ? (
              <button onClick={() => setEditEmail(true)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Edit
              </button>
            ) : (
              <button onClick={() => setEditEmail(false)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleEmailSubmit} className="max-w-[270px]">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editEmail}
              className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors mb-4 ${
                editEmail ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100/70 border-transparent text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Email Address"
            />
            {editEmail && (
              <button 
                type="submit" 
                disabled={savingEmail}
                className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingEmail ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>

        {/* Mobile Number */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[17px] font-bold text-gray-900">Mobile Number</h2>
            {!editMobile ? (
              <button onClick={() => setEditMobile(true)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Edit
              </button>
            ) : (
              <button onClick={() => setEditMobile(false)} className="text-[#2874f0] text-sm font-bold hover:underline ml-2">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleMobileSubmit} className="max-w-[270px]">
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={!editMobile}
              className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors mb-4 ${
                editMobile ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100/70 border-transparent text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Mobile Number"
            />
            {editMobile && (
              <button 
                type="submit"
                disabled={savingMobile}
                className="bg-[#2874f0] text-white px-8 py-3 rounded-sm font-bold text-[15px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingMobile ? 'SAVING...' : 'SAVE'}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* FAQs and Deactivate Links (Flipkart Style Footer) */}
      <div className="mt-auto border-t border-gray-100 flex flex-col divide-y divide-gray-100">
        <a href="#" className="p-6 text-[15px] font-bold text-gray-900 hover:text-[#2874f0] transition-colors flex items-center justify-between">
          FAQs
        </a>
        <a href="#" className="p-6 text-[15px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center justify-between">
          Deactivate Account
        </a>
      </div>
      
    </div>
  );
};

export default ProfilePage;
