import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

const categories = [
  { 
    name: 'Top Offers', 
    link: '/shop?offers=true', 
    image: '/assets/nav_top_offers_new.jpg', 
    dropdown: null,
    imageDropdown: null
  },
  { 
    name: 'Men', 
    link: '/shop?category=men', 
    image: '/assets/nav_men.jpg',
    imageDropdown: null,
    dropdown: [
      {
        title: 'Topwear',
        items: [
          { label: 'T-Shirts', to: '/shop?category=men&subcategory=tshirt' },
          { label: 'Casual Shirts', to: '/shop?category=men&subcategory=shirt' },
          { label: 'Formal Shirts', to: '/shop?category=men&subcategory=shirt' },
          { label: 'Sweatshirts', to: '/shop?category=men&subcategory=sweatshirt' },
          { label: 'Jackets', to: '/shop?category=men&subcategory=jacket' }
        ]
      },
      {
        title: 'Bottomwear',
        items: [
          { label: 'Jeans', to: '/shop?category=men&subcategory=jeans' },
          { label: 'Casual Trousers', to: '/shop?category=men&subcategory=trousers' },
          { label: 'Formal Trousers', to: '/shop?category=men&subcategory=trousers' },
          { label: 'Track Pants', to: '/shop?category=men&subcategory=trackpants' },
          { label: 'Shorts', to: '/shop?category=men&subcategory=shorts' }
        ]
      },
      {
        title: 'Footwear & Accessories',
        items: [
          { label: 'Sports Shoes', to: '/shop?category=men&subcategory=sportsshoes' },
          { label: 'Casual Shoes', to: '/shop?category=men&subcategory=casualshoes' },
          { label: 'Watches', to: '/shop?category=men&subcategory=watches' },
          { label: 'Wallets', to: '/shop?category=men&subcategory=wallet' },
          { label: 'Belts', to: '/shop?category=men&subcategory=belt' }
        ]
      }
    ]
  },
  { 
    name: 'Women', 
    link: '/shop?category=women', 
    image: '/assets/nav_women.jpg',
    imageDropdown: [
      { label: 'Skirts', to: '/shop?category=women&subcategory=skirt', image: '/assets/women_skirts_new.jpg' },
      { label: 'Leggings', to: '/shop?category=women&subcategory=leggings', image: '/assets/women_leggings_new.jpg' },
      { label: 'Lehengas', to: '/shop?category=women&subcategory=lehenga', image: '/assets/women_lehenga.jpg' },
      { label: 'Sarees', to: '/shop?category=women&subcategory=saree', image: '/assets/women_saree.jpg' },
    ],
    dropdown: [
      {
        title: 'Western Wear',
        items: [
          { label: 'Dresses', to: '/shop?category=women&subcategory=dress' },
          { label: 'Tops', to: '/shop?category=women&subcategory=top' },
          { label: 'T-Shirts', to: '/shop?category=women&subcategory=tshirt' },
          { label: 'Jeans', to: '/shop?category=women&subcategory=jeans' },
          { label: 'Trousers', to: '/shop?category=women&subcategory=trousers' }
        ]
      },
      {
        title: 'Ethnic Wear',
        items: [
          { label: 'Sarees', to: '/shop?category=women&subcategory=saree' },
          { label: 'Kurtas & Kurtis', to: '/shop?category=women&subcategory=kurti' },
          { label: 'Lehengas', to: '/shop?category=women&subcategory=lehenga' },
          { label: 'Ethnic Dresses', to: '/shop?category=women&subcategory=ethnicwear' }
        ]
      },
      {
        title: 'Footwear & Accessories',
        items: [
          { label: 'Heels', to: '/shop?category=women&subcategory=heels' },
          { label: 'Flats & Sandals', to: '/shop?category=women&subcategory=flats' },
          { label: 'Handbags', to: '/shop?category=women&subcategory=handbag' },
          { label: 'Jewellery', to: '/shop?category=women&subcategory=jewellery' },
          { label: 'Watches', to: '/shop?category=women&subcategory=watches' }
        ]
      }
    ]
  },
  { 
    name: 'Kids', 
    link: '/shop?category=kids', 
    image: '/assets/nav_kids.jpg',
    imageDropdown: null,
    dropdown: [
      {
        title: 'Boys Clothing',
        items: [
          { label: 'T-Shirts', to: '/shop?category=kids&subcategory=tshirt' },
          { label: 'Shirts', to: '/shop?category=kids&subcategory=shirt' },
          { label: 'Jeans', to: '/shop?category=kids&subcategory=jeans' },
          { label: 'Shorts', to: '/shop?category=kids&subcategory=shorts' }
        ]
      },
      {
        title: 'Girls Clothing',
        items: [
          { label: 'Dresses', to: '/shop?category=kids&subcategory=dress' },
          { label: 'Tops', to: '/shop?category=kids&subcategory=top' },
          { label: 'T-Shirts', to: '/shop?category=kids&subcategory=tshirt' },
          { label: 'Jeans', to: '/shop?category=kids&subcategory=jeans' }
        ]
      }
    ]
  }
];

