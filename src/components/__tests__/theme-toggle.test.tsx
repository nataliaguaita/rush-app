import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../theme-toggle";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockedUseTheme = useTheme as jest.Mock;

describe("ThemeToggle", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("switches to dark mode on click when currently light", () => {
    const setTheme = jest.fn();
    mockedUseTheme.mockReturnValue({ resolvedTheme: "light", setTheme });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Modo noturno" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light mode on click when currently dark", () => {
    const setTheme = jest.fn();
    mockedUseTheme.mockReturnValue({ resolvedTheme: "dark", setTheme });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Modo claro" }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("hides the text label when collapsed, keeping only the icon button", () => {
    mockedUseTheme.mockReturnValue({ resolvedTheme: "light", setTheme: jest.fn() });

    render(<ThemeToggle collapsed />);
    const button = screen.getByRole("button", { name: "Modo noturno" });

    expect(button).toHaveTextContent("");
  });
});
