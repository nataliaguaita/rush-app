import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../status-badge";

describe("StatusBadge", () => {
  it("renders the label for a known status", () => {
    render(<StatusBadge status="entregue" />);
    expect(screen.getByText("Entregue")).toBeInTheDocument();
  });

  it("falls back to the raw status for an unknown value", () => {
    render(<StatusBadge status="estado_bizarro" />);
    expect(screen.getByText("estado_bizarro")).toBeInTheDocument();
  });

  it("merges a custom className with the status className", () => {
    render(<StatusBadge status="entregue" className="text-[10px]" />);
    expect(screen.getByText("Entregue")).toHaveClass("text-[10px]");
  });
});
