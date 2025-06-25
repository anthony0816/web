import { extraerNumeros } from "./script.js";
import { supabase } from "./script.js";
import { ExpandirImagen } from "./script.js";
import { CerrarExpandirImg } from "./script.js";
import { CargarMasElementos } from "./script.js";
import { cambiarEstadoCheckbox } from "./script.js";
import { desmarcarCheckbox } from "./script.js";
import { albumOnClick } from "./modal_menu_album.js";
import { EliminarAlbum } from "./modal_menu_album.js";
import { limpiarTextoCompleto } from "./modal_menu_album.js";
import { DeleteFromTabla } from "./modal_menu_album.js";

export var idsActivos = [];

export function EliminarIdsActicos() {
  idsActivos = [];
}
//Expandir la barra de navegación
export function ExpandirNav(nav_expandir) {
  const botones = document.getElementsByClassName("botonesExpandir");
  const nav = document.getElementsByClassName("nav")[0];
  const ajustes = document.getElementsByClassName("ajustes")[0];
  if (nav_expandir.classList.contains("fa-plus")) {
    Array.from(botones).forEach((element) => {
      element.classList.add("fas");
    });
    nav_expandir.classList.remove("fa-plus");
    nav_expandir.classList.add("fa-xmark");
    nav_expandir.style.color = "#d81b60";
    ajustes.classList.add("ajustesAnimacion");
    nav.style.width = "80%";
  } else {
    Array.from(botones).forEach((element) => {
      element.classList.remove("fas");
    });
    nav_expandir.classList.add("fa-plus");
    nav_expandir.classList.remove("fa-xmark");
    nav_expandir.style.color = "black";
    ajustes.classList.remove("ajustesAnimacion");
    nav.style.width = "50%";
    desmarcarCheckbox();
  }
}

//Funcion para seleccionar
export function RecopilarIds(data, info) {
  if (info == "Cargar mas" || info == "cargarAlbum") {
    idsActivos.push(data.id);
    return;
  }
  if (info == "Cargada por el usuario") {
    console.log("ids activos", idsActivos);
    return;
  }

  return;
  if (info == "Cargada por el usuario") {
    data.forEach((element) => {
      idsActivos.unshift(element.id);
    });
    console.log("ids activos", idsActivos);
    return;
  }
  data.forEach((element) => {
    idsActivos.push(element.id);
  });
  console.log("ids activos", idsActivos);
}
// Función para seleccionar las fotos 1x1
export function Seleccionar(info) {
  const CheckbosHidden = document.getElementById("seleccionarEstado");
  const galeria = document.getElementsByClassName("onDisplay")[0];
  const galeriaHijos = Array.from(galeria.children);

  if (info == "fromCargarImagenes") {
    console.log("galeriaHijos:", galeriaHijos);

    galeriaHijos.forEach((imgDiv) => {
      const img = imgDiv.children[0];
      img.classList.add("transition");
      img.onclick = function () {
        if (this.classList.contains("selected")) {
          this.style.scale = "1";
          this.classList.remove("singleIMG_onSelect");
          this.classList.remove("selected");
          RemoveMarkSelected(imgDiv);
        } else {
          this.style.scale = "0.9";
          this.classList.add("singleIMG_onSelect");
          this.classList.add("selected");
          AddMarkSelected(imgDiv);
        }
      };
    });
    return; // se acabo
  }

  if (!CheckbosHidden.checked) {
    galeriaHijos.forEach((imgDiv) => {
      const img = imgDiv.children[0];
      img.classList.add("transition");
      img.onclick = function () {
        if (this.classList.contains("selected")) {
          this.style.scale = "1";
          this.classList.remove("singleIMG_onSelect");
          this.classList.remove("selected");
          RemoveMarkSelected(imgDiv);
        } else {
          this.style.scale = "0.9";
          this.classList.add("singleIMG_onSelect");
          this.classList.add("selected");
          AddMarkSelected(imgDiv);
        }
      };
    });

    // Ejecutar logica relacionada con los albunes para seleccionarlos
    const albums = Array.from(document.getElementsByClassName("album_item"));
    albums.forEach((al) => {
      al.onclick = () => {
        if (al.classList.contains("selected") == false) {
          al.classList.add("selected");
          al.classList.add("modal_nombre_album_selected");
        } else {
          al.classList.remove("selected");
          al.classList.remove("modal_nombre_album_selected");
        }
      };
    });
  } else if (CheckbosHidden.checked) {
    galeriaHijos.forEach((imgDiv) => {
      const img = imgDiv.children[0];
      img.style.scale = "1";
      img.classList.remove("singleIMG_onSelect");
      img.classList.remove("selected");
      RemoveMarkSelected(imgDiv);
      img.onclick = function () {
        return;
      };
    });
    // Ejecutar logica relacionada con los albunes para seleccionarlos
    const albums = Array.from(document.getElementsByClassName("album_item"));
    albums.forEach((al) => {
      al.classList.remove("selected");
      al.classList.remove("modal_nombre_album_selected");
      al.onclick = () => {
        albumOnClick(al);
      };
    });
  }
}

