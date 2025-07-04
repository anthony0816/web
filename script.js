import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { ExpandirNav } from "./script_continue.js";
import { RecopilarIds } from "./script_continue.js";
import { Seleccionar } from "./script_continue.js";
import { DeleteImg } from "./script_continue.js";
import { añadirFuncionesDeNavegacion } from "./script_continue.js";
import { Descargar } from "./script_continue.js";
import { EliminarIdsActicos } from "./script_continue.js";
import { mostrarAlbums } from "./modal_menu_album.js";
import { DisplayFromAlbum } from "./displayFromAlbum.js";

const supabaseUrl = "https://nvunvfuliztilbzbydqs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dW52ZnVsaXp0aWxiemJ5ZHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODg5OTYsImV4cCI6MjA2MzQ2NDk5Nn0.pBp5CkGva3Y_2xBP9BVq-qnHng6M_1rikTalGHRGfd8";
export const supabase = createClient(supabaseUrl, supabaseKey);
var ImagenesCargadas = 0;
//export var idsActivos = []
var IMGRAM = [];

// Extraer los números de un string
export function extraerNumeros(str) {
  const numeroString = str.match(/\d+/g) ? str.match(/\d+/g).join("") : "";
  const numero = parseInt(numeroString, 10);
  return numero;
}
export function cambiarEstadoCheckbox() {
  const CheckbosHidden = document.getElementById("seleccionar");
  CheckbosHidden.click();
}
export function desmarcarCheckbox() {
  const labelForInputHidden = document.getElementById("seleccionar");
  if (labelForInputHidden.classList.contains("activo")) {
    labelForInputHidden.click();
  }
}

export function CargarMasElementos() {
  const botonCargarMasHtmlCollection = document.getElementsByClassName(
    "CargarMas-contenedor"
  );
  const botonCargarMas = Array.from(botonCargarMasHtmlCollection);
  botonCargarMas.forEach((element) => {
    element.remove();
  });
  console.log("cargando mas");
  ObtenerIds(27);
}

export async function ExpandirImagen(id, src, id_original, info, album) {
  console.log("IMAGEN id:", id)
  const CheckbosHidden = document.getElementById("seleccionarEstado");
  if (CheckbosHidden.checked) {
    return;
  }

  // Ocultar la barra de abajo en mobiles
  document.getElementsByClassName("barraInferior")[0].style.bottom = "-100px";

  const existe = document.getElementById("modal" + id_original);
  if (existe) {
    existe.classList.remove("closed");
    // Animaciones
    if (!(info == "next")) {
      existe.classList.remove("animacion");
      setTimeout(() => {
        existe.classList.add("animacion");
      }, 10);
    }
    // End

    existe.style.display = "flex";
    document.body.style.overflow = "hidden"; // Desactivar el scroll
    const modalchild = document.getElementsByClassName(
      "modal_expandirImagen_contenedor"
    )[0];
    existe.appendChild(modalchild);
    modalchild.id = " " + existe.id;
    if (existe.classList.contains("cancelado")) {
      setTimeout(async () => {
        const modal = document.getElementById("modal" + id_original);
        // El primer hijo de modal su primer hijo es la foto
        const img = modal.children[0].children[0];
        if (modal.classList.contains("closed")) {
          modal.classList.add("cancelado");
          console.log("cancelado");
          return;
        }
        console.log("Se empieza a ejecutar ahora");
        async function CargarImagenAltaCalidad(id) {
          const { data, error } = await supabase
            .from("Imagenes")
            .select("data")
            .eq("id", id)
            .single();

          if (error) {
            console.log("error al recargar la imagen");
          }
          const newsrc = `data:image/jpeg;base64,${data.data}`;

          return newsrc;
        }
        img.src = await CargarImagenAltaCalidad(id_original);
      }, 2000);
    }
    return;
  }

  document.body.style.overflow = "hidden"; // Desactivar el scroll

  const body = document.getElementsByTagName("body")[0];
  const modal = document.createElement("div");
  const imgDiv = document.createElement("div");
  const img = document.createElement("img");

  modal.style.display = "none";
  modal.id = "modal" + id_original;
  body.appendChild(modal);
  const modalchild = document.getElementsByClassName(
    "modal_expandirImagen_contenedor"
  )[0];
  modal.appendChild(modalchild);
  modalchild.id = " " + modal.id;
  modalchild.style.display = "flex";
  img.src = src;
  img.id = id;
  imgDiv.classList.add("imgDiv");
  modal.style.display = "flex";
  img.classList.add("img_mostrar_modal");
  modal.insertBefore(imgDiv, modal.firstChild);
  imgDiv.appendChild(img);
  modal.classList.add("modal_mostrarImg");
  modal.classList.remove("closed");

  // Animaciones
  if (!(info == "next")) {
    setTimeout(() => {
      modal.classList.add("animacion");
    }, 10);
  } else {
    modal.classList.add("animacion");
  }
  //End
  añadirFuncionesDeNavegacion(modal, album);

  setTimeout(async () => {
    const modal = document.getElementById("modal" + id_original);
    if (modal.classList.contains("closed")) {
      modal.classList.add("cancelado");
      console.log("cancelado");
      return;
    }
    console.log("Se empieza a ejecutar ahora");
    async function CargarImagenAltaCalidad(id) {
      const { data, error } = await supabase
        .from("Imagenes")
        .select("data")
        .eq("id", id)
        .single();

      if (error) {
        console.log("error al recargar la imagen");
      }
      const newsrc = `data:image/jpeg;base64,${data.data}`;

      return newsrc;
    }
    img.src = await CargarImagenAltaCalidad(id_original);
  }, 2000);
}

