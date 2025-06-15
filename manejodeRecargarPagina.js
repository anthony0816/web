window.addEventListener('beforeunload', (event) => {
  event.preventDefault(); // No funciona en todos los navegadores
  event.returnValue = '¿Estás seguro? Los cambios no guardados se perderán.';
  return event.returnValue;
});