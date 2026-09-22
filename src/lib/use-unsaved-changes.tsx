"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function serialize(form: HTMLFormElement) {
  return [...new FormData(form)]
    .map(([k, v]) => `${k}=${typeof v === "string" ? v : v.name}`)
    .join("&");
}

// Avisa antes de perder um formulário alterado:
// - guard(fn): envolve fechar modal / Cancelar / Voltar -> card de confirmação
// - clique em links ou em botões com data-voltar -> card de confirmação
// - fechar/recarregar a aba -> aviso nativo do navegador (não dá pra personalizar)
// Uso: <form ref={formRef}> e renderizar {dialog} dentro do form ou do DialogContent.
export function useUnsavedChanges() {
  const router = useRouter();
  const formEl = useRef<HTMLFormElement | null>(null);
  const initial = useRef<string | null>(null);
  const [pending, setPending] = useState<(() => void) | null>(null);

  const isDirty = useCallback(
    () =>
      formEl.current !== null &&
      initial.current !== null &&
      serialize(formEl.current) !== initial.current,
    []
  );

  // O "antes" é fotografado na primeira interação, então valores preenchidos
  // por efeitos ao carregar a tela não contam como alteração.
  const formRef = useCallback((form: HTMLFormElement | null) => {
    formEl.current = form;
    initial.current = null;
    if (!form) return;
    const snap = () => {
      initial.current ??= serialize(form);
    };
    for (const ev of ["focusin", "pointerdown", "keydown"]) {
      form.addEventListener(ev, snap, { capture: true, once: true });
    }
  }, []);

  const guard = useCallback(
    (action: () => void) => {
      if (isDirty()) setPending(() => action);
      else action();
    },
    [isDirty]
  );

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty()) return;
      e.preventDefault();
      e.returnValue = "";
    }
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element).closest?.("a[href], [data-voltar]");
      if (!el || !isDirty()) return;
      // Botões "Voltar" do cabeçalho (router.back) marcados com data-voltar
      if (!(el instanceof HTMLAnchorElement)) {
        e.preventDefault();
        e.stopPropagation();
        setPending(() => () => router.back());
        return;
      }
      if (el.target === "_blank" || el.hasAttribute("download")) return;
      e.preventDefault();
      e.stopPropagation();
      const url = new URL(el.href);
      setPending(() => () => {
        if (url.origin === location.origin) router.push(url.pathname + url.search + url.hash);
        else location.assign(url);
      });
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("click", onClick, true);
    };
  }, [isDirty, router]);

  const dialog = (
    <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair sem salvar?</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem alterações que ainda não foram salvas. Se sair agora, tudo o que foi
            preenchido ou alterado será perdido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar editando</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              initial.current = null;
              pending?.();
            }}
          >
            Sair sem salvar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { formRef, guard, dialog };
}
