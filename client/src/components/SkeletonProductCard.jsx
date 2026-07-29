import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="group flex flex-col relative bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 h-[380px] animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-gray-200 w-full overflow-hidden">
        {/* Wishlist Button Skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/50 backdrop-blur z-10"></div>
      </div>

      {/* Info Skeleton */}
      <div className="pt-4 px-3 pb-4 flex flex-col gap-2 flex-grow bg-white">
        <div className="flex flex-col gap-1.5">
          {/* Brand Skeleton */}
          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          {/* Title Skeleton */}
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          
          {/* Ratings Skeleton */}
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 w-10 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex gap-2 items-center">
            {/* Price Skeleton */}
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-10 bg-gray-200 rounded"></div>
          </div>
          {/* Cart Icon Skeleton */}
          <div className="h-8 w-8 rounded-full bg-gray-200 lg:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
