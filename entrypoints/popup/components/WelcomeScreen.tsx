import { useState } from 'react';

interface WelcomeScreenProps {
  onEmailAdded: (email: string) => void;
  onOpenSettings: () => void;
}

export default function WelcomeScreen({ onEmailAdded, onOpenSettings }: WelcomeScreenProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) return;
    
    setIsSubmitting(true);
    
    // Create first account
    const account = {
      id: Date.now().toString(),
      email: email.trim(),
      label: 'Primary',
      isActive: true,
    };
    
    await browser.storage.local.set({ 
      email_accounts: [account],
      base_email: email.trim(),
    });
    
    onEmailAdded(email.trim());
    setIsSubmitting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full">
        {/* Logo/Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Gmail Alias Toolkit
          </h1>
          <p className="text-sm text-gray-600">
            Generate unlimited email aliases for privacy and organization
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Let's get started
          </h2>
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your Gmail address
          </label>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="your.email@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            autoFocus
          />
          
          <button
            onClick={handleSubmit}
            disabled={!email.trim() || !email.includes('@') || isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg mb-2"
          >
            {isSubmitting ? 'Setting up...' : 'Get Started'}
          </button>
          
          <button
            onClick={onOpenSettings}
            className="w-full px-6 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Advanced Setup in Settings
          </button>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            What you can do:
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">Private Email Generator</div>
                <div className="text-xs text-gray-600">Random aliases like Apple Hide My Email</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">Custom Tags & Presets</div>
                <div className="text-xs text-gray-600">Shopping, work, test, social & more</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <div className="text-sm font-medium text-gray-900">Gmail Advanced Tricks</div>
                <div className="text-xs text-gray-600">Dot trick, googlemail switch & combos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            All data is stored locally. No tracking, no server.
          </p>
        </div>
      </div>
    </div>
  );
}
