import { useState } from "react";
import Button from "./Button";

/** Button that opens a modal listing available keyboard shortcuts. */
export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      key: "Enter",
      description: "Generate alias with custom tag",
      context: "In custom tag input",
    },
    { key: "Ctrl/Cmd + K", description: "Open settings", context: "Anywhere" },
    { key: "Esc", description: "Close settings", context: "In settings" },
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Keyboard Shortcuts
      </Button>

      {isOpen && (
        // skipcq: JS-0415
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Keyboard Shortcuts
                </h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-muted-foreground"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {shortcut.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {shortcut.context}
                    </div>
                  </div>
                  <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