const CategoryNav = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <div className="w-full bg-white shadow-sm mt-2 relative z-30">
        <div className="max-w-[1248px] mx-auto px-2 py-2 sm:py-3 sm:px-4">
          <div className="flex items-center justify-around sm:justify-center gap-2 sm:gap-12 md:gap-24 lg:gap-32 overflow-x-auto hide-scrollbar snap-x">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="relative group flex-1 sm:flex-none min-w-0 sm:min-w-[70px]"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  to={cat.link}
                  className="flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm group-hover:shadow-lg transition-all border-2 border-transparent group-hover:border-[#2874f0]">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                      fetchpriority="high"
                      loading="eager"
                    />
                  </div>
                  <div className="flex items-center gap-0.5 group-hover:-translate-y-1 transition-transform duration-300">
                    <span className="text-[10px] sm:text-sm font-bold text-gray-800 group-hover:text-[#2874f0] transition-colors whitespace-nowrap">
                      {cat.name}
                    </span>
                    {(cat.dropdown || cat.imageDropdown) && (
                      <ChevronDown size={12} className={`text-gray-500 transition-transform duration-300 hidden sm:block ${hoveredIndex === i ? 'rotate-180 text-[#2874f0]' : ''}`} />
                    )}
                  </div>
                </Link>
                
                {/* Women Image Dropdown - Desktop only */}
                {cat.imageDropdown && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 hidden md:block ${hoveredIndex === i ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-xl border border-gray-100 p-6 cursor-default min-w-max">
                      <div className="flex gap-4 mb-4">
                        {cat.imageDropdown.map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.to}
                            className="flex flex-col items-center gap-2 group/item"
                          >
                            <div className="w-24 h-28 rounded-lg overflow-hidden shadow-sm group-hover/item:shadow-md transition-all border-2 border-transparent group-hover/item:border-[#2874f0]">
                              <img
                                src={item.image}
                                alt={item.label}
                                className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700 group-hover/item:text-[#2874f0] transition-colors whitespace-nowrap">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex gap-12">
                        {cat.dropdown.map((column, colIdx) => (
                          <div key={colIdx} className="flex flex-col min-w-[130px]">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">{column.title}</h3>
                            <div className="flex flex-col gap-1.5">
                              {column.items.map((item, idx2) => (
                                <Link 
                                  key={idx2} 
                                  to={item.to}
                                  className="text-[13px] text-gray-700 hover:text-[#2874f0] hover:font-bold transition-all"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Mega Dropdown - Desktop only */}
                {!cat.imageDropdown && cat.dropdown && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 hidden md:block ${hoveredIndex === i ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-md border border-gray-100 py-6 px-8 flex gap-12 min-w-max cursor-default">
                      {cat.dropdown.map((column, colIdx) => (
                        <div key={colIdx} className="flex flex-col min-w-[150px]">
                          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4">{column.title}</h3>
                          <div className="flex flex-col gap-2">
                            {column.items.map((item, idx) => (
                              <Link 
                                key={idx} 
                                to={item.to}
                                className="text-[14px] text-gray-700 hover:text-[#2874f0] hover:font-bold transition-all"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryNav;
