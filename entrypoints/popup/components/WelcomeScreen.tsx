import { useCallback, useState, ReactNode } from "react";
import {
  validateEmail as validateEmailPure,
  getAccountStorageKey,
} from "../utils";

interface WelcomeScreenProps {
  onEmailAdded: (email: string) => void;
  onOpenSettings: () => void;
}

interface WelcomeHeaderProps {}

interface WelcomeFormProps {
  email: string;
  validationError: string;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  onOpenSettings: () => void;
  focusOnMount: (el: HTMLInputElement | null) => void;
}

interface WelcomeCardProps {
  children: ReactNode;
}

interface WelcomeFeaturesProps {}

/** First-run screen that collects the user's base email and creates the initial account. */
export default function WelcomeScreen({
  onEmailAdded,
  onOpenSettings,
}: WelcomeScreenProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  /** Focuses the email input once when it mounts (replaces autoFocus). */
  const focusOnMount = useCallback((el: HTMLInputElement | null) => {
    el?.focus();
  }, []);

  /** Validates the email, storing any error or warning message in state. */
  const validateEmail = (value: string): boolean => {
    setValidationError("");
    const result = validateEmailPure(value.trim());
    if (!result.isValid) {
      setValidationError(result.error || "");
      return false;
    }
    if (result.warning) {
      setValidationError(result.warning);
    }
    return true;
  };

  /** Appends @gmail.com when the value has no domain part. */
  const completeDomain = (value: string) =>
    value.includes("@") ? value : `${value}@gmail.com`;

  /** Validates the email, creates the first account, and migrates any legacy data. */
  const handleSubmit = async () => {
    const emailTrimmed = completeDomain(email.trim());
    if (emailTrimmed !== email) setEmail(emailTrimmed);

    if (!validateEmail(emailTrimmed)) {
      return;
    }

    setIsSubmitting(true);

    // Create first account
    const account = {
      id: Date.now().toString(),
      email: emailTrimmed,
      label: "Primary",
      isActive: true,
    };

    // Initialize account-specific storage
    const historyKey = getAccountStorageKey(emailTrimmed, "gmail_alias_recent");
    const statsKey = getAccountStorageKey(emailTrimmed, "alias_stats");
    const favoritesKey = getAccountStorageKey(emailTrimmed, "favorites");

    // Check if there's existing data in old format and migrate it
    const existingData = await browser.storage.local.get([
      "gmail_alias_recent",
      "alias_stats",
      "favorites",
    ]);

    await browser.storage.local.set({
      email_accounts: [account],
      base_email: emailTrimmed,
      // Initialize account-specific storage
      [historyKey]: existingData.gmail_alias_recent || [],
      [statsKey]: existingData.alias_stats || { total: 0, tags: {} },
      [favoritesKey]: existingData.favorites || [],
    });

    onEmailAdded(emailTrimmed);
    setIsSubmitting(false);
  };

  /** Submits the form when Enter is pressed. */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Auto-complete @gmail.com on blur (Tab away included) instead of
  // hijacking the Tab key, which would break normal focus navigation.
  const handleBlur = () => {
    if (!email) return;
    const finalEmail = completeDomain(email);
    if (finalEmail !== email) setEmail(finalEmail);
    validateEmail(finalEmail);
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <WelcomeHeader />
        <WelcomeCard>
          <WelcomeForm
            email={email}
            validationError={validationError}
            isSubmitting={isSubmitting}
            onEmailChange={(value) => {
              setEmail(value);
              if (validationError) setValidationError("");
            }}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            onSubmit={handleSubmit}
            onOpenSettings={onOpenSettings}
            focusOnMount={focusOnMount}
          />
          <WelcomeFeatures />
        </WelcomeCard>
        <WelcomeFooter />
      </div>
    </div>
  );
}

function WelcomeHeader({}: WelcomeHeaderProps) {
  return (
    <div className="text-center mb-3">
      <img
        src="/icons/128.png"
        alt=""
        className="w-12 h-12 rounded-xl mb-2 mx-auto"
      />
      <h1 className="text-lg font-bold text-gray-900">
        Welcome to Gmail Alias Toolkit
      </h1>
      <p className="text-xs text-gray-600 mt-0.5">
        Generate unlimited email aliases for privacy and organization
      </p>
    </div>
  );
}

function WelcomeForm({
  email,
  validationError,
  isSubmitting,
  onEmailChange,
  onBlur,
  onKeyPress,
  onSubmit,
  onOpenSettings,
  focusOnMount,
}: WelcomeFormProps) {
  const isWarning = validationError.includes("⚠️");

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-2.5">
        Let&apos;s get started
      </h2>

      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Enter your Gmail address
      </label>

      <div className="relative mb-1.5">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyPress}
          placeholder="your.email"
          className={`w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 transition-colors ${
            validationError && !isWarning
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : validationError && isWarning
                ? "border-amber-300 focus:ring-amber-500 focus:border-amber-500"
                : "border-blue-500 focus:ring-blue-500 focus:border-transparent"
          }`}
          ref={focusOnMount}
        />
        {email && !email.includes("@") && !validationError && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            @gmail.com
          </div>
        )}
      </div>

      {validationError && (
        <div
          className={`mb-2 p-1.5 rounded-full text-xs text-center ${
            isWarning
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {validationError}
        </div>
      )}

      {!email.includes("@") && (
        <p className="text-xs text-gray-500 mb-2.5 flex items-center gap-1.5">
          <span>💡</span> Press{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
            Tab
          </kbd>{" "}
          for @gmail.com
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={!email.trim() || (validationError && !isWarning) || isSubmitting}
        className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-1"
      >
        {isSubmitting ? "Setting up..." : "Get Started"}
      </button>

      <button
        onClick={onOpenSettings}
        className="w-full flex items-center justify-center gap-1.5 px-6 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium rounded-full hover:bg-blue-50 transition-colors"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Advanced Setup in Settings
      </button>
    </div>
  );
}

function WelcomeCard({ children }: WelcomeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200 mb-2.5">
      {children}
    </div>
  );
}

function WelcomeFeatures({}: WelcomeFeaturesProps) {
  return (
    <div className="p-3.5">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">
        What you can do:
      </h3>
      <div className="space-y-1.5">
        <FeatureItem
          icon={
            <svg
              className="w-3.5 h-3.5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          bgColor="bg-blue-50"
          label="Private Email Generator"
        />
        <FeatureItem
          icon={
            <svg
              className="w-3.5 h-3.5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          }
          bgColor="bg-green-50"
          label="Custom Tags & Presets"
        />
        <FeatureItem
          icon={
            <svg
              className="w-3.5 h-3.5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          bgColor="bg-purple-50"
          label="Gmail Advanced Tricks"
        />
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: ReactNode;
  bgColor: string;
  label: string;
}

function FeatureItem({ icon, bgColor, label }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 border border-gray-200 rounded-full">
      <span className={`w-6 h-6 rounded-md ${bgColor} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </span>
      <span className="text-xs font-medium text-gray-900">{label}</span>
    </div>
  );
}

function WelcomeFooter() {
  return (
    <p className="text-center text-xs text-gray-500">
      All data is stored locally. No tracking, no server.
    </p>
  );
}
