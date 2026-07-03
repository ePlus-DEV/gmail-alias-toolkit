import { Mail, Plus, Tag, UserRound } from "lucide-react";
import { Button, Input } from "../ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select";
import { t } from "../../../lib/i18n";

export interface EmailAccount {
  id: string;
  email: string;
  label?: string;
  isActive: boolean;
}
export interface AccountSwitcherProps {
  baseEmail: string;
  emailAccounts: EmailAccount[];
  showAddAccount: boolean;
  newAccountEmail: string;
  newAccountLabel: string;
  addAccountError: string;
  focusOnMount: (el: HTMLInputElement | null) => void;
  onToggleAddAccount: () => void;
  onSelectAccount: (email: string) => Promise<void>;
  onNewAccountEmailChange: (value: string) => void;
  onNewAccountLabelChange: (value: string) => void;
  onNewAccountBlur: () => void;
  onAddAccount: () => void;
  onCancelAddAccount: () => void;
}

/** Multi-account selector and quick-add form; delegates all behavior to App. */
export default function AccountSwitcher(props: AccountSwitcherProps) {
  const {
    baseEmail,
    emailAccounts,
    showAddAccount,
    newAccountEmail,
    newAccountLabel,
    addAccountError,
    focusOnMount,
    onToggleAddAccount,
    onSelectAccount,
    onNewAccountEmailChange,
    onNewAccountLabelChange,
    onNewAccountBlur,
    onAddAccount,
    onCancelAddAccount,
  } = props;
  return (
    <div className="p-4">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            {t("activeGmailAddress")}
          </label>
          <Select value={baseEmail} onValueChange={onSelectAccount}>
            <SelectTrigger className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {emailAccounts.length > 0 ? (
                emailAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.email}>
                    {account.label ? `${account.label} - ` : ""}
                    {account.email}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={baseEmail}>{baseEmail}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onToggleAddAccount}
          size="icon"
          ripple
          className="mt-[22px] shrink-0 rounded-2xl"
          title={t("addNewAccount")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {showAddAccount && (
        <div className="mt-3 space-y-2 border-t border-gray-200/70 pt-3 dark:border-gray-700/70">
          <Input
            type="email"
            value={newAccountEmail}
            onChange={onNewAccountEmailChange}
            onBlur={onNewAccountBlur}
            placeholder={t("emailPlaceholder")}
            leftIcon={<UserRound className="h-4 w-4" />}
            error={addAccountError || undefined}
            ref={focusOnMount}
          />
          {newAccountEmail && !newAccountEmail.includes("@") && (
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              {t("pressTabToAddGmail", "Tab").split("Tab")[0]}
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                Tab
              </kbd>
              {t("pressTabToAddGmail", "Tab").split("Tab")[1]}
            </p>
          )}
          <Input
            type="text"
            value={newAccountLabel}
            onChange={onNewAccountLabelChange}
            placeholder={t("accountLabelPlaceholder")}
            leftIcon={<Tag className="h-4 w-4" />}
          />
          <div className="flex gap-2">
            <Button
              onClick={onAddAccount}
              disabled={
                !newAccountEmail.trim() || !newAccountEmail.includes("@")
              }
              fullWidth
              ripple
            >
              <Plus className="h-4 w-4" />
              {t("addAccount")}
            </Button>
            <Button onClick={onCancelAddAccount} variant="secondary">
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}
      {baseEmail &&
        !baseEmail.includes("@gmail.com") &&
        baseEmail.includes("@") && (
          <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            {t("gmailWarning")}
          </p>
        )}
    </div>
  );
}
