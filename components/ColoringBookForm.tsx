
import React, { useState } from 'react';
import { MagicWandIcon } from './icons';

interface ColoringBookFormProps {
  onSubmit: (theme: string, childName: string) => void;
  isLoading: boolean;
}

const ColoringBookForm: React.FC<ColoringBookFormProps> = ({ onSubmit, isLoading }) => {
  const [theme, setTheme] = useState('');
  const [childName, setChildName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim() && childName.trim() && !isLoading) {
      onSubmit(theme, childName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-slate-300 mb-2">
          Child's Name
        </label>
        <input
          type="text"
          id="childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="e.g., Lily"
          required
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-2">
          Coloring Book Theme
        </label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., Space Dinosaurs"
          required
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !theme.trim() || !childName.trim()}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
      >
        <MagicWandIcon />
        {isLoading ? 'Creating...' : 'Generate Book'}
      </button>
    </form>
  );
};

export default ColoringBookForm;
