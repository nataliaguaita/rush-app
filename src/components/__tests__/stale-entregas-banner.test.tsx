import { render, screen } from "@testing-library/react";
import { useStaleEntregas } from "@/hooks/use-stale-entregas";
import { StaleEntregasBanner } from "../stale-entregas-banner";
import type { StaleEntrega } from "@/hooks/use-stale-entregas";

jest.mock("@/hooks/use-stale-entregas", () => ({
  useStaleEntregas: jest.fn(),
}));

const mockedUseStaleEntregas = useStaleEntregas as jest.Mock;

describe("StaleEntregasBanner", () => {
  afterEach(() => jest.resetAllMocks());

  it("renders nothing when there are no stale entregas", () => {
    mockedUseStaleEntregas.mockReturnValue([]);
    const { container } = render(<StaleEntregasBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses the singular form for a single stale entrega", () => {
    const entrega: StaleEntrega = {
      id: "e1",
      order_number: 7,
      status: "em_rota",
      created_at: "2026-09-01T00:00:00.000Z",
      cliente: { name: "Cliente A" },
    };
    mockedUseStaleEntregas.mockReturnValue([entrega]);

    render(<StaleEntregasBanner />);

    expect(
      screen.getByText("1 entrega esquecida há mais de 24h")
    ).toBeInTheDocument();
    expect(screen.getByText("#0007")).toBeInTheDocument();
    expect(screen.getByText("Cliente A")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/dashboard/entregas/e1"
    );
  });

  it("uses the plural form and falls back to 'Cliente' when the name is missing", () => {
    const entregas: StaleEntrega[] = [
      {
        id: "e1",
        order_number: 1,
        status: "em_rota",
        created_at: "2026-09-01T00:00:00.000Z",
        cliente: { name: "Cliente A" },
      },
      {
        id: "e2",
        order_number: 2,
        status: "recusada",
        created_at: "2026-09-01T00:00:00.000Z",
        cliente: null,
      },
    ];
    mockedUseStaleEntregas.mockReturnValue(entregas);

    render(<StaleEntregasBanner />);

    expect(
      screen.getByText("2 entregas esquecidas há mais de 24h")
    ).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
