import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Crosshair, Map as MapIcon } from 'lucide-react';
import api from '../../services/api';
import { notify } from '../../components/ui/Toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and auto-detect
function LocationSelector({ setFormData, setCoordinates, coordinates }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);
      fetchAddress(lat, lng);
    },
  });

  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 15);
    }
  }, [coordinates, map]);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.address) {
        setFormData(prev => ({
          ...prev,
          street: data.display_name || prev.street,
          city: data.address.city || data.address.town || data.address.village || data.address.county || prev.city,
          state: data.address.state || prev.state,
          zipCode: data.address.postcode || prev.zipCode
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return coordinates ? <Marker position={coordinates} /> : null;
}

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Map states
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState([20.5937, 78.9629]); // Default India
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', mobileNumber: '', zipCode: '', street: '', city: '', state: '', country: 'India'
  });

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      notify.error("Geolocation is not supported by your browser");
      return;
    }
    setDetectingLocation(true);
    notify.info("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        setShowMap(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.address) {
            setFormData(prev => ({
              ...prev,
              street: data.display_name || prev.street,
              city: data.address.city || data.address.town || data.address.village || data.address.county || prev.city,
              state: data.address.state || prev.state,
              zipCode: data.address.postcode || prev.zipCode
            }));
            notify.success("Address auto-filled from location!");
          }
        } catch (error) {
          notify.error("Could not fetch address details");
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        notify.error("Location access denied or failed.");
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data.data.addresses || []);
    } catch (err) {
      notify.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users/addresses', formData);
      notify.success('Address added successfully');
      setShowAddForm(false);
      setFormData({ name: '', mobileNumber: '', zipCode: '', street: '', city: '', state: '', country: 'India' });
      fetchAddresses();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      notify.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      notify.error('Failed to delete address');
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-sm font-sans flex flex-col min-h-[500px]">
      <div className="p-4 lg:p-8">
        <h2 className="text-[17px] font-bold text-gray-900 mb-6 hidden lg:block">Manage Addresses</h2>

        {/* Add Address Button / Form */}
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full border border-gray-300 text-[#2874f0] font-bold text-sm px-4 py-4 flex items-center gap-2 hover:bg-blue-50 transition-colors mb-6 rounded-sm"
          >
            <Plus size={18} strokeWidth={3} />
            ADD A NEW ADDRESS
          </button>
        ) : (
          <div className="bg-blue-50/30 border border-gray-200 p-4 lg:p-6 mb-6 rounded-sm">
            <h3 className="text-[#2874f0] font-bold text-sm uppercase tracking-widest mb-4">Add a new address</h3>
            
            <div className="flex gap-2 mb-4">
              <button 
                type="button" onClick={handleAutoDetect} disabled={detectingLocation}
                className="flex items-center gap-1.5 text-white bg-[#2874f0] px-4 py-2 text-xs font-bold rounded-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Crosshair size={14} /> {detectingLocation ? 'Detecting...' : 'Auto-Detect Live Location'}
              </button>
              <button 
                type="button" onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1.5 text-gray-700 bg-white border border-gray-300 px-4 py-2 text-xs font-bold rounded-sm hover:bg-gray-50 transition-colors"
              >
                <MapIcon size={14} /> {showMap ? 'Hide Map' : 'Select on Map'}
              </button>
            </div>
            
            {showMap && (
              <div className="h-48 w-full mb-4 rounded-sm overflow-hidden border border-gray-300 z-0 relative">
                <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector setFormData={setFormData} setCoordinates={setCoordinates} coordinates={coordinates} />
                </MapContainer>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required type="text" placeholder="Name" className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="tel" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Must be exactly 10 digits" placeholder="10-digit mobile number" className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value.replace(/\D/g, '').substring(0, 10)})} />
              <input required type="text" placeholder="Pincode" className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
              <input required type="text" placeholder="Locality / Town" className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              <textarea required placeholder="Address (Area and Street)" rows="3" className="w-full sm:col-span-2 px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})}></textarea>
              <input required type="text" placeholder="State" className="w-full px-4 py-3 border border-gray-300 rounded-sm outline-none focus:border-[#2874f0] text-sm" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              
              <div className="sm:col-span-2 flex gap-4 mt-2">
                <button type="submit" disabled={saving} className="bg-[#2874f0] text-white font-bold text-sm px-8 py-3 rounded-sm shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50">
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-[#2874f0] font-bold text-sm px-6 py-3 hover:bg-blue-50 transition-colors rounded-sm">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved Addresses List */}
        {loading ? (
          <div className="text-sm text-gray-500">Loading addresses...</div>
        ) : (
          <div className="space-y-4">
            {addresses.length === 0 && !showAddForm && (
              <div className="text-sm text-gray-500 text-center py-8">No saved addresses found.</div>
            )}
            {addresses.map((address) => (
              <div key={address._id} className="border border-gray-200 rounded-sm p-4 relative group hover:shadow-sm transition-shadow">
                
                {/* 3 Dot Menu Mock */}
                <div className="absolute right-4 top-4 text-gray-400 cursor-pointer lg:invisible group-hover:visible transition-all">
                  <MoreVertical size={20} />
                  <div className="hidden group-hover:flex absolute right-0 top-full bg-white shadow-md border border-gray-100 flex-col py-1 z-10 w-24 rounded-sm mt-1">
                    <button onClick={() => handleDelete(address._id)} className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">Delete</button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 uppercase rounded-sm tracking-widest">
                    HOME
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-bold text-sm text-black">{address.name}</span>
                  <span className="font-bold text-sm text-black">{address.mobileNumber}</span>
                </div>
                <p className="text-sm text-gray-600 w-full lg:w-3/4 leading-relaxed">
                  {address.street}, {address.city}, {address.state} - <span className="font-bold">{address.zipCode}</span>
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AddressesPage;
