
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const imageCategories = ['Tout', 'Cérémonie', 'Lauréats', 'Tapis Rouge', 'Ambiance'];

const galleryImages = [
    { id: 1, srcText: 'Victorious music award winner on stage', alt: 'Lauréat du prix musique', category: 'Lauréats' },
    { id: 2, srcText: 'Joyful dance troupe performing on a vibrant stage', alt: 'Troupe de danse en pleine performance', category: 'Cérémonie' },
    { id: 3, srcText: 'Audience applauding enthusiastically at the awards ceremony', alt: 'Public applaudissant', category: 'Ambiance' },
    { id: 4, srcText: 'Fashion designer proudly standing with their winning creation', alt: 'Styliste avec sa création', category: 'Lauréats' },
    { id: 5, srcText: 'Group photo of all 2023 winners holding their trophies', alt: 'Photo de groupe des lauréats 2023', category: 'Lauréats' },
    { id: 6, srcText: 'Elegant close-up of a golden Makona Awards trophy', alt: 'Trophée Makona Awards', category: 'Cérémonie' },
    { id: 7, srcText: 'Social entrepreneur giving an inspiring speech on stage', alt: 'Entrepreneur social', category: 'Cérémonie' },
    { id: 8, srcText: 'Celebrities posing on the red carpet at Makona Awards', alt: 'Tapis rouge des Makona Awards', category: 'Tapis Rouge' },
    { id: 9, srcText: 'DJ playing music at the after-party', alt: 'DJ à l\'after-party', category: 'Ambiance' },
    { id: 10, srcText: 'Winner of the tech innovation award with their project', alt: 'Gagnant du prix de l\'innovation', category: 'Lauréats' },
    { id: 11, srcText: 'Guests networking and laughing during the event', alt: 'Invités en train de réseauter', category: 'Ambiance' },
    { id: 12, srcText: 'A stunning view of the decorated event hall', alt: 'Vue de la salle de cérémonie', category: 'Cérémonie' },
];

const GalleryPage = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedImg, setSelectedImg] = useState(null);

  const filteredImages = selectedCategory === 'Tout'
    ? galleryImages
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Galerie | Makona Awards 2025</title>
        <meta name="description" content="Explorez les moments forts des éditions précédentes des Makona Awards à travers notre galerie photo." />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-12 pt-24"
      >
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
          <Button onClick={() => onNavigate('/')} variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Galerie</h1>
          <p className="text-lg text-gray-400 mb-8">Revivez les moments inoubliables des éditions passées.</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12">
          {imageCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full transition-colors duration-300 ${selectedCategory === category ? 'btn-primary text-slate-900' : 'bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-500/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="card-glass group overflow-hidden cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImg(image)}
              >
                <img
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300" 
                  alt={image.alt}
                 src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              layoutId={selectedImg.id}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img className="w-full h-full object-contain rounded-lg" alt={selectedImg.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-4 -right-4 bg-white/20 hover:bg-white/30 rounded-full"
                onClick={() => setSelectedImg(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
