import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, Mail, MapPin, ShieldCheck, Truck, Headphones } from 'lucide-react';

const Footer = () => (
  <footer className="bg-[#172337] dark:bg-gray-950 text-white font-sans mt-auto">

    {/* Trust Badges - Flipkart Style Compact */}
    <div className="border-b border-gray-700/50">
      <div className="max-w-[1248px] mx-auto px-4 lg:px-8 py-4 lg:py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-4 justify-items-start lg:justify-items-center">
        {[
          { icon: <Truck size={20} className="text-[#ffe500]" />, title: '100% Original', desc: 'Guarantee for all products' },
          { icon: <ShieldCheck size={20} className="text-[#ffe500]" />, title: 'Secure Payment', desc: 'QR based safe checkout' },
          { icon: <Headphones size={20} className="text-[#ffe500]" />, title: '24/7 Support', desc: 'Dedicated customer care' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.icon}
            <div>
              <p className="text-[13px] lg:text-[14px] font-bold text-white mb-0.5">{item.title}</p>
              <p className="text-[11px] lg:text-[12px] text-[#878787]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main Footer */}
    <div className="max-w-[1248px] mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
      
      {/* Brand Info (Left) */}
      <div className="flex-1 max-w-sm">
        <h2 className="text-lg lg:text-xl font-bold italic text-white mb-3 tracking-tight">ZEN-G WEAR</h2>
        <p className="text-[12px] text-[#878787] leading-relaxed mb-4">
          Premium apparel for the modern lifestyle. Crafted with quality, delivered with care across India.
        </p>
        <div className="flex flex-col gap-2 text-[12px] text-[#878787]">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#2874f0] shrink-0" />
            <span>New Delhi, India - 110001</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#2874f0] shrink-0" />
            <a href="mailto:support@zengwear.com" className="hover:text-white transition-colors">support@zengwear.com</a>
          </div>
        </div>
      </div>

      {/* Social Links & Payment (Right) */}
      <div className="flex flex-col items-start lg:items-end gap-6">
        <div>
          <span className="text-[12px] text-[#878787] font-bold uppercase tracking-wider block mb-3 lg:text-right">Keep in touch</span>
          <div className="flex items-center gap-4">
            {[
              { icon: <Instagram size={16} />, href: 'https://instagram.com' },
              { icon: <Facebook size={16} />, href: 'https://facebook.com' },
              { icon: <Youtube size={16} />, href: 'https://youtube.com' },
              { icon: <Twitter size={16} />, href: 'https://twitter.com' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" className="text-[#878787] hover:text-white transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div>
           <span className="text-[12px] text-[#878787] font-bold uppercase tracking-wider block mb-3 lg:text-right">100% Secure Payments</span>
           <div className="flex items-center gap-2">
             {['UPI', 'QR Pay', 'Net Banking'].map((pm) => (
               <span key={pm} className="text-[10px] font-bold text-[#878787] bg-white/5 border border-white/10 px-2 py-1 rounded-sm uppercase">
                 {pm}
               </span>
             ))}
           </div>
        </div>
      </div>
      
    </div>

    {/* Bottom Copyright Strip */}
    <div className="border-t border-gray-700/50 bg-[#121927]">
      <div className="max-w-[1248px] mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#878787]">
        <p>
          &copy; {new Date().getFullYear()} Zen-G Wear. All rights reserved.
        </p>
        <div className="flex items-center gap-4 hidden sm:flex">
          <a href="#" className="hover:text-white transition-colors">Terms Of Use</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
