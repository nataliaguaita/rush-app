/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- loosely-typed local mock of the Dialog primitive, requiring react inside the jest.mock factory */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { toast } from "sonner";
import { useCep } from "@/lib/use-cep";
import { createLocal, updateLocal } from "../actions";
import { LocalDialog } from "../local-dialog";
import type { LocalFrequente } from "@/types/database";

jest.mock("../actions", () => ({
  createLocal: jest.fn(),
  updateLocal: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/lib/use-cep", () => ({ useCep: jest.fn() }));

// Local mock: the real Dialog is a Base UI portal+positioner component that
// is extremely slow to settle in jsdom (no real layout engine). This
// stand-in keeps the same open/onOpenChange contract without the overhead.
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
  return {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader: Passthrough,
    DialogTitle: Passthrough,
    DialogDescription: Passthrough,
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

const mockedCreateLocal = createLocal as jest.Mock;
const mockedUpdateLocal = updateLocal as jest.Mock;
const mockedUseCep = useCep as jest.Mock;

let fetchCep: jest.Mock;
let cepOnResult: (data: { rua: string; bairro: string; cidade: string }) => void;

function setupUseCep() {
  fetchCep = jest.fn();
  mockedUseCep.mockImplementation((onResult) => {
    cepOnResult = onResult;
    return { fetchCep, loading: false, filled: false };
  });
}

// Only "Nome" has a real htmlFor/id pairing in the markup; the rest of the
// address fields are unlabeled inputs identified here by their `name`.
function field(name: string): HTMLInputElement {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
}

function fillRequired({ withNumero = "100" as string | undefined } = {}) {
  fireEvent.change(screen.getByLabelText(/nome \*/i), { target: { value: "Curso X" } });
  fireEvent.change(field("rua"), { target: { value: "Rua das Flores" } });
  if (withNumero) {
    fireEvent.change(field("numero"), { target: { value: withNumero } });
  }
  fireEvent.change(field("cidade"), { target: { value: "Curitiba" } });
}

describe("LocalDialog (create mode)", () => {
  beforeEach(() => setupUseCep());
  afterEach(() => jest.resetAllMocks());

  it("shows the create trigger and opens the form", () => {
    render(<LocalDialog onSaved={jest.fn()} />);
    expect(screen.getByRole("button", { name: /novo endereço fixo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));
    expect(screen.getByText("Novo Endereço Fixo", { selector: "*" })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome \*/i)).toBeInTheDocument();
  });

  it("closes on cancel without saving", () => {
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
    expect(mockedCreateLocal).not.toHaveBeenCalled();
  });

  it("calls fetchCep as the CEP field is typed", () => {
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));

    fireEvent.change(screen.getByPlaceholderText("00000-000"), {
      target: { value: "80230-130" },
    });

    expect(fetchCep).toHaveBeenCalledWith("80230-130");
  });

  it("autofills rua/bairro/cidade when the CEP lookup resolves", () => {
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));

    act(() => cepOnResult({ rua: "Rua Nova", bairro: "Centro", cidade: "Curitiba" }));

    expect(field("rua")).toHaveValue("Rua Nova");
    expect(field("bairro")).toHaveValue("Centro");
    expect(field("cidade")).toHaveValue("Curitiba");
  });

  it("marks the número field as S/N and disables it when 'Sem número' is checked", () => {
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));

    fireEvent.click(screen.getByRole("checkbox", { name: /sem número/i }));

    const numeroField = screen.getByPlaceholderText("S/N");
    expect(numeroField).toBeDisabled();
  });

  it("submits the create payload and shows a success toast", async () => {
    mockedCreateLocal.mockResolvedValue({});
    const onSaved = jest.fn();
    render(<LocalDialog onSaved={onSaved} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));
    fillRequired();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(mockedCreateLocal).toHaveBeenCalledTimes(1));
    const fd = mockedCreateLocal.mock.calls[0][0] as FormData;
    expect(fd.get("name")).toBe("Curso X");
    expect(fd.get("rua")).toBe("Rua das Flores");
    expect(fd.get("numero")).toBe("100");
    expect(fd.get("cidade")).toBe("Curitiba");

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Local cadastrado!"));
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
  });

  it("submits numero as S/N when the checkbox is used", async () => {
    mockedCreateLocal.mockResolvedValue({});
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /sem número/i }));
    fillRequired({ withNumero: undefined });

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(mockedCreateLocal).toHaveBeenCalledTimes(1));
    const fd = mockedCreateLocal.mock.calls[0][0] as FormData;
    expect(fd.get("numero")).toBe("S/N");
  });

  it("shows an error toast and keeps the dialog open when creation fails", async () => {
    mockedCreateLocal.mockRejectedValue(new Error("CEP inválido"));
    render(<LocalDialog onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /novo endereço fixo/i }));
    fillRequired();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao cadastrar local", {
        description: "CEP inválido",
      })
    );
    expect(screen.getByLabelText(/nome \*/i)).toBeInTheDocument();
  });
});

describe("LocalDialog (edit mode)", () => {
  const local: LocalFrequente = {
    id: "loc-1",
    name: "Curso Antigo",
    rua: "Rua Velha",
    numero: "50",
    complemento: null,
    bairro: "Bairro Antigo",
    cidade: "Curitiba",
    cep: "80000-000",
    lat: null,
    lng: null,
    active: true,
    created_at: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(() => setupUseCep());
  afterEach(() => jest.resetAllMocks());

  it("shows the edit trigger and pre-fills the form", () => {
    render(<LocalDialog local={local} onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^editar$/i }));

    expect(screen.getByLabelText(/nome \*/i)).toHaveValue("Curso Antigo");
    expect(field("rua")).toHaveValue("Rua Velha");
    expect(field("cidade")).toHaveValue("Curitiba");
    expect(screen.getByRole("checkbox", { name: /^ativo$/i })).toBeChecked();
  });

  it("submits an update with the local id and shows a success toast", async () => {
    mockedUpdateLocal.mockResolvedValue({});
    render(<LocalDialog local={local} onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^editar$/i }));

    fireEvent.change(screen.getByLabelText(/nome \*/i), { target: { value: "Curso Renomeado" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(mockedUpdateLocal).toHaveBeenCalledTimes(1));
    expect(mockedUpdateLocal.mock.calls[0][0]).toBe("loc-1");
    const fd = mockedUpdateLocal.mock.calls[0][1] as FormData;
    expect(fd.get("name")).toBe("Curso Renomeado");

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Local atualizado!"));
  });

  it("unchecking 'Ativo' sends active=false", async () => {
    mockedUpdateLocal.mockResolvedValue({});
    render(<LocalDialog local={local} onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^editar$/i }));

    fireEvent.click(screen.getByRole("checkbox", { name: /^ativo$/i }));
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(mockedUpdateLocal).toHaveBeenCalledTimes(1));
    const fd = mockedUpdateLocal.mock.calls[0][1] as FormData;
    expect(fd.get("active")).toBe("false");
  });

  it("shows an error toast scoped to update failures", async () => {
    mockedUpdateLocal.mockRejectedValue(new Error("falha ao salvar"));
    render(<LocalDialog local={local} onSaved={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^editar$/i }));

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar local", {
        description: "falha ao salvar",
      })
    );
  });
});
