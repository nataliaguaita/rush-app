import {
  getStatusMeta,
  formatOrderNumber,
  formatScheduledDate,
  STATUS_META,
} from "../status";

describe("getStatusMeta", () => {
  it("returns metadata for a known status", () => {
    expect(getStatusMeta("entregue")).toEqual(STATUS_META.entregue);
  });

  it("falls back to a generic label for an unknown status", () => {
    expect(getStatusMeta("estado_inexistente")).toEqual({
      label: "estado_inexistente",
      className: "bg-muted text-muted-foreground",
    });
  });
});

describe("formatOrderNumber", () => {
  it("pads small numbers to 4 digits", () => {
    expect(formatOrderNumber(7)).toBe("#0007");
  });

  it("does not truncate numbers longer than 4 digits", () => {
    expect(formatOrderNumber(123456)).toBe("#123456");
  });

  it("handles zero", () => {
    expect(formatOrderNumber(0)).toBe("#0000");
  });
});

describe("formatScheduledDate", () => {
  function isoDateOffset(days: number): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  it('labels today as "Entregar Hoje"', () => {
    expect(formatScheduledDate(isoDateOffset(0))).toBe("Entregar Hoje");
  });

  it('labels tomorrow as "Entregar Amanhã"', () => {
    expect(formatScheduledDate(isoDateOffset(1))).toBe("Entregar Amanhã");
  });

  it("formats dates further in the future as a localized date", () => {
    const target = isoDateOffset(5);
    const expected = new Date(target + "T00:00:00").toLocaleDateString(
      "pt-BR"
    );
    expect(formatScheduledDate(target)).toBe(`Entregar em ${expected}`);
  });

  it("formats past dates as a localized date instead of a relative label", () => {
    const target = isoDateOffset(-3);
    const expected = new Date(target + "T00:00:00").toLocaleDateString(
      "pt-BR"
    );
    expect(formatScheduledDate(target)).toBe(`Entregar em ${expected}`);
  });
});
