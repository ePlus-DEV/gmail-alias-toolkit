import { useState, useEffect } from 'react';

interface Favorite {
  id: string;
  label: string;
  email: string;
  tag: string;
}

interface FavoritesProps {
  baseEmail: string;
  onCopy: (email: string) => void;
}

export default function Favorites({ baseEmail, onCopy }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const result = await browser.storage.local.get('favorites');
    if (result.favorites && Array.isArray(result.favorites)) {
      setFavorites(result.favorites as Favorite[]);
    }
  };

  const addFavorite = () => {
    if (!newLabel.trim() || !newTag.trim()) return;

    const [username, domain] = baseEmail.split('@');
    const email = `${username}+${newTag.trim()}@${domain}`;

    const favorite: Favorite = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      email,
      tag: newTag.trim(),
    };

    const updated = [...favorites, favorite];
    setFavorites(updated);
    browser.storage.local.set({ favorites: updated });

    setNewLabel('');
    setNewTag('');
    setIsAdding(false);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    browser.storage.local.set({ favorites: updated });
  };

  if (favorites.length === 0 && !isAdding) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-xs text-gray-500 mt-2 mb-3">No favorites yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Favorite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Favorites</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (e.g., Amazon)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag (e.g., amazon)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={addFavorite}
              disabled={!newLabel.trim() || !newTag.trim()}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewLabel('');
                setNewTag('');
              }}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-xs font-medium text-gray-900">{fav.label}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono truncate ml-5">{fav.email}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onCopy(fav.email)}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                title="Copy"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => removeFavorite(fav.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
