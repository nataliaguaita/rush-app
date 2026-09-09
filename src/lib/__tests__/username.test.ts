import {
  normalizeUsername,
  isValidUsername,
  usernameToSyntheticEmail,
  USERNAME_PATTERN,
} from "../username";

describe("normalizeUsername", () => {
  it("trims and lowercases", () => {
    expect(normalizeUsername("  JoaoSilva  ")).toBe("joaosilva");
  });

  it("returns empty string unchanged", () => {
    expect(normalizeUsername("")).toBe("");
  });
});

describe("isValidUsername", () => {
  it.each([
    "abc",
    "joao.silva",
    "joao_silva",
    "joao-silva",
    "a".repeat(30),
    "user123",
  ])("accepts valid username %s", (username) => {
    expect(isValidUsername(username)).toBe(true);
  });

  it.each([
    "ab", // too short
    "a".repeat(31), // too long
    "Joao", // uppercase
    "joao silva", // space
    "joao@silva", // invalid char
    "",
  ])("rejects invalid username %p", (username) => {
    expect(isValidUsername(username)).toBe(false);
  });

  it("stays in sync with USERNAME_PATTERN", () => {
    expect(isValidUsername("valid-user")).toBe(
      USERNAME_PATTERN.test("valid-user")
    );
  });
});

describe("usernameToSyntheticEmail", () => {
  it("appends the synthetic domain", () => {
    expect(usernameToSyntheticEmail("joaosilva")).toBe(
      "joaosilva@rushapp.local"
    );
  });

  it("does not normalize the input", () => {
    expect(usernameToSyntheticEmail("Joao")).toBe("Joao@rushapp.local");
  });
});