function AddMarkSelected(imgdiv) {
  const div = document.createElement("div");
  const counter = document.getElementsByClassName("selector_counter")[0];
  div.classList.add("singleIMG_count");
  div.textContent = "✔";
  imgdiv.appendChild(div);
  counter.style.display = "block";
  counter.children[0].textContent =
    " " + Array.from(document.getElementsByClassName("selected")).length;
}

function RemoveMarkSelected(imgdiv) {
  const div = imgdiv.querySelector(".singleIMG_count");
  const counter = document.getElementsByClassName("selector_counter")[0];
  if (Array.from(document.getElementsByClassName("selected")).length == 0) {
    counter.style.display = "none";
  } else {
    counter.children[0].textContent =
      " " + Array.from(document.getElementsByClassName("selected")).length;
  }
  if (div) div.remove();
}

export async function DeleteImg(elements, nav) {
  const modalNotificaciones = document.getElementsByClassName(
    "modalNotificaciones"
  )[0];
  const param1 = document.getElementsByClassName("param1")[0];
  let numero1 = extraerNumeros(param1.textContent);
  const param2 = document.getElementsByClassName("param2")[0];

  modalNotificaciones.style.display = "block";
  nav.style.top = "32px";
  for (const element of elements) {
    // logica para eliminar los albums
    if (element.classList.contains("album_item")) {
      const nombreAlbum = limpiarTextoCompleto(element.textContent);
      await EliminarAlbum(nombreAlbum);
      continue;
    }
    // si la peticion de eliminar proviene de un album
    //  entonces la maneja DeleteFromAlbum() 
    // y salta a al siguiente elemento
    const detener = await DeleteFromAlbum(element.id)
    if(detener == true)continue

    param2.textContent = elements.length;
    const id = extraerNumeros(element.id);
    const { data, error } = await supabase
      .from("Imagenes")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      console.error(`Error al eliminar la imagen con ID ${id}:`, error);
    }
    if (data) {
      numero1++;
      param1.textContent = numero1;
      const div = document.getElementById("divImg" + id);
      div.remove();
      for (let index = 0; index < idsActivos.length; index++) {
        if (idsActivos[index] == id) idsActivos.splice(index, 1);
      }
    }
  }
  desmarcarCheckbox();
  param1.textContent = "1";
  param2.textContent = "0";
  modalNotificaciones.style.display = "none";
  nav.style.top = "15px";
  console.log("ids activos despues de eliminar", idsActivos);
}
async function DeleteFromAlbum(id){
  const pagina = document.getElementsByClassName("onDisplay")[0]
  if(pagina.id == "gallery"){
    return false
  }else{
    console.log("pagina on display", pagina)
    console.log("id del elemento que se desea elmiminar", id)
    await DeleteFromTabla(pagina.id,extraerNumeros(id))
    const imgDiv = document.getElementById(pagina.id + "divImg"+extraerNumeros(id))
    // Para sacarlo de la interfaz
    imgDiv.remove()
    return true
  }
  
}

