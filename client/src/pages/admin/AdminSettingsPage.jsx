import { useState, useEffect } from 'react';
import { Settings, Save, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    popupEnabled: false,
    popupTitle: '',
    popupMessage: '',
    popupImageUrl: '',
    popupLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
        const data = await res.json();
        if (data?.data?.settings) {
          setSettings(data.data.settings);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-black flex items-center gap-3">
          <Settings className="text-gray-400" size={28} />
          Site Settings
        </h1>
        <p className="text-sm text-gray-500 mt-2">Manage global popup banners and site configuration.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Popup Banner Settings */}
        <section className="bg-gray-50 p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <Megaphone size={20} className="text-black" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-black">Global Popup Banner</h2>
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="popupEnabled" 
                  checked={settings.popupEnabled} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-gray-700">Enable Popup Banner</span>
            </label>

            {settings.popupEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Popup Title</label>
                  <input type="text" name="popupTitle" value={settings.popupTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm" placeholder="e.g. FLASH SALE" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Popup Message</label>
                  <input type="text" name="popupMessage" value={settings.popupMessage} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm" placeholder="e.g. Flat 50% Off on everything!" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                  <input type="url" name="popupImageUrl" value={settings.popupImageUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Button Link</label>
                  <input type="text" name="popupLink" value={settings.popupLink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm" placeholder="/shop" required />
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
