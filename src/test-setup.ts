import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock global functions
global.jest = {
  fn: vi.fn,
  mock: vi.mock,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  spyOn: vi.spyOn,
} as any;
