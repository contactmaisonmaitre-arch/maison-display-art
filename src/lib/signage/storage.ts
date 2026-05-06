export const safeGetStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Certains navigateurs TV bloquent localStorage : on continue sans faire planter l'écran.
  }
};
