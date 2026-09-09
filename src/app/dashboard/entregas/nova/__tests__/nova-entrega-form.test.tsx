/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- loosely-typed local mock of the Select primitive, requiring react inside the jest.mock factory */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { createEntrega } from "../../actions";
import { NovaEntregaForm } from "../nova-entrega-form";
import type { ClienteWithEnderecos } from "@/types/database";
import type { OpenGroup } from "../page";

jest.mock("../../actions", () => ({ createEntrega: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/lib/use-cep", () => ({
  useCep: () => ({ fetchCep: jest.fn(), loading: false, filled: false }),
}));

// Local mock: the real Select is a Base UI portal+positioner component that
// is extremely slow to settle in jsdom. This stand-in keeps the same
// name/value/onValueChange contract (plus a hidden input for FormData)
// without the vendor overhead.
jest.mock("@/components/ui/select", () => {
  const React = require("react");
  const SelectCtx = React.createContext(null);
  function Select({ name, value, defaultValue, onValueChange, children }: any) {
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const current = value !== undefined ? value : internal;
    function handleSelect(v: string) {
      if (value === undefined) setInternal(v);
      onValueChange?.(v);
    }
    return React.createElement(
      SelectCtx.Provider,
      { value: { current, handleSelect } },
      name ? React.createElement("input", { type: "hidden", name, value: current }) : null,
      children
    );
  }
  const Passthrough = ({ children }: any) => children ?? null;
  function SelectItem({ value, children }: any) {
    const ctx = React.useContext(SelectCtx);
    return React.createElement(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": ctx.current === value,
        onClick: () => ctx.handleSelect(value),
      },
      children
    );
  }
  return {
    Select,
    SelectTrigger: Passthrough,
    SelectValue: Passthrough,
    SelectContent: Passthrough,
    SelectItem,
  };
});

// jsdom has no PointerEvent constructor; Base UI's Checkbox needs one to
// process clicks. Polyfill it as a thin MouseEvent subclass for this file.
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    constructor(type: string, params: MouseEventInit = {}) {
      super(type, params);
    }
  }
  // @ts-expect-error jsdom polyfill
  window.PointerEvent = PointerEventPolyfill;
}

const mockedCreateEntrega = createEntrega as jest.Mock;

function field(name: string): HTMLInputElement {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
}

