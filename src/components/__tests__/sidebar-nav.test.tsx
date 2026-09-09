import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { SidebarNav } from "../sidebar-nav";
import type { Profile } from "@/types/database";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/app/login/actions", () => ({
  logout: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.Mock;
const mockedLogout = logout as jest.Mock;

const adminProfile: Profile = {
  id: "1",
  name: "Ana Admin",
  username: "ana",
  role: "admin",
  phone: null,
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const vendedorProfile: Profile = { ...adminProfile, id: "2", name: "Val Vendedor", role: "vendedor" };

describe("SidebarNav", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/dashboard");
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows admin-only links for an admin profile", () => {
    render(<SidebarNav profile={adminProfile} />);

    expect(screen.getByRole("link", { name: /cadastros/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /devoluções/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /relatórios/i })).toBeInTheDocument();
  });

  it("hides admin-only links for a vendedor profile", () => {
    render(<SidebarNav profile={vendedorProfile} />);

    expect(screen.queryByRole("link", { name: /cadastros/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /devoluções/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /relatórios/i })).not.toBeInTheDocument();
  });

  it("highlights the link matching the current pathname", () => {
    mockedUsePathname.mockReturnValue("/dashboard/clientes");
    render(<SidebarNav profile={adminProfile} />);

    expect(screen.getByRole("link", { name: /^clientes$/i })).toHaveClass("text-primary");
    expect(screen.getByRole("link", { name: /organizar entregas/i })).not.toHaveClass(
      "text-primary"
    );
  });

  it("calls logout when the sign-out button is clicked", () => {
    render(<SidebarNav profile={adminProfile} />);

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });

  it("calls onNavigate when a nav link is clicked", () => {
    const onNavigate = jest.fn();
    render(<SidebarNav profile={adminProfile} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole("link", { name: /^dashboard$/i }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("collapses on click, hides labels, and persists the preference", () => {
    render(<SidebarNav profile={adminProfile} />);

    expect(screen.getByText("Ana Admin")).toBeInTheDocument();
    const toggle = screen.getByTitle("Recolher menu");

    fireEvent.click(toggle);

    expect(screen.queryByText("Ana Admin")).not.toBeInTheDocument();
    expect(screen.getByTitle("Expandir menu")).toBeInTheDocument();
    expect(window.localStorage.getItem("sidebar-collapsed")).toBe("true");
  });

  it("expands again on a second click", () => {
    render(<SidebarNav profile={adminProfile} />);

    fireEvent.click(screen.getByTitle("Recolher menu"));
    fireEvent.click(screen.getByTitle("Expandir menu"));

    expect(screen.getByText("Ana Admin")).toBeInTheDocument();
    expect(window.localStorage.getItem("sidebar-collapsed")).toBe("false");
  });

  it("starts collapsed when the stored preference is true", () => {
    window.localStorage.setItem("sidebar-collapsed", "true");
    render(<SidebarNav profile={adminProfile} />);

    expect(screen.queryByText("Ana Admin")).not.toBeInTheDocument();
    expect(screen.getByTitle("Expandir menu")).toBeInTheDocument();
  });

  it("ignores the collapse toggle entirely when collapsible is false", () => {
    render(<SidebarNav profile={adminProfile} collapsible={false} />);

    expect(screen.queryByTitle("Recolher menu")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Expandir menu")).not.toBeInTheDocument();
    expect(screen.getByText("Ana Admin")).toBeInTheDocument();
  });
});
