
import React from 'react';

interface ImagePreviewProps {
  cover: string | null;
  pages: string[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const SkeletonLoader: React.FC = () => (
  <div className="aspect-[3/4] bg-slate-700 rounded-lg animate-pulse"></div>
);

const ImagePreview: React.FC<ImagePreviewProps> = ({ cover, pages, isLoading, loadingMessage, error }) => {
  const totalGenerated = (cover ? 1 : 0) + pages.length;
  const placeholders = Array.from({ length: 6 - totalGenerated });

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 text-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cover && <img src={`data:image/png;base64,${cover}`} alt="Cover Page" className="rounded-lg shadow-md w-full aspect-[3/4] object-cover" />}
          {pages.map((page, index) => (
            <img key={index} src={`data:image/png;base64,${page}`} alt={`Page ${index + 1}`} className="rounded-lg shadow-md w-full aspect-[3/4] object-cover" />
          ))}
          {placeholders.map((_, index) => <SkeletonLoader key={index} />)}
        </div>
        <div className="mt-6">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-300 font-semibold">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-2xl text-center">
        <h3 className="text-xl font-bold mb-2">Oh no!</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!cover) {
    return (
      <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 text-center flex items-center justify-center min-h-[300px]">
        <p className="text-slate-400">Your generated coloring book pages will appear here!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Coloring Book is Ready!</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-full sm:col-span-1">
          <h3 className="font-bold text-center mb-2">Cover</h3>
          <img src={`data:image/png;base64,${cover}`} alt="Cover Page" className="rounded-lg shadow-md w-full aspect-[3/4] object-cover" />
        </div>
        {pages.map((page, index) => (
          <div key={index}>
            <h3 className="font-bold text-center mb-2">Page {index + 1}</h3>
            <img src={`data:image/png;base64,${page}`} alt={`Page ${index + 1}`} className="rounded-lg shadow-md w-full aspect-[3/4] object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
