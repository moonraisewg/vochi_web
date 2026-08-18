/** Định dạng tiền VND kiểu Việt Nam: dấu chấm ngăn nghìn, hậu tố "đ". */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}
