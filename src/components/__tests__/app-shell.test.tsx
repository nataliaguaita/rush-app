import { render, screen, fireEvent, within } from "@testing-library/react";
import { AppShell } from "../app-shell";
import type { Profile } from "@/types/database";

jest.mock("@/components/sidebar-nav", () => ({
  SidebarNav: (props: { collapsible?: boolean; onNavigate?: () => void }) => (
    <div data-testid="sidebar-nav" data-collapsible={String(props.collapsible)}>
      <button onClick={props.onNavigate}>mock-nav-link</button>
    </div>
  ),
}));

jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="mobile-sheet">{children}</div> : null,
  SheetContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const profile: Profile = {
  id: "1",
  name: "Ana Admin",
  username: "ana",
  role: "admin",
  phone: null,
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("AppShell", () => {
  it("renders the children and the desktop sidebar, with the mobile sheet closed", () => {
    render(
      <AppShell profile={profile}>
        <p>page content</p>
      </AppShell>
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.getAllByTestId("sidebar-nav")).toHaveLength(1);
    expect(screen.queryByTestId("mobile-sheet")).not.toBeInTheDocument();
  });

  it("opens the mobile sheet (with a non-collapsible sidebar) when the menu button is clicked", () => {
    render(
      <AppShell profile={profile}>
        <p>page content</p>
      </AppShell>
    );

    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));

    expect(screen.getByTestId("mobile-sheet")).toBeInTheDocument();
    const sidebars = screen.getAllByTestId("sidebar-nav");
    expect(sidebars).toHaveLength(2);
    expect(sidebars[1]).toHaveAttribute("data-collapsible", "false");
  });

  it("closes the mobile sheet when a nav link fires onNavigate", () => {
    render(
      <AppShell profile={profile}>
        <p>page content</p>
      </AppShell>
    );

    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));
    expect(screen.getByTestId("mobile-sheet")).toBeInTheDocument();

    const sheet = screen.getByTestId("mobile-sheet");
    fireEvent.click(within(sheet).getByText("mock-nav-link"));

    expect(screen.queryByTestId("mobile-sheet")).not.toBeInTheDocument();
  });
});
