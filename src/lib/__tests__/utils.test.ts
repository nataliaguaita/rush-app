import { cn, toTitleCase } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes, keeping the last", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
});

describe("toTitleCase", () => {
  it("capitalizes each word", () => {
    expect(toTitleCase("joao silva")).toBe("Joao Silva");
  });

  it("keeps connector words lowercase mid-string", () => {
    expect(toTitleCase("joao da silva")).toBe("Joao da Silva");
  });

  it("capitalizes a connector word when it is the first word", () => {
    expect(toTitleCase("de souza")).toBe("De Souza");
  });

  it("normalizes mixed casing and surrounding whitespace", () => {
    expect(toTitleCase("  JOAO DA SILVA DOS SANTOS  ")).toBe(
      "Joao da Silva dos Santos"
    );
  });

  it("returns an empty string unchanged", () => {
    expect(toTitleCase("")).toBe("");
  });

  it("collapses double spaces without crashing on empty words", () => {
    expect(toTitleCase("joao  silva")).toBe("Joao  Silva");
  });
});
