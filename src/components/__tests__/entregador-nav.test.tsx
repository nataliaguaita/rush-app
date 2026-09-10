import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { EntregadorHeader, EntregadorBottomNav } from "../entregador-nav";
import type { Profile } from "@/types/database";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("@/app/login/actions", () => ({
  logout: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;
const mockedLogout = logout as jest.Mock;

const profile: Profile = {
  id: "1",
  name: "Beto Entregador",
  username: "beto",
  role: "entregador",
  phone: null,
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("EntregadorHeader", () => {
  afterEach(() => jest.resetAllMocks());

  it("shows the profile name", () => {
    render(<EntregadorHeader profile={profile} />);
    expect(screen.getByText("Beto Entregador")).toBeInTheDocument();
  });

  it("calls logout when the sign-out button is clicked", () => {
    render(<EntregadorHeader profile={profile} />);
    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });
});

describe("EntregadorBottomNav", () => {
  afterEach(() => jest.resetAllMocks());

  it("highlights the active section", () => {
    mockedUsePathname.mockReturnValue("/entregador/finalizadas");
    render(<EntregadorBottomNav />);

    expect(screen.getByRole("link", { name: /finalizadas/i })).toHaveClass(
      "text-[#0090FF]"
    );
    expect(screen.getByRole("link", { name: /entregas/i })).not.toHaveClass(
      "text-[#0090FF]"
    );
  });

  it("treats the base path as active for nested routes", () => {
    mockedUsePathname.mockReturnValue("/entregador");
    render(<EntregadorBottomNav />);

    expect(screen.getByRole("link", { name: /^entregas$/i })).toHaveClass(
      "text-[#0090FF]"
    );
  });
});
