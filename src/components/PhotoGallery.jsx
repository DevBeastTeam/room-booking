import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Eye, Sparkles, Calendar, Phone } from 'lucide-react';

export const PHOTO_GALLERY_IMAGES = [
  {
    id: 1,
    title: 'Modern Kitchen & Black Appliances',
    description: 'A kitchen with white cabinets and black appliances.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/16-web-or-mls-unit 1701-010.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/16-web-or-mls-unit%201701-010.jpg',
    category: 'Interiors',
  },
  {
    id: 2,
    title: 'Kitchen Refrigerator & Stove',
    description: 'A black refrigerator stands next to a stove in a kitchen with white cabinets.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/17-web-or-mls-unit 1701-011.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/17-web-or-mls-unit%201701-011.jpg',
    category: 'Interiors',
  },
  {
    id: 3,
    title: 'Dishwasher & White Cabinetry',
    description: 'A kitchen with white cabinets and a black dishwasher.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/18-web-or-mls-unit 1701-012.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/18-web-or-mls-unit%201701-012.jpg',
    category: 'Interiors',
  },
  {
    id: 4,
    title: 'Spacious Living Room',
    description: 'A spacious room with a wooden floor and a ceiling fan.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/8-web-or-mls-unit 1701-006.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/8-web-or-mls-unit%201701-006.jpg',
    category: 'Interiors',
  },
  {
    id: 5,
    title: 'Hardwood-Style Flooring',
    description: 'A room with wooden flooring and white walls.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4-web-or-mls-unit 1701-004.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/4-web-or-mls-unit%201701-004.jpg',
    category: 'Interiors',
  },
  {
    id: 6,
    title: 'Bedroom with Scenic Window View',
    description: 'A room with a window showing a view of a building and a green post.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/22-web-or-mls-unit 1701-016.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/22-web-or-mls-unit%201701-016.jpg',
    category: 'Interiors',
  },
  {
    id: 7,
    title: 'Bright Natural Light Bedroom',
    description: 'A room with a window and a ceiling light.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/24-web-or-mls-unit 1701-018.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/24-web-or-mls-unit%201701-018.jpg',
    category: 'Interiors',
  },
  {
    id: 8,
    title: 'Carpeted Bedroom & Doorway',
    description: 'A room with a carpeted floor and a white door.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/25-web-or-mls-unit 1701-019.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/25-web-or-mls-unit%201701-019.jpg',
    category: 'Interiors',
  },
  {
    id: 9,
    title: 'Bathroom Vanity & Mirror',
    description: 'A white bathroom with a toilet, sink, and mirror.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/31-web-or-mls-unit 1701-023(1).jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/31-web-or-mls-unit%201701-023(1).jpg',
    category: 'Interiors',
  },
  {
    id: 10,
    title: 'Modern Bathroom & Fixtures',
    description: 'A white bathroom with a sink, toilet, and mirror.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/30-web-or-mls-unit 1701-022.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/30-web-or-mls-unit%201701-022.jpg',
    category: 'Interiors',
  },
  {
    id: 11,
    title: 'White Tiled Bath & Shower',
    description: 'A white tiled shower with a shower head and a faucet.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/32-web-or-mls-unit 1701-024.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/32-web-or-mls-unit%201701-024.jpg',
    category: 'Interiors',
  },
  {
    id: 12,
    title: 'Bedroom with Park View Window',
    description: 'A room with a window showing a view of a street with cars and trees.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/20-web-or-mls-unit 1701-014.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/20-web-or-mls-unit%201701-014.jpg',
    category: 'Interiors',
  },
  {
    id: 13,
    title: 'Interior Entry & Hallway',
    description: 'A white room with a carpeted floor and a doorway leading to another room.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/21-web-or-mls-unit 1701-015.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/21-web-or-mls-unit%201701-015.jpg',
    category: 'Interiors',
  },
  {
    id: 14,
    title: 'Walk-In Closet with Storage Shelf',
    description: 'A white closet with a shelf and a carpeted floor.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/33-web-or-mls-unit 1701-025.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/33-web-or-mls-unit%201701-025.jpg',
    category: 'Interiors',
  },
  {
    id: 15,
    title: 'Business Center Conference Room',
    description: 'A conference room with a long table and chairs.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/55-web-or-mls-campus dr-2104-901.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/55-web-or-mls-campus%20dr-2104-901.jpg',
    category: 'Amenities',
  },
  {
    id: 16,
    title: 'Resident Tech Lounge',
    description: 'A conference room with computers, executive seating and work tables.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/56-web-or-mls-campus dr-2104-902.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/56-web-or-mls-campus%20dr-2104-902.jpg',
    category: 'Amenities',
  },
  {
    id: 17,
    title: 'Cardio Fitness Center',
    description: 'A state-of-the-art gym with treadmills and exercise equipment.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/58-web-or-mls-campus dr-2104-904.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/58-web-or-mls-campus%20dr-2104-904.jpg',
    category: 'Amenities',
  },
  {
    id: 18,
    title: 'Fitness Studio Equipment',
    description: 'Gym workout space with modern stationary bikes and fitness gear.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/57-web-or-mls-campus dr-2104-903.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08,g_auto/s3/2/58193/57-web-or-mls-campus%20dr-2104-903.jpg',
    category: 'Amenities',
  },
  {
    id: 19,
    title: 'On-Site Laundry Facility',
    description: 'On-site laundry facility at Monarch Pass apartments Fort Worth TX.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-9.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-9.jpg',
    category: 'Amenities',
  },
  {
    id: 20,
    title: 'Modern Washers & Dryers',
    description: 'Convenient laundry facility with modern front-loading washers.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-8.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-8.jpg',
    category: 'Amenities',
  },
  {
    id: 21,
    title: 'Community Splash Pad',
    description: 'Splash pads at Monarch Pass in Fort Worth, Texas, near South Fort Worth.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-16.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-16.jpg',
    category: 'Community',
  },
  {
    id: 22,
    title: 'Water Play Area',
    description: 'Water play area at Monarch Pass in Fort Worth, Texas, near South Fort Worth.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-13.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-13.jpg',
    category: 'Community',
  },
  {
    id: 23,
    title: 'Outdoor Water Features',
    description: 'Outdoor splash pads with water features at Monarch Pass in Fort Worth, Texas.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-11.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-11.jpg',
    category: 'Community',
  },
  {
    id: 24,
    title: 'Children Playground & Slides',
    description: 'A playground with a blue slide and a yellow slide.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/60-web-or-mls-campus dr-2104-906.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/60-web-or-mls-campus%20dr-2104-906.jpg',
    category: 'Community',
  },
  {
    id: 25,
    title: 'Outdoor Picnic Area',
    description: 'Outdoor picnic area at Monarch Pass in Fort Worth, Texas, near South Fort Worth.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-17.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/4500-campus-dr-fort-worth-tx-76119-mls-17.jpg',
    category: 'Community',
  },
  {
    id: 26,
    title: 'Lighted Tennis Pavilion Court',
    description: 'Outdoor lighted tennis pavilion at Monarch Pass in Fort Worth, Texas.',
    src: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/58193/p0892327_03_photogallery.jpg',
    thumb: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_lfill,w_600,ar_1.08/s3/2/58193/p0892327_03_photogallery.jpg',
    category: 'Community',
  },
];

