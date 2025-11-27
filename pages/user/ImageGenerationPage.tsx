import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import { generateImage } from '../../services/geminiService';
import Button from '../../components/common/Button';
import { DownloadIcon, SparklesIcon, TrashIcon, ImageIcon, CopyIcon, StarIcon } from '../../components/icons';
import { useFavorites } from '../../hooks/useFavorites';

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const SkeletalLoader: React.FC = () => (
    <div className="aspect-square bg-gray-800 rounded-lg animate-pulse"></div>
);

const ImageGenerationPage: React.FC = () => {
  const { state, dispatch } = useGlobalState();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorites(state.currentUser?.id);
  
  const userImages = state.imageHistory.filter(img => img.userId === state.currentUser?.id);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt.');
      return;
    }
    if (state.currentUser && state.currentUser.credits < 1) {
      toast.error('You do not have enough credits to generate an image.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Generating your masterpiece...');

    try {
      // In a real app, you might combine prompts on the backend
      const fullPrompt = `${prompt}${negativePrompt ? `. Negative prompt: ${negativePrompt}` : ''}`;
      
      const imageUrl = await generateImage(fullPrompt, aspectRatio);
      
      if (state.currentUser) {
        dispatch({
          type: 'ADD_IMAGE_TO_HISTORY',
          payload: {
            id: new Date().toISOString(),
            userId: state.currentUser.id,
            src: imageUrl,
            prompt: prompt,
            createdAt: new Date().toISOString(),
          }
        });
        dispatch({ type: 'DEDUCT_CREDITS', payload: { userId: state.currentUser.id, amount: 1 } });
      }
      
      toast.success('Image generated successfully!', { id: toastId });
      setPrompt('');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = (id: string) => {
    dispatch({ type: 'DELETE_IMAGE_FROM_HISTORY', payload: { imageId: id } });
    toast.success('Image removed from history.');
  };

  const downloadImage = (src: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${prompt.slice(0, 30).replace(/\s/g, '_')}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <h1 className="text-3xl font-bold text-white">Image Generation</h1>
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Prompt</label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="A vibrant synthwave cityscape at sunset..."
                className="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300 mb-1">Negative Prompt (Optional)</label>
              <textarea
                id="negative-prompt"
                rows={2}
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
                placeholder="blurry, low quality, text"
                className="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
              />
            </div>
            
            <div>
              <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
              <select
                id="aspect-ratio"
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
              >
                <option value="1:1">Square (1:1)</option>
                <option value="16:9">Landscape (16:9)</option>
                <option value="9:16">Portrait (9:16)</option>
                <option value="4:3">Standard (4:3)</option>
                <option value="3:4">Tall (3:4)</option>
              </select>
            </div>
          </div>
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading} className="w-full !py-3">
              <SparklesIcon className="w-5 h-5 mr-2"/>
              Generate (1 Credit)
          </Button>
        </div>

        {/* Gallery Column */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Generations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading && <SkeletalLoader />}
            {userImages.slice(0, 6).map(image => {
              const isFavorite = favoriteIds.has(image.id);
              return (
              <div key={image.id} className="group relative rounded-lg overflow-hidden">
                <img src={image.src} alt={image.prompt} className="w-full h-full object-cover aspect-square" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-between p-4">
                   <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFavorite(image.id)} className={`p-2 bg-black/50 rounded-full text-white hover:bg-yellow-500 hover:text-white transition-colors ${isFavorite ? 'text-yellow-400' : ''}`} title={isFavorite ? 'Unfavorite' : 'Favorite'}><StarIcon className="w-5 h-5" isFilled={isFavorite} /></button>
                        <button onClick={() => copyPrompt(image.prompt)} className="p-2 bg-black/50 rounded-full text-white hover:bg-primary-600 transition-colors" title="Copy Prompt"><CopyIcon className="w-5 h-5" /></button>
                        <button onClick={() => downloadImage(image.src, image.prompt)} className="p-2 bg-black/50 rounded-full text-white hover:bg-primary-600 transition-colors" title="Download"><DownloadIcon className="w-5 h-5" /></button>
                        <button onClick={() => deleteImage(image.id)} className="p-2 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors" title="Delete"><TrashIcon className="w-5 h-5" /></button>
                   </div>
                   <p className="text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">{image.prompt}</p>
                </div>
              </div>
            )})}
             {!isLoading && userImages.length === 0 && (
                <div className="col-span-full text-center py-16 px-6 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-500"/>
                    <h3 className="mt-4 text-lg font-medium text-gray-300">Your generated images will appear here.</h3>
                    <p className="mt-1 text-sm text-gray-500">Let's create something amazing!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationPage;