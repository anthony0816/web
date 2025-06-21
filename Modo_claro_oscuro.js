function getCssObjects(){
  const styles_css = Array.from(document.styleSheets)[1]
  console.log("hoja de estilo", styles_css)
}

function getCSSCustomProperties() {
  const cssVariables = {};
  const sheets = document.styleSheets;
  console.log("sheets", Array.from(sheets))
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
    const cssObjetos = getCssObjects()
    console.log("cssVariables", cssVariables)
    const body = document.getElementsByTagName('body')[0]
    const header = document.getElementsByTagName("header")[0]
    const nav_continer = document.getElementsByClassName("nav_continer")[0]
    const nav = document.getElementsByTagName("nav")[0]
    const barraInferior = document.getElementsByClassName("barraInferior")[0]
    const modal_menu_album = document.getElementsByClassName("modal_menu_album")[0]
    
    if (body.classList.contains("modoClaro")){

      localStorage.setItem("tema", "oscuro") // guardar el tema 

      body.classList.remove("modoClaro")  
      body.style.backgroundColor = cssVariables["--dark_bodyColor"]
      body.style.color = cssVariables["--text_color"]
      header.style.backgroundColor = cssVariables["--dark_headerColor"]
      header.style.color = cssVariables["--dark_header_textColor"]
      nav_continer.style.backgroundColor = cssVariables["--dark_nav_continer_color"]
      nav.style.backgroundColor = cssVariables["--dark_navColor"]
      nav.style.color = cssVariables["--dark_nav_textColor"]
      barraInferior.style.backgroundColor = cssVariables["--dark_barrainferiorColor"]
      barraInferior.style.color = cssVariables["--dark_barrainferior_textColor"]
      modal_menu_album.style.backgroundColor = cssVariables["--dark_modal_menu_album_Color"]

    }else{

      localStorage.setItem("tema", "claro") // guardar el tema 

      body.classList.add("modoClaro")
      body.style.backgroundColor = cssVariables["--bodyColor"]
      body.style.color = cssVariables["--dark_text_color"]
      header.style.backgroundColor = cssVariables["--headerColor"]
      header.style.color = cssVariables["--header_textColor"]
      nav_continer.style.backgroundColor = cssVariables["--nav_continer_color"]
      nav.style.backgroundColor = cssVariables["--navColor"]
      nav.style.color = cssVariables["--nav_textColor"]
      barraInferior.style.backgroundColor = cssVariables["--barrainferiorColor"]
      barraInferior.style.color = cssVariables["--barrainferior_textColor"]
      modal_menu_album.style.backgroundColor = cssVariables["--modal_menu_album_Color"]
    }

}

const  ajustes = document.getElementById("ajustes")
    ajustes.onclick = ()=>{
        CambiarColor()
    }
