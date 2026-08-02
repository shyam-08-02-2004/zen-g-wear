import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Set to midnight of the current day
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      
      const difference = midnight.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format to always show two digits
  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div className={`flex items-center gap-1 bg-red-600/95 backdrop-blur-sm text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-sm shadow-sm ${className}`}>
      <Timer size={10} className="sm:w-3 sm:h-3 animate-pulse" />
      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">Ends In</span>
      <span className="text-[10px] sm:text-xs font-black tracking-wider ml-0.5 sm:ml-1">
        {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;
