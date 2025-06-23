export async function DisplayFromAlbum(StringAlbum) {
  if (!StringAlbum) {
    const galeria = document.getElementById("gallery");
    const paginas = Array.from(document.getElementsByClassName("gallery_page"));
    paginas.forEach((pg) => {
      pg.style.display = "none";
    });
    galeria.style.display = "grid";
    // if (galeria.classList.contains("already_load")) {
      //   return "ready";
      // }
      galeria.classList.add("already_load");
      asingDisplayClassOnlySelf(galeria)
    return galeria;
  } else {
    const Album = document.getElementById(StringAlbum);
    if (Album) {
      const paginas = Array.from(
        document.getElementsByClassName("gallery_page")
      );
      paginas.forEach((pg) => {
        pg.style.display = "none";
      });
      Album.style.display = "grid";
      asingDisplayClassOnlySelf(Album)
      return "ready";
    } else {
      const gallery_pages_continer = document.getElementsByClassName(
        "gallery_pages_continer"
      )[0];
      const newAlbum = document.createElement("div");
      newAlbum.id = StringAlbum;
      newAlbum.classList.add("gallery_page");
      gallery_pages_continer.appendChild(newAlbum);
      
      const paginas = Array.from(
        document.getElementsByClassName("gallery_page")
      );
      paginas.forEach((page) => {
        page.style.display = "none";
      });
      newAlbum.style.display = "grid";
      asingDisplayClassOnlySelf(newAlbum)
      return newAlbum;
    }
  }
}

function asingDisplayClassOnlySelf(element){

  // Esta funcion es para avisarle al metodo de Pasar imagenes una a una por cual galeria tiene que recorrer ya que se van cambiando 

  const onDisplayObjects = Array.from(document.getElementsByClassName("onDisplay"))
  if(!(onDisplayObjects)){
    element.classList.add("onDisplay")
  }else{
    onDisplayObjects.forEach((x)=>{
      x.classList.remove("onDisplay")
    })
    element.classList.add("onDisplay")
  }
}