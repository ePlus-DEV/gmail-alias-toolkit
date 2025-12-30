import { useState } from 'react';

interface GmailTricksProps {
  baseEmail: string;
  onCopy: (email: string) => void;
}

export default function GmailTricks({ baseEmail, onCopy }: GmailTricksProps) {
  const [selectedTrick, setSelectedTrick] = useState<'dot' | 'googlemail' | 'nodots' | 'combo' | 'plus' | 'dotplus'>('dot');
  const [tricksCount, setTricksCount] = useState(10);
  const [generatedTricks, setGeneratedTricks] = useState<string[]>([]);
  const [randomizeDots, setRandomizeDots] = useState(false);

  const generateDotVariations = (username: string, count: number = 10): string[] => {
    if (username.length < 2) return [];
    
    const variations: string[] = [];
    
    if (randomizeDots) {
      // Random dot positions - truly random each time
      for (let i = 0; i < count; i++) {
        const chars = username.split('');
        const maxDots = Math.min(3, chars.length - 1);
        const numDots = Math.floor(Math.random() * maxDots) + 1;
        const positions = new Set<number>();
        
        // Generate truly random positions
        while (positions.size < numDots) {
          const pos = Math.floor(Math.random() * (chars.length - 1)) + 1;
          positions.add(pos);
        }
        
        // Insert dots at random positions
        const sortedPositions = Array.from(positions).sort((a, b) => a - b);
        let result = '';
        let lastPos = 0;
        sortedPositions.forEach(pos => {
          result += chars.slice(lastPos, pos).join('') + '.';
          lastPos = pos;
        });
        result += chars.slice(lastPos).join('');
        
        variations.push(result);
      }
    } else {
      // Sequential dot positions (original behavior)
      const len = username.length;
      for (let i = 1; i < len; i++) {
        variations.push(username.slice(0, i) + '.' + username.slice(i));
      }
      
      // Generate multiple dots
      if (username.length >= 4) {
        for (let i = 1; i < len - 1; i++) {
          for (let j = i + 1; j < len; j++) {
            variations.push(
              username.slice(0, i) + '.' + 
              username.slice(i, j) + '.' + 
              username.slice(j)
            );
          }
        }
      }
    }
    
    return [...new Set(variations)].slice(0, count);
  };

  const generateGooglemailVariation = (): string | null => {
    if (!baseEmail.includes('@')) return null;
    
    const [username, domain] = baseEmail.split('@');
    if (domain === 'gmail.com') {
      return `${username}@googlemail.com`;
    } else if (domain === 'googlemail.com') {
      return `${username}@gmail.com`;
    }
    return null;
  };

  const generateCombinations = (count: number = 10): string[] => {
    if (!baseEmail.includes('@')) return [];
    
    const [username, domain] = baseEmail.split('@');
    if (!domain.includes('gmail')) return [];
    
    const combinations: string[] = [];
    const dotVariations = generateDotVariations(username, count);
    
    // Dot + common tags
    const commonTags = ['newsletter', 'shop', 'spam', 'work', 'personal', 'test', 'promo', 'social', 'finance', 'travel'];
    dotVariations.forEach(dotUser => {
      commonTags.forEach(tag => {
        combinations.push(`${dotUser}+${tag}@${domain}`);
      });
    });
    
    return combinations.slice(0, count);
  };

  const generatePlusVariations = (count: number = 10): string[] => {
    if (!baseEmail.includes('@')) return [];
    
    const [username, domain] = baseEmail.split('@');
    const tags = [
      'newsletter', 'shop', 'spam', 'work', 'personal', 'test', 'promo',
      'social', 'finance', 'travel', 'amazon', 'ebay', 'facebook', 'twitter',
      'linkedin', 'github', 'google', 'microsoft', 'apple', 'samsung',
      'newsletter1', 'newsletter2', 'deals', 'offers', 'alerts', 'updates',
      'notifications', 'receipts', 'invoices', 'subscriptions'
    ];
    
    return tags.slice(0, count).map(tag => `${username}+${tag}@${domain}`);
  };

  const generateDotPlusVariations = (count: number = 10): string[] => {
    if (!baseEmail.includes('@')) return [];
    
    const [username, domain] = baseEmail.split('@');
    const dotVars = generateDotVariations(username, Math.ceil(count / 3));
    const tags = ['shop', 'work', 'test', 'spam', 'newsletter', 'promo', 'social', 'finance'];
    const results: string[] = [];
    
    dotVars.forEach(dotUser => {
      tags.forEach(tag => {
        results.push(`${dotUser}+${tag}@${domain}`);
      });
    });
    
    return results.slice(0, count);
  };

  const generateTricksVariations = () => {
    if (!baseEmail.includes('@')) return;
    
    // Clear previous results first to force re-render
    setGeneratedTricks([]);
    
    const [username, domain] = baseEmail.split('@');
    let results: string[] = [];
    
    switch (selectedTrick) {
      case 'dot':
        results = generateDotVariations(username, tricksCount).map(u => `${u}@${domain}`);
        break;
      case 'googlemail':
        const altDomain = domain === 'gmail.com' ? 'googlemail.com' : 'gmail.com';
        results = generateDotVariations(username, tricksCount).map(u => `${u}@${altDomain}`);
        break;
      case 'nodots':
        const noDots = username.replace(/\./g, '');
        const noDotResults = [
          `${noDots}@${domain}`,
          `${noDots}@${domain === 'gmail.com' ? 'googlemail.com' : 'gmail.com'}`,
        ];
        // Generate with plus tags too
        const tags = ['work', 'shop', 'test', 'spam', 'newsletter', 'promo', 'social', 'finance'];
        tags.forEach(tag => {
          noDotResults.push(`${noDots}+${tag}@${domain}`);
        });
        results = noDotResults.slice(0, tricksCount);
        break;
      case 'plus':
        results = generatePlusVariations(tricksCount);
        break;
      case 'dotplus':
        results = generateDotPlusVariations(tricksCount);
        break;
      case 'combo':
        results = generateCombinations(tricksCount);
        break;
    }
    
    // Use setTimeout to ensure state update triggers re-render
    setTimeout(() => {
      setGeneratedTricks(results);
      if (results.length > 0) {
        onCopy(results[0]);
      }
    }, 0);
  };

  const removeDots = (): string | null => {
    if (!baseEmail.includes('@')) return null;
    
    const [username, domain] = baseEmail.split('@');
    const noDots = username.replace(/\./g, '');
    return `${noDots}@${domain}`;
  };

  return (
    <div>
      {/* Trick Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => setSelectedTrick('dot')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'dot'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          Dot Trick
        </button>
        <button
          onClick={() => setSelectedTrick('plus')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'plus'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          Plus (+) Tags
        </button>
        <button
          onClick={() => setSelectedTrick('googlemail')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'googlemail'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          Googlemail
        </button>
        <button
          onClick={() => setSelectedTrick('nodots')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'nodots'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          Remove Dots
        </button>
        <button
          onClick={() => setSelectedTrick('dotplus')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'dotplus'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          Dot + Plus
        </button>
        <button
          onClick={() => setSelectedTrick('combo')}
          className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
            selectedTrick === 'combo'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-600 hover:border-green-300'
          }`}
        >
          All Combos
        </button>
      </div>

      {/* Options */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Number of variations</label>
          <input
            type="number"
            min="1"
            value={tricksCount}
            onChange={(e) => setTricksCount(Math.max(1, parseInt(e.target.value) || 10))}
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        {/* Random Dots Toggle - only show for dot-related tricks */}
        {(selectedTrick === 'dot' || selectedTrick === 'googlemail' || selectedTrick === 'dotplus' || selectedTrick === 'combo') && (
          <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="randomizeDots"
              checked={randomizeDots}
              onChange={(e) => setRandomizeDots(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="randomizeDots" className="text-sm font-medium text-green-700 cursor-pointer">
              🎲 Randomize dot positions
            </label>
            <span className="ml-auto text-xs text-green-600">
              {randomizeDots ? 'Random' : 'Sequential'}
            </span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateTricksVariations}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-md mb-3"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Tricks
        </div>
      </button>

      {/* Generated Tricks List */}
      {generatedTricks.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Generated Variations</span>
              <span className="text-xs text-gray-500">{generatedTricks.length} total</span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {generatedTricks.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors"
              >
                <div className="flex-1 font-mono text-xs text-gray-900 truncate">
                  {email}
                </div>
                <button
                  onClick={() => onCopy(email)}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors flex-shrink-0"
                  title="Copy"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
        <div className="flex gap-2">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[10px] text-blue-800">
            <strong>Gmail trick:</strong> Dots are ignored & everything after + goes to same inbox
          </p>
        </div>
      </div>
    </div>
  );
}