export default function PhotoGallery({ onOpenTourModal }) {
  const handleTourModal = onOpenTourModal || (() => { window.dispatchEvent(new CustomEvent('open-schedule-tour')); });
  const [currentPage, setCurrentPage] = useState(0); // 0, 1, 2, 3
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null); // index in filtered list

  const IMAGES_PER_PAGE = 8; // 2 rows x 4 columns = 8 images per slide

  const filteredImages = activeCategory === 'All'
    ? PHOTO_GALLERY_IMAGES
    : PHOTO_GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  // If page is out of bounds after category change
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const pageImages = filteredImages.slice(
    safePage * IMAGES_PER_PAGE,
    (safePage + 1) * IMAGES_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Intro Description */}
      <div
        style={{
          color: '#b5a999',
          fontSize: '0.98rem',
          lineHeight: 1.7,
          textAlign: 'center',
          maxWidth: '960px',
          margin: '0 auto 2.5rem',
          padding: '0 1rem',
        }}
      >
        Browse through our curated photo gallery showcasing apartment interiors, chef kitchens, community grounds, and our signature splash park in Fort Worth, TX. Living is refined and effortless at Monarch Pass.
      </div>

      {/* Category Pills & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        {['All', 'Interiors', 'Amenities', 'Community'].map((cat) => {
          const count = cat === 'All' ? PHOTO_GALLERY_IMAGES.length : PHOTO_GALLERY_IMAGES.filter((i) => i.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(0);
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '30px',
                border: isActive ? '1px solid #c9a96e' : '1px solid rgba(201, 169, 110, 0.25)',
                backgroundColor: isActive ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#dfc285' : '#8c8273',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: isActive ? '0 4px 15px rgba(201, 169, 110, 0.25)' : 'none',
              }}
            >
              <span>{cat}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(201, 169, 110, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#6b6357',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tiled Carousel Container with Left/Right Navigation Arrows */}
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Left Arrow Button */}
        <button
          onClick={handlePrevPage}
          aria-label="Previous photos"
          style={{
            position: 'absolute',
            left: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'rgba(12, 16, 28, 0.92)',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
            color: '#dfc285',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = '#c9a96e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(12, 16, 28, 0.92)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNextPage}
          aria-label="Next photos"
          style={{
            position: 'absolute',
            right: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'rgba(12, 16, 28, 0.92)',
            border: '1px solid rgba(201, 169, 110, 0.35)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
            color: '#dfc285',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.25)';
            e.currentTarget.style.borderColor = '#c9a96e';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(12, 16, 28, 0.92)';
            e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.35)';
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* 2 Rows x 4 Columns Photo Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
          className="photo-gallery-grid"
        >
          {pageImages.map((image, indexOnPage) => {
            const overallIndex = safePage * IMAGES_PER_PAGE + indexOnPage;
            return (
              <div
                key={image.id}
                onClick={() => setLightboxIndex(overallIndex)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 0.85',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#f1f5f9',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
                className="gallery-card group"
              >
                <img
                  src={image.thumb}
                  alt={image.description}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.35s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Corner counter indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.72)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    backdropFilter: 'blur(3px)',
                  }}
                >
                  {image.id} of {PHOTO_GALLERY_IMAGES.length}
                </div>

                {/* Subtle Hover overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    opacity: 0,
                    transition: 'opacity 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f766e',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    }}
                  >
                    <ZoomIn size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots (matching screenshot) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '2rem',
        }}
      >
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            aria-label={`Go to photo gallery page ${idx + 1}`}
            style={{
              width: safePage === idx ? '26px' : '10px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: safePage === idx ? '#1e293b' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>

      {/* Bottom Call to Action Tour Box */}
      <div
        style={{
          maxWidth: '960px',
          margin: '3rem auto 0',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            Want to see Monarch Pass Apartments in person?
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            Schedule a personalized guided walkthrough or virtual tour with our friendly leasing staff!
          </p>
        </div>
        <button
          onClick={handleTourModal}
          style={{
            padding: '0.65rem 1.4rem',
            backgroundColor: '#0f766e',
            color: '#ffffff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.3)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0d6460')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f766e')}
        >
          <Calendar size={16} />
          <span>Schedule an In-Person Tour</span>
        </button>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo preview"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(8px)',
          }}
          onClick={closeLightbox}
        >
          {/* Lightbox Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                {filteredImages[lightboxIndex].title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Photo {lightboxIndex + 1} of {filteredImages.length} · {filteredImages[lightboxIndex].category}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleTourModal}
                style={{
                  padding: '0.45rem 1rem',
                  backgroundColor: '#0f766e',
                  color: '#ffffff',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Schedule Tour
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image View */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Prev Image Button */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))
              }
              aria-label="Previous Image"
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              <ChevronLeft size={30} />
            </button>

            {/* Main High-Res Image */}
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].description}
              style={{
                maxWidth: '90%',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
            />

            {/* Next Image Button */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next Image"
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              <ChevronRight size={30} />
            </button>
          </div>

          {/* Lightbox Bottom Caption */}
          <div
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {filteredImages[lightboxIndex].description}
          </div>
        </div>
      )}
    </div>
  );
}
