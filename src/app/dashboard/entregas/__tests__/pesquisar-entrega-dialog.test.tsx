/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- loosely-typed local mocks of the Dialog/Select primitives and the Supabase query builder */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PesquisarEntregaDialog } from "../pesquisar-entrega-dialog";

function mockBuilder(resolvedValue: { data: any[] }) {
  const builder: any = {};
  ["select", "order", "eq", "filter", "gte", "lte", "limit"].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.then = (resolve: any) => Promise.resolve(resolvedValue).then(resolve);
  return builder;
}

const mockClientesBuilder = mockBuilder({ data: [{ id: "c1", name: "Padaria Silva" }] });
const mockEntregasBuilder = mockBuilder({
  data: [{ id: "e1", order_number: 42, status: "entregue", cliente: { name: "Padaria Silva" } }],
});
const mockFrom = jest.fn((table: string) =>
  table === "clientes" ? mockClientesBuilder : mockEntregasBuilder
);

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ from: mockFrom }),
}));

jest.mock("@/components/ui/dialog", () => {
  const React = require("react");
  const DialogCtx = React.createContext(null);

  function Dialog({ open, onOpenChange, children }: any) {
    return React.createElement(DialogCtx.Provider, { value: { open, onOpenChange } }, children);
  }
  function DialogTrigger({ render }: any) {
    const ctx = React.useContext(DialogCtx);
    return React.cloneElement(render, { onClick: () => ctx.onOpenChange(true) });
  }
  function DialogContent({ children }: any) {
    const ctx = React.useContext(DialogCtx);
    return ctx.open ? React.createElement("div", null, children) : null;
  }
  const Passthrough = ({ children }: any) => children ?? null;
  return { Dialog, DialogTrigger, DialogContent, DialogHeader: Passthrough, DialogTitle: Passthrough };
});

jest.mock("@/components/ui/select", () => {
  const React = require("react");
  const Passthrough = ({ children }: any) => children ?? null;
  return {
    Select: Passthrough,
    SelectTrigger: Passthrough,
    SelectValue: Passthrough,
    SelectContent: Passthrough,
    SelectItem: Passthrough,
  };
});

function openDialog() {
  fireEvent.click(screen.getByRole("button", { name: /pesquisar entrega/i }));
}

describe("PesquisarEntregaDialog", () => {
  afterEach(() => jest.clearAllMocks());

  it("queries clientes (not the on-screen entregas list) when opened", async () => {
    render(<PesquisarEntregaDialog entregadores={[]} />);
    openDialog();

    await waitFor(() => expect(mockFrom).toHaveBeenCalledWith("clientes"));
  });

  it("searches entregas on the server, unrestricted by the dashboard's selected date", async () => {
    render(<PesquisarEntregaDialog entregadores={[]} />);
    openDialog();

    fireEvent.change(screen.getByPlaceholderText(/ex: 42 ou #0042/i), { target: { value: "42" } });
    fireEvent.click(screen.getByRole("button", { name: "Pesquisar" }));

    await waitFor(() => expect(mockFrom).toHaveBeenCalledWith("entregas"));
    expect(mockEntregasBuilder.eq).toHaveBeenCalledWith("order_number", 42);
    // no created_at/date scoping applied when only the order number is searched
    expect(mockEntregasBuilder.gte).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.getByText(/1 entrega encontrada/i)).toBeInTheDocument());
  });

  it("filters by scheduled_date, not delivered_at, so pending deliveries can be found too", async () => {
    const { container } = render(<PesquisarEntregaDialog entregadores={[]} />);
    openDialog();

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-09-09" } });
    fireEvent.click(screen.getByRole("button", { name: "Pesquisar" }));

    await waitFor(() => expect(mockEntregasBuilder.eq).toHaveBeenCalledWith("scheduled_date", "2026-09-09"));
    expect(mockEntregasBuilder.gte).not.toHaveBeenCalled();
    expect(mockEntregasBuilder.lte).not.toHaveBeenCalled();
  });

  it("closes the cliente dropdown when clicking outside it", async () => {
    render(<PesquisarEntregaDialog entregadores={[]} />);
    openDialog();
    await waitFor(() => expect(mockFrom).toHaveBeenCalledWith("clientes"));

    fireEvent.change(screen.getByPlaceholderText(/digite o nome do cliente/i), { target: { value: "Pad" } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
