import { useCallback, useState, ReactNode } from "react";
import { UserRound } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { TextReveal } from "src/components/motion/text-reveal";
import {
  validateEmail as validateEmailPure,
  getAccountStorageKey,
} from "../utils";
import { t } from "../../../lib/i18n";

interface WelcomeScreenProps {
  onEmailAdded: (email: string) => void;
  onOpenSettings: () => void;
}

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

  // skipcq: JS-0415
  return (
    <div className="flex items-center justify-center bg-muted/40 p-4">
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

/** Renders the logo, title, and intro copy for the first-run screen. */
function WelcomeHeader() {
  return (
    <div className="text-center mb-3">
      <img
        src="/icons/128.png"
        alt=""
        className="w-12 h-12 rounded-xl mb-2 mx-auto"
      />
      <TextReveal
        as="h1"
        text={t("welcomeTitle")}
        split="word"
        stagger={0.055}
        blur={8}
        yOffset="32%"
        className="text-lg font-bold text-foreground"
      />
      <TextReveal
        as="p"
        text={t("welcomeSubtitle")}
        split="word"
        stagger={0.025}
        delay={0.16}
        blur={6}
        yOffset="24%"
        className="mt-0.5 text-xs text-muted-foreground"
      />
    </div>
  );
}

/** Renders the initial Gmail account form and its validation feedback. */
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
      <h2 className="mb-2.5 text-sm font-semibold text-foreground">
        {t("letsGetStarted")}
      </h2>

      <label className="mb-1.5 block text-xs font-medium text-foreground">
        {t("enterGmailAddress")}
      </label>

      <div className="relative mb-1.5">
        <Input
          type="email"
          value={email}
          onChange={onEmailChange}
          onBlur={onBlur}
          onKeyDown={onKeyPress}
          placeholder={t("emailPlaceholder")}
          leftIcon={<UserRound className="h-4 w-4" />}
          className={`w-full ${
            validationError && !isWarning
              ? "text-destructive"
              : validationError && isWarning
                ? "text-accent"
                : ""
          }`}
          ref={focusOnMount}
        />
        {email && !email.includes("@") && !validationError && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            @gmail.com
          </div>
        )}
      </div>

      {validationError && (
        <div
          className={`mb-2 p-1.5 rounded-full text-xs text-center ${
            isWarning
              ? "bg-accent/10 text-accent border border-accent/25"
              : "bg-destructive/10 text-destructive border border-destructive/30"
          }`}
        >
          {validationError}
        </div>
      )}

      {!email.includes("@") && (
        <p className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>💡</span> {t("pressTabForGmail", "Tab").split("Tab")[0]}
          <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
            Tab
          </kbd>
          {t("pressTabForGmail", "Tab").split("Tab")[1]}
        </p>
      )}

      <Button
        onClick={onSubmit}
        disabled={
          !email.trim() || (validationError && !isWarning) || isSubmitting
        }
        ripple
        className="w-full px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-1"
      >
        {isSubmitting ? t("settingUp") : t("getStarted")}
      </Button>

      <Button
        onClick={onOpenSettings}
        variant="ghost"
        className="w-full flex items-center justify-center gap-1.5 px-6 py-1.5 text-xs text-primary hover:text-primary font-medium rounded-full hover:bg-primary/10 transition-colors"
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
        {t("advancedSetup")}
      </Button>
    </div>
  );
}

/** Wraps the welcome form sections in the shared first-run card. */
function WelcomeCard({ children }: WelcomeCardProps) {
  return (
    <div className="mb-2.5 divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
      {children}
    </div>
  );
}

/** Lists the primary features available after setup. */
function WelcomeFeatures() {
  return (
    <div className="p-3.5">
      <h3 className="mb-2 text-xs font-semibold text-foreground">
        {t("whatYouCanDo")}
      </h3>
      <div className="space-y-1.5">
        <FeatureItem
          icon={
            <svg
              className="w-3.5 h-3.5 text-primary"
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
          bgColor="bg-primary/10"
          label={t("featurePrivateEmail")}
        />
        <FeatureItem
          icon={
            <svg
              className="h-3.5 w-3.5 text-accent"
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
          bgColor="bg-accent/10"
          label={t("featureCustomTags")}
        />
        <FeatureItem
          icon={
            <svg
              className="h-3.5 w-3.5 text-primary"
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
          bgColor="bg-primary/10"
          label={t("featureGmailTricks")}
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

/** Renders one compact welcome feature row. */
function FeatureItem({ icon, bgColor, label }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border px-3 py-1.5">
      <span
        className={`w-6 h-6 rounded-md ${bgColor} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </span>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}

/** Renders the welcome screen footer message. */
function WelcomeFooter() {
  return (
    <p className="text-center text-xs text-muted-foreground">{t("welcomeFooter")}</p>
  );
}