const clienteComEndereco: ClienteWithEnderecos = {
  id: "c1",
  name: "Ana Cliente",
  phone: null,
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  enderecos: [
    {
      id: "e1",
      cliente_id: "c1",
      label: "Casa",
      rua: "Rua A",
      numero: "10",
      complemento: null,
      bairro: "Centro",
      cidade: "Curitiba",
      cep: null,
      lat: null,
      lng: null,
      active: true,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
};

const clienteSemEndereco: ClienteWithEnderecos = {
  id: "c2",
  name: "Bruno Sem Endereço",
  phone: null,
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  enderecos: [],
};

const clientes = [clienteComEndereco, clienteSemEndereco];

function selectCliente(name: string) {
  const search = screen.getByPlaceholderText(/digite o nome do cliente/i);
  fireEvent.change(search, { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name }));
}

describe("NovaEntregaForm", () => {
  afterEach(() => jest.resetAllMocks());

  it("shows a 'no results' message when the cliente search has no match", () => {
    render(<NovaEntregaForm clientes={clientes} />);
    const search = screen.getByPlaceholderText(/digite o nome do cliente/i);

    fireEvent.change(search, { target: { value: "Zzz Ninguém" } });

    expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
  });

  it("selects a cliente from the dropdown and shows the address select", () => {
    render(<NovaEntregaForm clientes={clientes} />);

    selectCliente("Ana Cliente");

    expect(field("cliente_id")).toHaveValue("c1");
    expect(screen.getByText(/endereço de entrega/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /rua a, 10/i })).toBeInTheDocument();
  });

  it("warns and links to the cliente page when there are no addresses", () => {
    render(<NovaEntregaForm clientes={clientes} />);

    selectCliente("Bruno Sem Endereço");

    expect(
      screen.getByText(/este cliente não possui endereços cadastrados/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /adicionar endereço/i })).toHaveAttribute(
      "href",
      "/dashboard/clientes/c2"
    );
  });

  it("switches to a custom address and requires its fields", () => {
    render(<NovaEntregaForm clientes={clientes} />);
    selectCliente("Ana Cliente");

    fireEvent.click(screen.getByRole("button", { name: /usar outro endereço/i }));

    expect(field("custom_rua")).toBeRequired();
    expect(field("custom_cidade")).toBeRequired();
    expect(field("custom_numero")).toBeRequired();
  });

  it("marks the custom numero as not required once 'Sem número' is checked", () => {
    render(<NovaEntregaForm clientes={clientes} />);
    selectCliente("Ana Cliente");
    fireEvent.click(screen.getByRole("button", { name: /usar outro endereço/i }));

    fireEvent.click(screen.getByRole("checkbox", { name: /sem número/i }));

    expect(field("custom_numero")).toBeDisabled();
    expect(field("custom_numero")).not.toBeRequired();
  });

  it("formats the valor field to two decimals on blur", () => {
    render(<NovaEntregaForm clientes={clientes} />);
    const valor = screen.getByPlaceholderText("0,00");

    fireEvent.change(valor, { target: { value: "1500,5" } });
    fireEvent.blur(valor);

    expect(valor).toHaveValue("1.500,50");
  });

  it("clears an unparsable valor on blur", () => {
    render(<NovaEntregaForm clientes={clientes} />);
    const valor = screen.getByPlaceholderText("0,00");

    fireEvent.change(valor, { target: { value: "," } });
    fireEvent.blur(valor);

    expect(valor).toHaveValue("");
  });

  it("keeps only one of the mutually exclusive delivery-action checkboxes checked", () => {
    render(<NovaEntregaForm clientes={clientes} />);

    const receber = screen.getByRole("checkbox", { name: "Receber" });
    const assinar = screen.getByRole("checkbox", { name: "Assinar Nota" });

    fireEvent.click(receber);
    expect(receber).toBeChecked();

    fireEvent.click(assinar);
    expect(assinar).toBeChecked();
    expect(receber).not.toBeChecked();
  });

  it("reveals the return notes textarea when the return reminder is checked", () => {
    render(<NovaEntregaForm clientes={clientes} />);

    expect(screen.queryByLabelText(/o que deve ser pego de devolução/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: /lembrete de devolução/i }));

    expect(screen.getByLabelText(/o que deve ser pego de devolução/i)).toBeInTheDocument();
  });

  it("links the entrega to an open group and swaps in its endereco", () => {
    const openGroups: OpenGroup[] = [
      { groupId: "g1", enderecoId: "e5", label: "Grupo do curso X", count: 3 },
    ];
    render(<NovaEntregaForm clientes={clientes} openGroups={openGroups} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "g1" } });

    expect(field("group_id")).toHaveValue("g1");
    expect(field("endereco_id")).toHaveValue("e5");
  });

  it("submits the form and shows a success toast", async () => {
    mockedCreateEntrega.mockResolvedValue(undefined);
    render(<NovaEntregaForm clientes={clientes} />);

    selectCliente("Ana Cliente");
    fireEvent.click(screen.getByRole("option", { name: /rua a, 10/i }));
    fireEvent.change(screen.getByPlaceholderText("0,00"), { target: { value: "50,00" } });

    fireEvent.click(screen.getByRole("button", { name: /finalizar cadastro/i }));

    await waitFor(() => expect(mockedCreateEntrega).toHaveBeenCalledTimes(1));
    const fd = mockedCreateEntrega.mock.calls[0][0] as FormData;
    expect(fd.get("cliente_id")).toBe("c1");
    expect(fd.get("endereco_id")).toBe("e1");
    expect(fd.get("valor")).toBe("50.00");
    expect(fd.getAll("actions")).toContain("entregar");

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Entrega cadastrada!"));
  });

  it("shows an error toast when creation fails", async () => {
    mockedCreateEntrega.mockRejectedValue(new Error("cliente inválido"));
    render(<NovaEntregaForm clientes={clientes} />);

    selectCliente("Ana Cliente");
    fireEvent.click(screen.getByRole("option", { name: /rua a, 10/i }));
    fireEvent.click(screen.getByRole("button", { name: /finalizar cadastro/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar entrega", {
        description: "cliente inválido",
      })
    );
  });
});
