function getCSSCustomProperties(rootElement = document.documentElement) {
  const styles = getComputedStyle(rootElement);
  const cssVariables = {};

  // Método compatible con todos los navegadores
  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i];
    if (prop.startsWith('--')) {
      cssVariables[prop] = styles.getPropertyValue(prop).trim();
    }
  }

  return cssVariables;
}

// Uso con timeout para asegurar carga (solo para pruebas)
setTimeout(() => {
  const cssVars = getCSSCustomProperties();
  console.log('Variables encontradas:', cssVars);
}, 100);