import { useState } from 'react';

interface GmailTricksProps {
  baseEmail: string;
  onCopy: (email: string) => void;
}

export default function GmailTricks({ baseEmail, onCopy }: GmailTricksProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTrick, setSelectedTrick] = useState<string | null>(null);

  const generateDotVariations = (username: string): string[] => {
    if (username.length < 2) return [];
    
    const variations: string[] = [];
    const positions = Math.min(3, username.length - 1); // Limit to 3 dot positions
    
    // Generate some common dot patterns
    if (username.length >= 4) {
      // Middle dot
      const mid = Math.floor(username.length / 2);
      variations.push(username.slice(0, mid) + '.' + username.slice(mid));
      
      // First third
      const third = Math.floor(username.length / 3);
      variations.push(username.slice(0, third) + '.' + username.slice(third));
      
      // Multiple dots
      if (username.length >= 6) {
        const part1 = Math.floor(username.length / 3);
        const part2 = Math.floor((username.length * 2) / 3);
        variations.push(
          username.slice(0, part1) + '.' + 
          username.slice(part1, part2) + '.' + 
          username.slice(part2)
        );
      }
    }
    
    return [...new Set(variations)].slice(0, 5);
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

  const generateCombinations = (): string[] => {
    if (!baseEmail.includes('@')) return [];
    
    const [username, domain] = baseEmail.split('@');
    if (!domain.includes('gmail')) return [];
    
    const combinations: string[] = [];
    const dotVariations = generateDotVariations(username);
    
    // Dot + common tags
    const commonTags = ['newsletter', 'shop', 'spam'];
    dotVariations.slice(0, 2).forEach(dotUser => {
      commonTags.forEach(tag => {
        combinations.push(`${dotUser}+${tag}@${domain}`);
      });
    });
    
    return combinations.slice(0, 6);
  };

  const removeDots = (): string | null => {
    if (!baseEmail.includes('@')) return null;
    
    const [username, domain] = baseEmail.split('@');
    const noDots = username.replace(/\./g, '');
    return `${noDots}@${domain}`;
  };

  const tricks = [
    {
      id: 'dot',
      title: 'Dot Trick',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      ),
      description: 'Add dots to username',
      action: () => {
        const [username, domain] = baseEmail.split('@');
        const variations = generateDotVariations(username);
        if (variations.length > 0) {
          const selected = variations[0];
          onCopy(`${selected}@${domain}`);
          setSelectedTrick('dot');
        }
      },
    },
    {
      id: 'googlemail',
      title: 'Googlemail Switch',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      description: 'gmail.com ↔ googlemail.com',
      action: () => {
        const variation = generateGooglemailVariation();
        if (variation) {
          onCopy(variation);
          setSelectedTrick('googlemail');
        }
      },
    },
    {
      id: 'nodots',
      title: 'Remove Dots',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      description: 'Remove all dots from email',
      action: () => {
        const noDots = removeDots();
        if (noDots) {
          onCopy(noDots);
          setSelectedTrick('nodots');
        }
      },
    },
    {
      id: 'combo',
      title: 'Dot + Tag Combo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Combine dots and tags',
      action: () => {
        const combos = generateCombinations();
        if (combos.length > 0) {
          onCopy(combos[0]);
          setSelectedTrick('combo');
        }
      },
    },
  ];

  const getDotVariationsForDisplay = () => {
    if (!baseEmail.includes('@')) return [];
    const [username, domain] = baseEmail.split('@');
    return generateDotVariations(username).map(u => `${u}@${domain}`);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-green-700">Gmail Advanced Tricks</span>
          </div>
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-900">Gmail Advanced Tricks</h2>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-4">
        Gmail ignores dots and treats everything after + as the same email
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tricks.map((trick) => (
          <button
            key={trick.id}
            onClick={trick.action}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedTrick === trick.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <div className={selectedTrick === trick.id ? 'text-green-600' : 'text-gray-600'}>
                {trick.icon}
              </div>
              <div className="text-xs font-medium text-gray-900">{trick.title}</div>
              <div className="text-[10px] text-gray-500">{trick.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Dot Variations Preview */}
      {getDotVariationsForDisplay().length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">Dot Variations:</div>
          <div className="space-y-1">
            {getDotVariationsForDisplay().map((email, index) => (
              <button
                key={index}
                onClick={() => onCopy(email)}
                className="w-full text-left px-2 py-1.5 text-xs font-mono text-gray-600 hover:bg-green-50 rounded transition-colors flex items-center justify-between group"
              >
                <span className="truncate">{email}</span>
                <svg className="w-3 h-3 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
        <div className="flex gap-2">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[10px] text-blue-800">
            <strong>Pro tip:</strong> john.doe@gmail.com = johndoe@gmail.com = j.o.h.n.d.o.e@gmail.com
            <br />All variations deliver to the same inbox!
          </p>
        </div>
      </div>
    </div>
  );
}
