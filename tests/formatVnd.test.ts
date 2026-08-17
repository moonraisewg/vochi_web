import { describe, expect, it } from "vitest";
import { formatVnd } from "../lib/formatVnd";

describe("formatVnd", () => {
  it("thêm dấu chấm ngăn nghìn và hậu tố đ", () => {
    expect(formatVnd(59_000)).toBe("59.000đ");
    expect(formatVnd(599_000)).toBe("599.000đ");
  });

  it("xử lý số dưới 1000", () => {
    expect(formatVnd(0)).toBe("0đ");
    expect(formatVnd(500)).toBe("500đ");
  });
});
