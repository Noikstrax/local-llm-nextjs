import "@testing-library/jest-dom";

import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@app/api/action", () => ({
  registerUser: vi.fn(),
}));
