import { useState, useEffect } from "react";
import { getAccountStorageKey } from "../utils";

interface Favorite {
  id: string;
  email: string;
  addedAt: number;
}

interface FavoritesProps {
  baseEmail: string;
  onCopy: (email: string) => void;
}

export default function Favorites({ baseEmail, onCopy }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const loadFavorites = async () => {
    const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
    const result = await browser.storage.local.get(favoritesKey);
    if (result[favoritesKey] && Array.isArray(result[favoritesKey])) {
      setFavorites(result[favoritesKey] as Favorite[]);
    } else {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [baseEmail]);

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = (
      changes: Record<string, { newValue?: unknown; oldValue?: unknown }>,
    ) => {
      // Check if any favorites key changed
      const changedKeys = Object.keys(changes);
      const relevantChange = changedKeys.some((key) =>
        key.startsWith("favorites_"),
      );
      if (relevantChange || changes.email_accounts) {
        loadFavorites();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const removeFavorite = async (email: string) => {
    const favoritesKey = getAccountStorageKey(baseEmail, "favorites");
    const updated = favorites.filter((f) => f.email !== email);
    setFavorites(updated);
    await browser.storage.local.set({ [favoritesKey]: updated });
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-900">⭐ Favorites</h2>
        </div>
        <div className="text-center py-4">
          <svg
            className="mx-auto h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <p className="text-xs text-gray-500 mt-2">No favorites yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Click ⭐ on any alias in history to add it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">⭐ Favorites</h2>
        <span className="text-xs text-gray-500">{favorites.length} saved</span>
      </div>

      <div className="space-y-2">
        {favorites.map((favorite) => {
          const tagMatch = favorite.email.match(/\+([^@]+)@/);
          const tag = tagMatch ? tagMatch[1] : "no-tag";

          return (
            <div
              key={favorite.id}
              className="group flex items-center gap-2 p-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-md hover:shadow-sm transition-all"
            >
              <button
                onClick={() => onCopy(favorite.email)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                </div>
                <div className="text-xs text-gray-700 font-mono truncate">
                  {favorite.email}
                </div>
              </button>

              <button
                onClick={() => removeFavorite(favorite.email)}
                className="p-1.5 text-yellow-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from favorites"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
