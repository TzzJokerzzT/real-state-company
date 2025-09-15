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
  mockImplementation: vi.mockImplementation,
  mockReturnValue: vi.mockReturnValue,
  mockResolvedValue: vi.mockResolvedValue,
  mockRejectedValue: vi.mockRejectedValue,
} as any;
