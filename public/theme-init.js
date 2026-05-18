try {
  const saved = localStorage.getItem('erp-theme');
  if (saved) {
    const theme = JSON.parse(saved);
    const root = document.documentElement;
    if (theme.vars) {
      Object.entries(theme.vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }
} catch (e) {
  console.error('Theme init error:', e);
}
