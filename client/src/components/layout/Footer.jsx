import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, Mail, MapPin, ShieldCheck, Truck, Headphones } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#172337] dark:bg-gray-950 text-white font-sans">

    {/* Trust Badges */}
    <div className="border-b border-white/10">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Truck size={22} />, title: '100% Original', desc: 'Guarantee for all products' },
          { icon: <ShieldCheck size={22} />, title: 'Secure Payment', desc: 'QR based safe checkout' },
          { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Dedicated customer care' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="text-[#ffe500] shrink-0">{item.icon}</div>
            <div>
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main Footer */}
    <div className="max-w-[1248px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
      {/* Brand Info */}
      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-xl font-black italic text-white mb-2 tracking-tight">ZEN-G WEAR</h2>
        <p className="text-xs text-gray-400 leading-relaxed mb-4 max-w-sm">
          Premium apparel for the modern lifestyle. Crafted with quality, delivered with care across India.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#2874f0]" />
            <a href="mailto:support@zengwear.com" className="hover:text-white transition-colors">support@zengwear.com</a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#2874f0]" />
            <span>New Delhi, India - 110001</span>
          </div>
        </div>
        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {[
            { icon: <Instagram size={18} />, href: 'https://instagram.com' },
            { icon: <Facebook size={18} />, href: 'https://facebook.com' },
            { icon: <Youtube size={18} />, href: 'https://youtube.com' },
            { icon: <Twitter size={18} />, href: 'https://twitter.com' },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/10 hover:bg-[#2874f0] rounded-full flex items-center justify-center text-white transition-colors">
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Payment Methods Strip */}
    <div className="border-t border-white/10">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Zen-G Wear. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">We accept:</span>
          {['UPI', 'QR Pay', 'Net Banking'].map((pm) => (
            <span key={pm} className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded-sm">
              {pm}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
