const BotonAlbums = document.getElementById("open_album_folder");
BotonAlbums.onclick = () => {
  DesplegarAlbumMoviles();
};

const ocultarMenu = document.getElementsByClassName("albumDown")[0];
ocultarMenu.onclick = () => {
  OcultarAlbumMoviles();
};

// Desplegar el menu
function DesplegarAlbumMoviles() {
  const Menu = document.getElementsByClassName("modal_menu_album")[0];
  const overlay = document.getElementsByClassName("overlay")[0];
  const body = document.getElementsByTagName("body")[0];
  Menu.classList.add("desplegarMenu");
  overlay.classList.add("modificarOverlay");
  overlay.style.display = "block";
  body.style.overflow = "hidden";

  // funcionalida de clik para ocultar en el overlay
  overlay.onclick = () => {
    OcultarAlbumMoviles();
  };
}
// ocultarlo
export function OcultarAlbumMoviles() {
  const Menu = document.getElementsByClassName("modal_menu_album")[0];
  const overlay = document.getElementsByClassName("overlay")[0];
  const body = document.getElementsByTagName("body")[0];

  Menu.classList.remove("desplegarMenu");
  overlay.classList.remove("modificarOverlay");
  overlay.style.display = "none";
  document.body.overflow = "auto";
  body.style.overflow = "auto";

  // es necesario quitar el evento on clik del overlay
  // funcionalida de clik para ocultar en el overlay
  overlay.onclick = () => {
    return;
  };
}


window.addEventListener('resize', function(){
  if(window.innerWidth >= 700 ){
    const overlay = document.getElementsByClassName("overlay")[0];
      overlay.style.display = "none";
      overlay.onclick = ()=>{
        return
      }
      OcultarAlbumMoviles()
  }
})