// Cerrar expandir imagen
export function CerrarExpandirImg() {
  const modal_mostrarImg = document.getElementsByClassName("modal_mostrarImg");
  // volver a abrir el menu para moviles
  document.getElementsByClassName("barraInferior")[0].style.bottom = "0";

  document.body.style.overflow = "auto";
  Array.from(modal_mostrarImg).forEach((element) => {
    element.style.display = "none";
    element.classList.add("closed");
  });
}

// Obtener versión de baja calidad de la foto
async function generate_low_quatity_version(
  base64,
  maxWidth = 300,
  quality = 0.3
) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

// Subir imágenes por el usuario
async function uploadImage() {
  const fileInput = document.getElementById("imageInput");
  const files = fileInput.files;
  const modal = document.getElementById("panel_insertar");
  const inputFile = document.getElementById("imageInput");
  const nav = document.getElementsByClassName("nav")[0];
  const Cargando = document.createElement("div");
  Cargando.style.cursor = "pointer";
  const botonMinimizar = document.createElement("div");
  botonMinimizar.classList.add("GuardarImagen");
  botonMinimizar.textContent = "Minimizar";
  botonMinimizar.style.display = "block";
  botonMinimizar.style.cursor = "pointer";
  botonMinimizar.id = "BotonMinimizar";
  botonMinimizar.addEventListener("click", function () {
    MinimizarAlSubirImagenes(Cargando);
  });

  if (files.length === 0) {
    alert("¡Selecciona una imagen primero!");
    return;
  }
  const elementos = modal.querySelectorAll("*");
  elementos.forEach((elemento) => {
    elemento.style.display = "none";
  });
  let cont = 1;
  for await (const element of files) {
    //Mostrar cargand
    Cargando.innerHTML = `Cargando...${element.name.substring(
      0,
      24
    )} <strong>${cont} de ${files.length}</strong>`;

    cont++;
    Cargando.classList.add("Cargando");
    modal.appendChild(Cargando);
    modal.appendChild(botonMinimizar);

    const base64Data = await toBase64(element);
    const low_quality_version = await generate_low_quatity_version(base64Data);

    // Insertar la nueva imagen en la tabla
    const { data, error } = await supabase
      .from("Imagenes")
      .insert([
        {
          name: element.name,
          data: base64Data,
          datalow: low_quality_version,
        },
      ])
      .select("id");

    if (error) {
      console.error("Error al insertar:", error);
    } else {
      console.log("Imagen guardada en Base64:", data);
      console.log("¡Imagen subida con éxito!");

      CargarImagenes(data, "Cargada por el usuario");
    }
  }

  modal.style.display = "none";
  Cargando.remove();
  nav.style.top = "15px";
  modal.classList.remove("panel_insertar_minimizado");
  botonMinimizar.remove();
  elementos.forEach((elemento) => {
    elemento.style.display = "flex";
  });
  inputFile.style.display = "none";
}

