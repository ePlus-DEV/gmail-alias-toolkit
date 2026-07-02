import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(globalThis, "browser", {
  value: {
    storage: {
      local: {
        get: vi.fn().mockResolvedValue({}),
        set: vi.fn(() => Promise.resolve()),
        onChanged: {
          addListener: vi.fn(),
          removeListener: vi.fn(),
        },
      },
    },
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(navigator, "clipboard", {
  value: { writeText: vi.fn(() => Promise.resolve()) },
  writable: true,
  configurable: true,
});
