let expiryTimer = null;
let isHandlingExpiry = false;

export const clearExpiryTimer = () => {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
};

export const handleSessionExpired = () => {
  // Hindari alert berulang jika beberapa request gagal bersamaan.
  if (isHandlingExpiry) return;

  isHandlingExpiry = true;
  clearExpiryTimer();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.alert("Sesi login telah berakhir. Silakan login kembali.");

  window.location.replace("/login");
};

export const scheduleTokenExpiry = (token) => {
  clearExpiryTimer();
  isHandlingExpiry = false;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (!payload.exp) {
      handleSessionExpired();
      return;
    }

    const expiresAt = payload.exp * 1000;
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      handleSessionExpired();
      return;
    }

    expiryTimer = setTimeout(() => {
      handleSessionExpired();
    }, remaining);
  } catch (error) {
    handleSessionExpired();
  }
};
