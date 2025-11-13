import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterMenu } from "./register-menu";
import { vi } from "vitest";
import { registerUser } from "@app/api/action";
import { useRouter } from "next/navigation";

vi.mock("next/navigation");
vi.mock("@app/api/action");

describe("Register menu component", () => {
  it("Send form and call router.push", async () => {
    const mockPush = vi.fn();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (registerUser as any).mockResolvedValueOnce({});

    render(<RegisterMenu />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/user name/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "TestUser",
        password: "123456",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
