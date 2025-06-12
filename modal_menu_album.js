import { supabase } from "./script.js";
import { extraerNumeros } from "./script.js";
// Crear una Tabla como album en la base de datos 
export async function crearTablaAlbum(tableName) {
    // no borrar la tabla principal de las imagenes por accidente 
    if(tableName == "Imagenes"){
        console.log("Imposible eliminar o modificar la tabla Imagenes")
        return
    }
  // Usamos `rpc()` para ejecutar SQL
  const { data, error } = await supabase.rpc('execute_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS ${tableName} (
    imgsIds NUMERIC
);
    `,
  });

  if (error) {
    console.error("Error creando tabla:", error);
    return;
  }

  console.log("✅ Tabla creada exitosamente");
}
// Ver cuantas tablas como albums existen el la base de datos (excluye a la tabla IMAGENES)
export async function listarTablasAlbums() {
  const { data, error } = await supabase.rpc('get_user_tables');
  
  if (error) {
    console.error("Error obteniendo tablas:", error);
    return [];
  }
  return data;
}

// Al mostrar el modeal se ejecutará esta función para traer los albums existentes
export async function mostrarAlbums(){
    const modal_menu_album = document.getElementsByClassName("modal_menu_album")[0]
    const albums = await listarTablasAlbums()
    
    if (albums){
        albums.forEach(al => {
        const div = document.createElement('div')
        div.classList.add("album_item")
        div.textContent = al
        modal_menu_album.appendChild(div)
    });
    }
}

// funcion asincrona para crear el album y esperar la respuesta 
async function CrearAlbum() {
  const inputNombre = document.getElementsByClassName("nombre_album_input")[0]
  // si el campo esta vacío no hacemos nada 
  if(inputNombre.value ==""){
    console.log("esta vacío el campo")
    return
  }

  // Comenzar la petición de creación de la table Album con los ids seleccionados
  const idsSeleccionados = obtenerIdsSeleccionados()
  const cuerpoConsulta = ObtenerCuerpoDeConsulta(idsSeleccionados)
  const nuevoAlbum = await crearTablaAlbum(inputNombre.value) // importante


  // vamos a insertar los valores nuevos a la nueva tabla, los valores de los Id de las imagenes
    const { data, error } = await supabase
    .from(inputNombre.value)
    .insert(cuerpoConsulta);

  if (error) {
    console.error('Error insertando datos:', error);
    return;
  }

  console.log('Datos insertados:', data);
  Cerrar_modal_nombre_album()
  mostrarAlbums()
}
//Función para obtener lso ids de los seleccionados
export  function obtenerIdsSeleccionados() {
  //Seleccionar todas las fotos que tienen clase selcted
  const elementos = document.getElementsByClassName("selected")
  const ElementosSeleccionados = Array.from(elementos)
  const ids = []

  ElementosSeleccionados.forEach((elem)=>{
    const id = extraerNumeros(elem.id)
    ids.push(id)
  })
  return ids
}
// Para que el arreglo tenga cuerpo de consulta con el nombre del campo y el valor (objetos)
function ObtenerCuerpoDeConsulta (ids){
const newIds = []
  ids.forEach((id)=>{
    newIds.push(
      {
        imgsids:id
      }
    )
  })
  return newIds
}

// funcion para abrir el modal de crear album para el nombre 
function Mostrar_modal_nombre_album() {
  // Activar el modal para la captura del nombre 
  const modal = document.getElementsByClassName("modal_nombre_album")[0]
  const overlay = document.getElementsByClassName("overlay")[0]
  modal.style.display="flex"
  overlay.style.display="block"
  document.body.style.overflow ="hidden"

}
// funcion para cerrar el modal de crear album
function Cerrar_modal_nombre_album(){
  const modal = document.getElementsByClassName("modal_nombre_album")[0]
  const overlay = document.getElementsByClassName("overlay")[0]
  modal.style.display="none"
  overlay.style.display="none"
  document.body.style.overflow ="auto"
}







mostrarAlbums()

// Eventos de botones aqui debajo 

// boton de crear un nuevo album
const BotonCrearAlbum = document.getElementsByClassName("menu_album_createAlbum_option")[0]
  BotonCrearAlbum.onclick =  ()=>{
    // verificar que al menos exista un archivo foto seleccionado 
    if(!(document.getElementsByClassName("selected")[0])){
      alert("Selecciona al menos una foto")
      return
    }

    Mostrar_modal_nombre_album()
  }

// boton de aceptar del Modal nombre album para crear album 
const aceptarCrearAlbum = document.getElementsByClassName("aceptarCrearAlbum")[0]
  aceptarCrearAlbum.onclick = async ()=>{
    await CrearAlbum()
  }

const cancelarCrearAlbum = document.getElementsByClassName("cancelarCrearAlbum")[0]
  cancelarCrearAlbum.onclick =()=>{
    Cerrar_modal_nombre_album()
  }





