import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import { DownloadIcon, TrashIcon, ImageIcon, CopyIcon, StarIcon } from '../../components/icons';
import { useFavorites } from '../../hooks/useFavorites';
import Button from '../../components/common/Button';

const HistoryPage: React.FC = () => {
  const { state, dispatch } = useGlobalState();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const { favoriteIds, toggleFavorite } = useFavorites(state.currentUser?.id);

  const userImages = state.imageHistory.filter(img => img.userId === state.currentUser?.id);

  const filteredImages = userImages.filter(image => {
    if (filter === 'favorites') {
      return favoriteIds.has(image.id);
    }
    return true;
  });

  const deleteImage = (id: string) => {
    dispatch({ type: 'DELETE_IMAGE_FROM_HISTORY', payload: { imageId: id } });
    toast.success('Image deleted from history.');
  };

  const downloadImage = (src: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${prompt.slice(0, 30).replace(/\s/g, '_')}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPrompt = (promptToCopy: string) => {
    navigator.clipboard.writeText(promptToCopy)
      .then(() => toast.success('Prompt copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy prompt.');
      });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Image History</h1>
      <p className="text-gray-400 mb-8">Browse, download, or delete your previously generated images.</p>
      
      <div className="flex space-x-2 mb-8">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All Images
        </Button>
        <Button
          variant={filter === 'favorites' ? 'primary' : 'secondary'}
          onClick={() => setFilter('favorites')}
        >
          Favorites
        </Button>
      </div>
      
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map(image => {
            const isFavorite = favoriteIds.has(image.id);
            return (
              <div key={image.id} className="group relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900 flex flex-col">
                <div className="relative aspect-square">
                  <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => toggleFavorite(image.id)} className={`p-2 bg-black/60 rounded-full text-white hover:bg-yellow-500 hover:text-white transition-colors ${isFavorite ? 'text-yellow-400' : ''}`} title={isFavorite ? 'Unfavorite' : 'Favorite'}>
                          <StarIcon className="w-5 h-5" isFilled={isFavorite} />
                      </button>
                      <button onClick={() => copyPrompt(image.prompt)} className="p-2 bg-black/60 rounded-full text-white hover:bg-primary-600 transition-colors" title="Copy Prompt">
                          <CopyIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => downloadImage(image.src, image.prompt)} className="p-2 bg-black/60 rounded-full text-white hover:bg-primary-600 transition-colors" title="Download">
                          <DownloadIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteImage(image.id)} className="p-2 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors" title="Delete">
                          <TrashIcon className="w-5 h-5" />
                      </button>
                  </div>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-200 line-clamp-2" title={image.prompt}>{image.prompt}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(image.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 px-6 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-600"/>
            <h3 className="mt-6 text-xl font-medium text-gray-300">
              {filter === 'favorites' ? 'No Favorites Yet' : 'No History Yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === 'favorites'
                ? 'Click the star icon on an image to add it to your favorites.'
                : 'Start creating images to build your personal gallery.'}
            </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;