import React from 'react';

const ProductBadges = ({ product, className = "" }) => {
  if (!product) return null;

  const { isBestSeller, isTrending, isNewArrival, isFeatured, stock, isActive } = product;
  const badges = [];

  if (isActive === false) {
    badges.push({ text: 'DRAFT', bg: 'bg-gray-800', textCol: 'text-white' });
  }

  if (stock === 0) {
    badges.push({ text: 'OUT OF STOCK', bg: 'bg-white/90 text-red-500 border border-red-200 backdrop-blur-sm', textCol: '' });
  } else if (stock > 0 && stock <= 10) {
    badges.push({ text: `ONLY ${stock} LEFT`, bg: 'bg-white/90 text-orange-500 border border-orange-200 backdrop-blur-sm', textCol: '' });
  }

  if (isBestSeller) {
    badges.push({ text: 'Bestseller', bg: 'bg-[#ff9f00]', textCol: 'text-white' });
  }
  
  if (isTrending) {
    badges.push({ text: 'Trending', bg: 'bg-[#ff6161]', textCol: 'text-white' });
  }
  
  if (isNewArrival) {
    badges.push({ text: 'New', bg: 'bg-[#388e3c]', textCol: 'text-white' });
  }
  
  if (isFeatured && !isBestSeller && !isTrending) {
    badges.push({ text: 'Featured', bg: 'bg-[#2874f0]', textCol: 'text-white' });
  }

  if (badges.length === 0) return null;

  return (
    <div className={`absolute top-0 left-0 flex flex-col items-start gap-1 pointer-events-none z-10 ${className}`}>
      {badges.map((badge, idx) => (
        <span 
          key={idx} 
          className={`${badge.bg} ${badge.textCol || ''} text-[9px] sm:text-[10px] font-bold px-2 py-0.5 shadow-sm uppercase tracking-wide rounded-br-md`}
        >
          {badge.text}
        </span>
      ))}
    </div>
  );
};

export default ProductBadges;
