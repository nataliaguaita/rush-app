/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports -- loosely-typed local mocks of the Dialog/Select primitives, requiring react inside the jest.mock factories */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { createUser } from "../actions";
import { CadastroDialog } from "../cadastro-dialog";

jest.mock("../actions", () => ({ createUser: jest.fn() }));
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

// Local mock: the real Dialog/Select are Base UI portal+positioner components
// that are extremely slow to settle in jsdom (no real layout engine). These
// stand-ins keep the same public shape (open/onOpenChange, name/value/
// onValueChange, a hidden input for FormData) so the component under test
// still behaves like it does in the browser, without the vendor overhead.
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

const mockedCreateUser = createUser as jest.Mock;

function openDialog() {
  fireEvent.click(screen.getByRole("button", { name: /novo cadastro/i }));
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/nome \*/i), {
    target: { value: "Joao Silva" },
  });
  fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
    target: { value: "joao.silva" },
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: "segredo123" },
  });
}

describe("CadastroDialog", () => {
  afterEach(() => jest.resetAllMocks());

  it("does not render the form until the trigger is clicked", () => {
    render(<CadastroDialog />);
    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
  });

  it("opens the form on trigger click and closes on cancel", () => {
    render(<CadastroDialog />);
    openDialog();
    expect(screen.getByLabelText(/nome \*/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    const { container } = render(<CadastroDialog />);
    openDialog();

    const password = screen.getByLabelText(/senha/i) as HTMLInputElement;
    expect(password.type).toBe("password");

    const toggle = container.querySelector('button[tabindex="-1"]') as HTMLButtonElement;
    fireEvent.click(toggle);
    expect(password.type).toBe("text");

    fireEvent.click(toggle);
    expect(password.type).toBe("password");
  });

  it("switches the role via the select before submitting", async () => {
    mockedCreateUser.mockResolvedValue({});
    render(<CadastroDialog />);
    openDialog();
    fillRequiredFields();

    fireEvent.click(screen.getByRole("option", { name: "Entregador" }));
    fireEvent.click(screen.getByRole("button", { name: "Criar" }));

    await waitFor(() => expect(mockedCreateUser).toHaveBeenCalledTimes(1));
    const submittedData = mockedCreateUser.mock.calls[0][0] as FormData;
    expect(submittedData.get("role")).toBe("entregador");
  });

  it("submits the form data and shows a success toast", async () => {
    mockedCreateUser.mockResolvedValue({});
    const onCreated = jest.fn();
    render(<CadastroDialog onCreated={onCreated} />);
    openDialog();
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Criar" }));

    await waitFor(() => expect(mockedCreateUser).toHaveBeenCalledTimes(1));
    const submittedData = mockedCreateUser.mock.calls[0][0] as FormData;
    expect(submittedData.get("name")).toBe("Joao Silva");
    expect(submittedData.get("username")).toBe("joao.silva");
    expect(submittedData.get("password")).toBe("segredo123");
    expect(submittedData.get("role")).toBe("vendedor");

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Usuário criado com sucesso!"));
    expect(onCreated).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
  });

  it("shows an error toast and keeps the dialog open when creation fails", async () => {
    mockedCreateUser.mockResolvedValue({ error: "username já existe" });
    render(<CadastroDialog />);
    openDialog();
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Criar" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar usuário", {
        description: "username já existe",
      })
    );
    expect(screen.getByLabelText(/nome \*/i)).toBeInTheDocument();
  });

  it("recovers cleanly after a slow request eventually resolves", async () => {
    let resolveCreate!: (value: { error?: string }) => void;
    mockedCreateUser.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );
    render(<CadastroDialog />);
    openDialog();
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: "Criar" }));
    expect(mockedCreateUser).toHaveBeenCalledTimes(1);

    resolveCreate({});
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(screen.queryByLabelText(/nome \*/i)).not.toBeInTheDocument();
  });
});