// Función para convertir File a Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Solo la parte Base64
    reader.onerror = reject;
  });
}

// Para obtener los ID
export async function ObtenerIds(n) {
  try {
    const { data, error } = await supabase
      .from("Imagenes") // ¡Asegúrate de que coincida con el nombre real!
      .select("id")
      .order("id", { ascending: false })
      .range(ImagenesCargadas, ImagenesCargadas + n);

    if (error) {
      console.error("Error de Supabase:", error.message);
      console.error("Detalles:", error.details);
    } else {
      console.log("¡Conexión exitosa! Datos:", data);
    }
    CargarImagenes(data, "Cargar mas");
  } catch (err) {
    console.error("Error inesperado:", err);
  }
}

// Construir la imagen
function displayBase64Image(base64Data, imageType) {
  // Create the full Base64 URL
  const imageUrl = `data:image/${imageType};base64,${base64Data}`;

  // Create and configure the image element
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Converted from Base64";
  img.style.maxWidth = "100%";
  img.style.height = "auto";

  return img;
}

// Detectar el formato de la imagen
function detectImageFormatFromBase64(base64Data) {
  // Remove the data URL prefix if present
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Get the first few bytes of the actual Base64 data
  const signature = atob(cleanBase64).substring(0, 8);

  // Check against known file signatures
  if (signature.startsWith("\xFF\xD8\xFF")) return "jpeg";
  if (signature.startsWith("\x89PNG\r\n\x1A\n")) return "png";
  if (signature.startsWith("GIF87a") || signature.startsWith("GIF89a"))
    return "gif";
  if (signature.startsWith("\x52\x49\x46\x46") && signature.includes("WEBP"))
    return "webp";

  return "unknown";
}


export async function CargarImagenes(data, info,StringAlbum) {
 
  const Galeria = await DisplayFromAlbum(StringAlbum)
  if( Galeria == "ready")return

  if (info != "Cargada por el usuario" && info != "Cargar mas") {
    Galeria.innerHTML = "";
    EliminarIdsActicos();
  }

  try {
    for (const element of data) {
      const imgEnRAM = IMGRAM.find((img) => img.id == element.id);
      if ((imgEnRAM)&& (info == "Cargar mas")) {
        Galeria.appendChild(imgEnRAM.div);
        ImagenesCargadas++

        if (document.getElementById("seleccionarEstado").checked) {
        //console.log("vamo a ver si pincha")
        Seleccionar("fromCargarImagenes");
        }

        continue;
      }
      const { data: imgData, error } = await supabase
        .from("Imagenes")
        .select("datalow")
        .eq("id", element.id)
        .single();
      if (error) {
        console.log(
          `Ocurrio un error al intentar acceder al id ${element.id} puede que no exista en la base de datos, El error :`,
          error
        );
        continue;
      }

      const imgFormat = detectImageFormatFromBase64(imgData.datalow);
      const img = displayBase64Image(imgData.datalow, imgFormat);
      const id = element.id;
      const divImg = document.createElement("div");
      
      if(StringAlbum){
        img.id = StringAlbum+"img"+ id
        divImg.id = StringAlbum + "divImg" + id;
      }else{
        img.id = "img" + id;
        divImg.id = "divImg" + id;
      }
      img.classList = "singleIMG";
      divImg.classList = "singleIMG-continer";
      divImg.appendChild(img);

      // verificacion importante
      if (info == "Cargada por el usuario") {
        Galeria.insertBefore(divImg, Galeria.firstChild);

        // Guardar la iamgen en RAM
        IMGRAM.push({ div: divImg, id: extraerNumeros(divImg.id) });
      } else {
        Galeria.appendChild(divImg);
        if(info == "Cargar mas"){
          // Guardar la iamgen en RAM
        IMGRAM.push({ div: divImg, id: extraerNumeros(divImg.id) });
        }
      }
      ImagenesCargadas++;

      // añadir funciones de expandir a la imagen
      img.addEventListener("click", function () {
        ExpandirImagen(img.id, img.src, id, "hola", info);
      });

      if (document.getElementById("seleccionarEstado").checked) {
        //console.log("vamo a ver si pincha")
        Seleccionar("fromCargarImagenes");
      }
    }
  } catch (error) {
    console.log("Algo salió mal cargando las imagenes", error);
  } finally {
    if (info == "Cargar mas") {
      const CargarMas = document.createElement("div");
      const CargarMasContenedor = document.createElement("div");
      CargarMasContenedor.classList.add("CargarMas-contenedor");
      CargarMas.classList.add("CargarMas");
      CargarMas.classList.add("fa-solid");
      CargarMas.classList.add("fa-rotate");
      CargarMasContenedor.classList.add("CargarMasContenedor");
      Galeria.appendChild(CargarMasContenedor);
      CargarMasContenedor.appendChild(CargarMas);
      CargarMasContenedor.addEventListener("click", () => {
        CargarMasElementos();
      });
    }
  }
  console.log("Imagenes Cargadas: " + ImagenesCargadas);
}