export function añadirFuncionesDeNavegacion(modal, album) {
  console.log("album", album); // prueba
  const navegablefoward = document.createElement("div");
  const navegablebackwards = document.createElement("div");
  const imgDiv = modal.children[0];

  imgDiv.classList.add("navegable-continer");
  navegablefoward.classList.add("navegablefoward");
  navegablebackwards.classList.add("navegablebackwards");
  imgDiv.appendChild(navegablefoward);
  imgDiv.appendChild(navegablebackwards);

  navegablefoward.onclick = () => {
    pasarImagen("foward", modal, album);
  };
  navegablebackwards.onclick = () => {
    pasarImagen("backwards", modal, album);
  };
}

function pasarImagen(direccion, modal, album) {
  const modal_id = extraerNumeros(modal.id);
  console.log("modal", modal_id);
  const galeria = document.getElementsByClassName("onDisplay")[0];
  const galeriaHijos = Array.from(galeria.children);
  const idsArray = [];
  galeriaHijos.forEach((gh) => {
    idsArray.push(extraerNumeros(gh.id));
  });
  const posisionArray = idsArray.indexOf(modal_id);
  if (direccion == "foward") {
    if (idsArray[posisionArray + 1]) {
      const id = idsArray[posisionArray + 1];
      const src = galeriaHijos[posisionArray + 1].children[0].src;

      CerrarExpandirImg();
      ExpandirImagen("img" + id, src, id, "next", album);
    } else {
      if (album != "cargarAlbum") CargarMasElementos();
    }
  } else {
    if (idsArray[posisionArray - 1]) {
      const id = idsArray[posisionArray - 1];
      const src = galeriaHijos[posisionArray - 1].children[0].src;

      CerrarExpandirImg();
      ExpandirImagen("img" + id, src, id, "next", album);
    }
  }
}

export async function Descargar(ids, info) {
  const notificacion = document.getElementsByClassName(
    "modalNotificaciones3"
  )[0];
  const cantidad = ids.length;
  let en_proceso = 0;
  for (const id of ids) {
    // implementacion de logica de descargar albums
    if (Number.isNaN(id)) {
      // ---------IMPORTANTE
      console.log("implementacion de descarga de albums proximamente");
      continue;
    }

    en_proceso++;
    notificacion.classList.add("modalNotificaciones3_error_mode");
    notificacion.textContent = `Preparando para la descarga... ${en_proceso} de ${cantidad}`;
    const { data, error } = await supabase
      .from("Imagenes")
      .select("name, data")
      .eq("id", id)
      .single();

    if (error) {
      console.log(
        "Ha ocurrido un error al obtener los datos de la imagen",
        error
      );
      notificacion.textContent = "Ha ocurrido un error, intentar de nuevo ";
      notificacion.style.backgroundColor = "#d81b37";
      setTimeout(() => {
        notificacion.style.backgroundColor = "#17b95a";
        notificacion.classList.remove("modalNotificaciones3_error_mode");
      }, 3000);
    }
    if (data) {
      const src = data.data;
      const name = data.name;
      const enlace = document.createElement("a");
      enlace.download = name;
      enlace.href = `data:image/jpeg;base64,${src}`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);

      setTimeout(() => {
        notificacion.classList.remove("modalNotificaciones3_error_mode");
      }, 3000);
    }
  }
  if (info == "many") {
    desmarcarCheckbox();
  }
}

// singleIMG_count
//divImg + id
//<i class="fa-solid fa-check "></i>
//Array.from(document.getElementsByClassName("selected")).length
