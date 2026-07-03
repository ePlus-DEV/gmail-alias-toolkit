// skipcq: JS-0415 - Account switcher form layout is intentionally inline and shallow in behavior.
import { Mail, Plus, Tag, UserRound } from "lucide-react";
import { Button } from "src/components/motion/button/base";
import { Input } from "src/components/motion/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/motion/select";
import { Tooltip } from "src/components/motion/tooltip";
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

interface AccountSelectRowProps {
  baseEmail: string;
  emailAccounts: EmailAccount[];
  onToggleAddAccount: () => void;
  onSelectAccount: (email: string) => Promise<void>;
}

/** Account select row with quick-add action. */
function AccountSelectRow({
  baseEmail,
  emailAccounts,
  onToggleAddAccount,
  onSelectAccount,
}: AccountSelectRowProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1 space-y-1.5">
        <label className="block text-xs font-semibold text-foreground">
          {t("activeGmailAddress")}
        </label>
        <Select value={baseEmail} onValueChange={onSelectAccount}>
          <SelectTrigger className="rounded-2xl bg-background">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue className="flex-1 text-left" />
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
      <Tooltip content={t("addNewAccount")} side="left">
        <Button
          onClick={onToggleAddAccount}
          size="icon"
          ripple
          className="h-10 w-10 shrink-0 rounded-2xl"
          aria-label={t("addNewAccount")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
}

interface QuickAddAccountFormProps {
  newAccountEmail: string;
  newAccountLabel: string;
  addAccountError: string;
  focusOnMount: (el: HTMLInputElement | null) => void;
  onNewAccountEmailChange: (value: string) => void;
  onNewAccountLabelChange: (value: string) => void;
  onNewAccountBlur: () => void;
  onAddAccount: () => void;
  onCancelAddAccount: () => void;
}

/** Inline account creation form shown below the selector. */
function QuickAddAccountForm({
  newAccountEmail,
  newAccountLabel,
  addAccountError,
  focusOnMount,
  onNewAccountEmailChange,
  onNewAccountLabelChange,
  onNewAccountBlur,
  onAddAccount,
  onCancelAddAccount,
}: QuickAddAccountFormProps) {
  return (
    <div className="mt-3 space-y-2 border-t border-border/70 pt-3 dark:border-border/70">
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
        <p className="-mt-1 text-xs text-muted-foreground">
          {t("pressTabToAddGmail", "Tab").split("Tab")[0]}
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs">
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
          disabled={!newAccountEmail.trim() || !newAccountEmail.includes("@")}
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
  );
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
    <div className="p-3">
      <AccountSelectRow
        baseEmail={baseEmail}
        emailAccounts={emailAccounts}
        onToggleAddAccount={onToggleAddAccount}
        onSelectAccount={onSelectAccount}
      />
      {showAddAccount && (
        <QuickAddAccountForm
          newAccountEmail={newAccountEmail}
          newAccountLabel={newAccountLabel}
          addAccountError={addAccountError}
          focusOnMount={focusOnMount}
          onNewAccountEmailChange={onNewAccountEmailChange}
          onNewAccountLabelChange={onNewAccountLabelChange}
          onNewAccountBlur={onNewAccountBlur}
          onAddAccount={onAddAccount}
          onCancelAddAccount={onCancelAddAccount}
        />
      )}
      {baseEmail &&
        !baseEmail.includes("@gmail.com") &&
        baseEmail.includes("@") && (
          <p className="mt-2 text-xs font-medium text-accent">
            {t("gmailWarning")}
          </p>
        )}
    </div>
  );
}
