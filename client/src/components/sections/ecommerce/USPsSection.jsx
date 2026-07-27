import { Truck, RefreshCcw, HandCoins, ShieldCheck, HeadphonesIcon } from 'lucide-react';

const usps = [
  {
    title: 'Free Shipping',
    desc: 'On orders above Rs 999',
    icon: <Truck size={24} className="text-ink" />
  },

  {
    title: 'Cash on Delivery',
    desc: 'Available',
    icon: <HandCoins size={24} className="text-ink" />
  },
  {
    title: 'Secure Payments',
    desc: '100% Protected',
    icon: <ShieldCheck size={24} className="text-ink" />
  },
  {
    title: '24/7 Support',
    desc: 'We are here to help',
    icon: <HeadphonesIcon size={24} className="text-ink" />
  }
];

const USPsSection = () => {
  return (
    <div className="w-full bg-white border-b border-mist">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {usps.map((usp, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cloud flex items-center justify-center">
                {usp.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-ink">{usp.title}</h4>
                <p className="text-xs text-ink-soft mt-0.5">{usp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default USPsSection;
