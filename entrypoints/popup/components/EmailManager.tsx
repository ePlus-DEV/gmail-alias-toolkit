import { useState, useEffect } from 'react';

interface EmailAccount {
  id: string;
  email: string;
  label: string;
  isActive: boolean;
}

interface EmailManagerProps {
  currentEmail: string;
  onEmailChange: (email: string) => void;
}

export default function EmailManager({ currentEmail, onEmailChange }: EmailManagerProps) {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = (changes: any) => {
      if (changes.email_accounts) {
        loadAccounts();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);
    return () => browser.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  const loadAccounts = async () => {
    const result = await browser.storage.local.get(['email_accounts', 'base_email']);
    let emailAccounts = result.email_accounts as EmailAccount[] || [];
    
    // If no accounts and there's a base_email, create first account
    if (emailAccounts.length === 0 && result.base_email) {
      emailAccounts = [{
        id: Date.now().toString(),
        email: result.base_email,
        label: 'Primary',
        isActive: true,
      }];
      await browser.storage.local.set({ email_accounts: emailAccounts });
    }
    
    setAccounts(emailAccounts);
  };

  const addAccount = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) return;

    const account: EmailAccount = {
      id: Date.now().toString(),
      email: newEmail.trim(),
      label: newLabel.trim() || 'Account',
      isActive: false,
    };

    const updated = [...accounts, account];
    setAccounts(updated);
    await browser.storage.local.set({ email_accounts: updated });

    setNewEmail('');
    setNewLabel('');
    setIsAdding(false);
  };

  const switchAccount = async (accountId: string) => {
    const updated = accounts.map(acc => ({
      ...acc,
      isActive: acc.id === accountId,
    }));
    
    setAccounts(updated);
    await browser.storage.local.set({ email_accounts: updated });
    
    const selectedAccount = updated.find(acc => acc.id === accountId);
    if (selectedAccount) {
      onEmailChange(selectedAccount.email);
    }
  };

  const removeAccount = async (accountId: string) => {
    if (accounts.length === 1) {
      alert('You must have at least one email account');
      return;
    }

    const updated = accounts.filter(acc => acc.id !== accountId);
    
    // If removing active account, set first account as active
    const removingActive = accounts.find(acc => acc.id === accountId)?.isActive;
    if (removingActive && updated.length > 0) {
      updated[0].isActive = true;
      onEmailChange(updated[0].email);
    }
    
    setAccounts(updated);
    await browser.storage.local.set({ email_accounts: updated });
  };

  const updateAccountLabel = async (accountId: string, newLabel: string) => {
    const updated = accounts.map(acc => 
      acc.id === accountId ? { ...acc, label: newLabel } : acc
    );
    
    setAccounts(updated);
    await browser.storage.local.set({ email_accounts: updated });
  };

  const activeAccount = accounts.find(acc => acc.isActive);
  const inactiveAccounts = accounts.filter(acc => !acc.isActive);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Email Accounts</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Account
        </button>
      </div>

      {/* Active Account */}
      {activeAccount && (
        <div className="mb-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  value={activeAccount.label}
                  onChange={(e) => updateAccountLabel(activeAccount.id, e.target.value)}
                  className="text-xs font-semibold text-blue-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 rounded px-1"
                />
              </div>
              <div className="text-xs text-blue-700 font-mono truncate">
                {activeAccount.email}
              </div>
            </div>
            {accounts.length > 1 && (
              <button
                onClick={() => removeAccount(activeAccount.id)}
                className="ml-2 p-1 text-blue-400 hover:text-red-600 transition-colors"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add New Account Form */}
      {isAdding && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g., Work, Personal)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={addAccount}
                disabled={!newEmail.trim() || !newEmail.includes('@')}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewEmail('');
                  setNewLabel('');
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inactive Accounts */}
      {inactiveAccounts.length > 0 && (
        <div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 mb-2"
          >
            <span className="font-medium">Other Accounts ({inactiveAccounts.length})</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAll && (
            <div className="space-y-2">
              {inactiveAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => switchAccount(account.id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="text-xs font-medium text-gray-900 mb-0.5">
                        {account.label}
                      </div>
                      <div className="text-xs text-gray-600 font-mono truncate">
                        {account.email}
                      </div>
                    </button>
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Switch between multiple Gmail accounts easily. All aliases are saved per account.
        </p>
      </div>
    </div>
  );
}
