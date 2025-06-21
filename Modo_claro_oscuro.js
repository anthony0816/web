function getCSSCustomProperties() {
  const cssVariables = {};
  const sheets = document.styleSheets;

  // Recorrer todas las hojas de estilo
  Array.from(sheets).forEach(sheet => {
    try {
      // Recorrer todas las reglas CSS
      Array.from(sheet.cssRules || []).forEach(rule => {
        if (rule.selectorText === ':root') {
          // Extraer el contenido de :root
          const cssText = rule.style.cssText;
          // Buscar variables CSS (--nombre)
          cssText.split(';').forEach(prop => {
            const [name, value] = prop.split(':');
            if (name?.trim().startsWith('--')) {
              cssVariables[name.trim()] = value?.trim();
            }
          });
        }
      });
    } catch (e) {
      // Ignorar errores de CORS (hojas de estilo externas sin permisos)
    }
  });

  return cssVariables;
}

function CambiarColor(){
    const cssVariables = getCSSCustomProperties()
    console.log("cssVariables", cssVariables)
    const body = document.getElementsByTagName('body')[0]
    console.log("color",body.style.backgroundColor)
    if (body.style.backgroundColor === "rgb(249, 249, 249)"){
        body.style.backgroundColor = "red"
    }

}

const  ajustes = document.getElementById("ajustes")
    ajustes.onclick = ()=>{
        CambiarColor()
    }