// Tuve que repetir la fucnion aqui al original esta en el modulo de MenuAlbumesMoviles daba error de importación
function OcultarAlbumMoviles() {
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

function GaleriaHacerClick() {
  const Galeria = document.getElementsByClassName("galeria")[0];
  console.log("galeria", Galeria);
  Galeria.click();
}

export function setTitulo(nombre) {
  const titulo = document.getElementsByClassName("title")[0];
  titulo.textContent = nombre;
}

export function autenticar(usuario, contraseña) {
  if (
    localStorage.getItem("user") != usuario ||
    localStorage.getItem("pas") != contraseña
  ) {
    const a = document.createElement("a");
    a.href = "./autenticar.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return false;
  }
  return true;
}

 export async function iniciarApp(cantidad) {
  await mostrarAlbums();
  const CantFotos = cantidad; // cantidad de fotos al inicio
  setTimeout(() => {
    GaleriaHacerClick();
    console.log("se ejecuta");
  }, 1000);

  // al hacer click en la galeria de los albums
  const Galeria = document.getElementsByClassName("galeria")[0];
  Galeria.onclick = () => {
    setTimeout(() => {
      OcultarAlbumMoviles();
    }, 200);
    // prevenir el span de click inecesarios puede sobrecargar el servidor
    if (Galeria.classList.contains("active")) return;

    const active = Array.from(document.getElementsByClassName("active"));

    if (active) {
      active.forEach((el) => {
        el.classList.remove("active");
      });
      Galeria.classList.add("active");
    }

    const limpiarImagenes = document.getElementById("gallery");
    limpiarImagenes.innerHTML = "";
    ImagenesCargadas = 0;

    // poner el titulo
    setTitulo("Galeria");
    ObtenerIds(CantFotos);
  };
}

export function CargarTema(){
  const body = document.getElementsByTagName('body')[0]
  const tema = localStorage.getItem("tema")
  const botonCambiarTema = document.getElementById("ajustes")
  if (!(tema)){
    body.classList.remove("modoClaro")
    botonCambiarTema.click()
    localStorage.setItem("tema","claro")
    return
  }
  if(tema == "claro"){
    body.classList.remove("modoClaro")
    botonCambiarTema.click()
  }
  if(tema == "oscuro"){
    botonCambiarTema.click()
  }

}

















// iniciar la app
// let estado = autenticar("Bb", "kjkszpj");
// if (estado == false) {
//   document.getElementsByTagName('body')[0].innerHTML=""
// } else {
//   await iniciarApp(0);
// }

// Cargar la imagen en la base de datos
const GuardarImagen = document.getElementById("GuardarImagen");
GuardarImagen.addEventListener("click", function () {
  uploadImage();
});

//Minimizar mientras carca
const MinimizarAlSubirImagenes = (Cargando) => {
  const BotonMinimizar = document.getElementById("BotonMinimizar");
  const nav = document.getElementsByClassName("nav")[0];
  const panel_insertar = document.getElementById("panel_insertar");
  panel_insertar.classList.add("panel_insertar_minimizado");
  console.log("panel insertar", panel_insertar);
  nav.style.top = "32px";
  if (window.getComputedStyle(BotonMinimizar).display === "block") {
    Cargando.addEventListener("click", function () {
      BotonMinimizar.style.display = "block";
      panel_insertar.classList.remove("panel_insertar_minimizado");
      nav.style.top = "15px";
    });
  }
  BotonMinimizar.style.display = "none";
};

// Cerrar Modal de subir imagenes
const Cancelar = document.getElementById("Cancelar");
Cancelar.addEventListener("click", function () {
  let modal = document.getElementById("panel_insertar");
  modal.style.display = "none";
});
// Acceder a al panel de opciones de subir imagen
const subir = document.getElementById("subir");
subir.addEventListener("click", function () {
  let modal = document.getElementById("panel_insertar");
  modal.style.display = "flex";
});

// Cerrar la ventana de Maximisar vista de la imagen
const CerrarExpandirImg_boton = document.getElementById("CerrarExpandirImg");
CerrarExpandirImg_boton.addEventListener("click", CerrarExpandirImg);
// Eliminar desde el icono de elimiar
const EliminarImg = document.getElementById("EliminarImg");
EliminarImg.addEventListener("click", function () {
  // Declaraciones agrupadas al inicio
  const modalchild = document.getElementsByClassName(
    "modal_expandirImagen_contenedor"
  )[0];
  const modalchild_id = modalchild.id;
  const id = extraerNumeros(modalchild_id);
  const ModaleEliminar = document.getElementsByClassName("modalEliminar")[0];
  const BotonCancelar = document.getElementsByClassName(
    "cancelarEliminarPhoto"
  )[0];
  const eliminarPhoto = document.getElementsByClassName("eliminarPhoto")[0];
  const nav = document.getElementsByClassName("nav")[0];
  const modalNotificaciones = document.getElementsByClassName(
    "modalNotificaciones"
  )[0];
  const param1 = document.getElementsByClassName("param1")[0];
  let numero1 = extraerNumeros(param1.textContent);
  const param2 = document.getElementsByClassName("param2")[0];
  let numero2 = extraerNumeros(param2.textContent);

  // Mostrar el modal
  ModaleEliminar.style.display = "flex";

  // Manejar cancelar
  BotonCancelar.addEventListener("click", function () {
    ModaleEliminar.style.display = "none";
  });

  // Manejar aceptar
  eliminarPhoto.addEventListener("click", async function () {
    modalNotificaciones.style.display = "block";
    nav.style.top = "32px";
    ModaleEliminar.style.display = "none";
    const QuitarExpandir = document.getElementById("modal" + id);
    QuitarExpandir.style.display = "none";
    document.body.style.overflow = "auto";

    // Mostrar Modal de Notificaciones con la acción
    modalNotificaciones.style.display = "block";
    numero2++;
    param2.textContent = numero2;

    const { data, error } = await supabase
      .from("Imagenes") // Asegúrate de que el nombre coincida con tu tabla
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Error al eliminar la imagen:", error);
      Notification.textContent = `Error al eliminar la imagen #${numero2}`;
    }

    if (data) {
      const divImg = document.getElementById("divImg" + id);
      try {
        divImg.remove();
      } catch (error) {
        console.log("error  ");
      } finally {
        // Actualizar el estado de la barra de notificaciones
        numero1++;
        param1.textContent = numero1;
        console.log("Eliminado exitosamente");
        if (numero1 > numero2) {
          modalNotificaciones.style.display = "none";
          nav.style.top = "15px";
          param1.textContent = "1";
          param2.textContent = "0";
        }
      }
    }
  });
});

