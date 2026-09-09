/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- loosely-typed local mock of the Select primitive, requiring react inside the jest.mock factory */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { updateCliente } from "../../actions";
import { ClienteEditForm } from "../cliente-edit-form";

jest.mock("../../actions", () => ({ updateCliente: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
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

const mockedUpdateCliente = updateCliente as jest.Mock;

const cliente = { id: "cli-1", name: "Ana Cliente", active: true };

describe("ClienteEditForm", () => {
  afterEach(() => jest.resetAllMocks());

  it("pre-fills the name and status from the cliente prop", () => {
    render(<ClienteEditForm cliente={cliente} onSaved={jest.fn()} />);

    expect(screen.getByLabelText(/nome/i)).toHaveValue("Ana Cliente");
    expect(screen.getByRole("option", { name: "Ativo" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("calls onCancel when the cancel button is clicked", () => {
    const onCancel = jest.fn();
    render(<ClienteEditForm cliente={cliente} onSaved={jest.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("hides the cancel button when onCancel is not provided", () => {
    render(<ClienteEditForm cliente={cliente} onSaved={jest.fn()} />);
    expect(screen.queryByRole("button", { name: /cancelar/i })).not.toBeInTheDocument();
  });

  it("submits the edited name and active status, then shows a success toast", async () => {
    mockedUpdateCliente.mockResolvedValue({});
    const onSaved = jest.fn();
    render(<ClienteEditForm cliente={cliente} onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "Ana Editada" } });
    fireEvent.click(screen.getByRole("option", { name: "Inativo" }));
    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => expect(mockedUpdateCliente).toHaveBeenCalledTimes(1));
    expect(mockedUpdateCliente.mock.calls[0][0]).toBe("cli-1");
    const fd = mockedUpdateCliente.mock.calls[0][1] as FormData;
    expect(fd.get("name")).toBe("Ana Editada");
    expect(fd.get("active")).toBe("false");

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Cliente atualizado!"));
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it("shows a loading label while the request is pending", async () => {
    let resolveUpdate!: () => void;
    mockedUpdateCliente.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      })
    );
    render(<ClienteEditForm cliente={cliente} onSaved={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    const pendingButton = await screen.findByRole("button", { name: "Salvando..." });
    expect(pendingButton).toBeDisabled();

    resolveUpdate();
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it("shows an error toast and does not call onSaved when the update fails", async () => {
    mockedUpdateCliente.mockRejectedValue(new Error("nome inválido"));
    const onSaved = jest.fn();
    render(<ClienteEditForm cliente={cliente} onSaved={onSaved} />);

    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar cliente", {
        description: "nome inválido",
      })
    );
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /salvar alterações/i })).not.toBeDisabled();
  });
});
