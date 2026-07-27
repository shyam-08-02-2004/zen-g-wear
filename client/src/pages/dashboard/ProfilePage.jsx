import { useState } from 'react';
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
  const [gender, setGender] = useState('Male'); // Mock gender for UI
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(userInfo?.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  const [editMobile, setEditMobile] = useState(false);
  const [mobile, setMobile] = useState('+91 9876543210'); // Mock mobile for UI

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
      const res = await authService.updateDetails({ name: userInfo?.name, email });
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

  return (
    <div className="bg-white rounded-sm shadow-sm font-sans flex flex-col p-6 lg:p-8 min-h-[500px]">
      
      {/* Personal Information */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
          {!editPersonal && (
            <button onClick={() => setEditPersonal(true)} className="text-[#2874f0] text-sm font-bold hover:underline">
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handlePersonalSubmit} className="max-w-md">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editPersonal}
                className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors ${
                  editPersonal ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
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
                  editPersonal ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
                }`}
                placeholder="Last Name"
              />
            </div>
          </div>
          
          <div className="mt-6 mb-6">
            <label className="block text-sm text-gray-500 mb-3">Your Gender</label>
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
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={savingPersonal}
                className="bg-[#2874f0] text-white px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingPersonal ? 'SAVING...' : 'SAVE'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setFirstName(initialFirstName);
                  setLastName(initialLastName);
                  setEditPersonal(false);
                }}
                className="text-[#2874f0] px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Email Address */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Email Address</h2>
          {!editEmail && (
            <button onClick={() => setEditEmail(true)} className="text-[#2874f0] text-sm font-bold hover:underline">
              Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleEmailSubmit} className="max-w-md">
          <div className="mb-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editEmail}
              className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors ${
                editEmail ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>
          
          {editEmail && (
            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={savingEmail}
                className="bg-[#2874f0] text-white px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingEmail ? 'SAVING...' : 'SAVE'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setEmail(userInfo?.email);
                  setEditEmail(false);
                }}
                className="text-[#2874f0] px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Mobile Number */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Mobile Number</h2>
          {!editMobile && (
            <button onClick={() => setEditMobile(true)} className="text-[#2874f0] text-sm font-bold hover:underline">
              Edit
            </button>
          )}
        </div>
        
        <div className="max-w-md">
          <div className="mb-4">
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={!editMobile}
              className={`w-full px-4 py-3 text-sm font-medium border rounded-sm outline-none transition-colors ${
                editMobile ? 'bg-white border-gray-300 focus:border-[#2874f0]' : 'bg-gray-100 border-transparent text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>
          
          {editMobile && (
            <div className="flex gap-4">
              <button 
                onClick={() => setEditMobile(false)}
                className="bg-[#2874f0] text-white px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm"
              >
                SAVE
              </button>
              <button 
                onClick={() => {
                  setMobile('+91 9876543210');
                  setEditMobile(false);
                }}
                className="text-[#2874f0] px-8 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-auto pt-10">
        <h3 className="text-sm font-bold text-gray-900 mb-6">FAQs</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 mb-2">What happens when I update my email address (or mobile number)?</h4>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).
            </p>
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 mb-2">When will my Flipkart account be updated with the new email address (or mobile number)?</h4>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
            </p>
          </div>
          
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 mb-2">What happens to my existing Flipkart account when I update my email address (or mobile number)?</h4>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.
            </p>
          </div>
        </div>
        
        <div className="mt-10">
          <button className="text-[#2874f0] text-sm font-bold hover:underline mr-8">Deactivate Account</button>
          <button className="text-[#2874f0] text-sm font-bold hover:underline">Delete Account</button>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