const nav_expandir = document.getElementById("nav_expandir");
nav_expandir.addEventListener("click", () => {
  ExpandirNav(nav_expandir);
});

const seleccionar = document.getElementById("seleccionar");
seleccionar.addEventListener("click", () => {
  const CheckbosHidden = document.getElementById("seleccionarEstado");
  const modalNotificaciones = document.getElementsByClassName(
    "modalNotificaciones2"
  )[0];
  const nav = document.getElementsByClassName("nav")[0];
  console.log("estado del chexbox", CheckbosHidden.checked);
  if (!CheckbosHidden.checked) {
    seleccionar.style.color = "#d81b60";
    seleccionar.classList.add("activo");
  } else {
    seleccionar.style.color = "black";
    seleccionar.classList.remove("activo");
  }
  Seleccionar(CheckbosHidden, modalNotificaciones, nav);
});

const eliminar_seleccionados = document.getElementById(
  "eliminar_seleccionados"
);
eliminar_seleccionados.addEventListener("click", () => {
  const elementosSeleccionados = document.getElementsByClassName("selected")[0];
  if (!elementosSeleccionados) return;
  document.body.style.overflow = "hidden";
  const modalEliminarMultiple = document.getElementsByClassName(
    "modalEliminarMultiples"
  )[0];
  modalEliminarMultiple.classList.add("modalEliminarMultiples_ON");
});
const aceptar_eliminar_seleccionados = document.getElementsByClassName(
  "modalEliminarMultiples_aceptar"
)[0];
aceptar_eliminar_seleccionados.onclick = function () {
  const nav = document.getElementsByClassName("nav")[0];
  const seleccionadosHTMLColection =
    document.getElementsByClassName("selected");
  const seleccionados = Array.from(seleccionadosHTMLColection);
  DeleteImg(seleccionados, nav);
  const modalEliminarMultiple = document.getElementsByClassName(
    "modalEliminarMultiples"
  )[0];
  modalEliminarMultiple.classList.remove("modalEliminarMultiples_ON");
  document.body.style.overflow = "auto";
};
const cancelar_eliminar_seleccionados = document.getElementsByClassName(
  "modalEliminarMultiples_cancelar"
)[0];
cancelar_eliminar_seleccionados.onclick = function () {
  const modal = document.getElementsByClassName("modalEliminarMultiples")[0];
  modal.classList.remove("modalEliminarMultiples_ON");
  document.body.style.overflow = "auto";
};

const download_single_photo = document.getElementById("download_single_photo");
download_single_photo.onclick = function () {
  const id = [];
  const modal = document.getElementsByClassName(
    "modal_expandirImagen_contenedor"
  )[0];
  id[0] = extraerNumeros(modal.id);
  const info = "single";
  Descargar(id, info);
};

const download_photos = document.getElementById("descargar");
download_photos.onclick = function () {
  const selected = document.getElementsByClassName("selected");
  if (!selected[0]) {
    const notificacion = document.getElementsByClassName(
      "modalNotificaciones3"
    )[0];
    notificacion.classList.add("modalNotificaciones3_error_mode");
    notificacion.textContent = "Seleccionar al menos un elemento";
    notificacion.style.backgroundColor = "#d81b37";
    setTimeout(() => {
      notificacion.style.backgroundColor = "#17b95a";
      notificacion.classList.remove("modalNotificaciones3_error_mode");
    }, 3000);
    return;
  }

  const coleccition = Array.from(selected);
  const ids = [];
  coleccition.forEach((element) => {
    const id = extraerNumeros(element.id);
    ids.push(id);
  });
  console.log("ids", ids);
  const info = "many";
  Descargar(ids, info);
};
