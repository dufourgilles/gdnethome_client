// @ts-nocheck
export const toastr = {
  success(title, message) {
    console.info(title, message || "");
  },
  error(title, message) {
    console.error(title, message || "");
  },
  warning(title, message) {
    console.warn(title, message || "");
  },
  info(title, message) {
    console.info(title, message || "");
  }
};
