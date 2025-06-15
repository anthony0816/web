import { supabase } from "./script.js";
import { extraerNumeros } from "./script.js";
import { CargarImagenes } from "./script.js";

// Crear una Tabla como album en la base de datos
export async function crearTablaAlbum(tableName) {
  // no borrar la tabla principal de las imagenes por accidente
  if (tableName == "Imagenes") {
    console.log("Imposible eliminar o modificar la tabla Imagenes");
    return;
  }
  // Usamos `rpc()` para ejecutar SQL
  const { data, error } = await supabase.rpc("execute_sql", {
    query: `
      CREATE TABLE IF NOT EXISTS ${tableName} (
    imgsids NUMERIC
  );
    `,
  });

  if (error) {
    console.error("Error creando tabla:", error);
    return;
  }

  console.log("✅ Tabla creada exitosamente");
}

// Eliminar un album de la base de datos
export async function EliminarAlbum(albumName) {
  // Eliminar la tablaAlbum
  console.log("eliminando", albumName);
  const { error } = await supabase.rpc("execute_sql", {
    query: `
    DROP TABLE ${albumName}
    `,
  });
  if (error) {
    console.log("ocurrio un error en la eliminacion", error);
  }

  // Eliminar de la tabla names
  const { errror } = await supabase
    .from("names")
    .delete()
    .eq("nombretabas", albumName);

  if (errror) {
    console.log(
      "Ocurrió un error al intentar eliminar la fila en la tabla names:",
      error
    );
  } else {
    console.log("Registro eliminado exitosamente");
    mostrarAlbums();
  }
}
async function SelectFromTabla(tableName) {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) {
    console.log("error", error);
    return;
  }
  return data;
}

async function insertarNombreAlbum(nombreTabla, nombreAlbum) {
  try {
    const { data, error } = await supabase.from("names").insert([
      {
        nombretabas: nombreTabla,
        nombrealbums: nombreAlbum,
      },
    ]);

    if (error) {
      console.error("Error insertando:", error);
      return { success: false, error };
    }

    console.log("Datos insertados correctamente:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Error inesperado:", err);
    return { success: false, error: err };
  }
}

async function crearTablaAlbumMoviles(tableName, datos) {
  const valores = datos.map((item) => `(${item.imgsids})`).join(",");

  const { error } = await supabase.rpc("execute_sql", {
    query: `
      DO $$
      BEGIN
        -- Crear tabla si no existe
        CREATE TABLE IF NOT EXISTS "${tableName}" (
          imgsids NUMERIC
        );
        
        -- Insertar datos
        INSERT INTO "${tableName}" (imgsids)
        VALUES ${valores};
      END $$;
    `,
  });

  if (error) throw error;
}

// Ver cuantas tablas como albums existen el la base de datos (excluye a la tabla IMAGENES)
export async function listarTablasAlbums() {
  const { data, error } = await supabase.from("names").select("*"); // Selecciona todas las columnas

  if (error) {
    console.error("Error obteniendo datos:", error);
    return [];
  }
  return data;
}

async function limpiarBaseDeDatos() {
  try {
    // Paso 1: Eliminar tablas con columna imgsids
    const { error: dropError } = await supabase.rpc("execute_sql", {
      query: `
        DO $$
        DECLARE
            tabla_record RECORD;
            query_text TEXT;
        BEGIN
            FOR tabla_record IN 
                SELECT table_name 
                FROM information_schema.columns 
                WHERE column_name = 'imgsids' 
                AND table_schema = 'public'
            LOOP
                query_text := 'DROP TABLE IF EXISTS ' || quote_ident(tabla_record.table_name) || ' CASCADE';
                EXECUTE query_text;
                RAISE NOTICE 'Tabla % eliminada', tabla_record.table_name;
            END LOOP;
        END $$;
      `,
    });

    if (dropError) throw dropError;

    // Paso 2: Vaciar la tabla names
    const { error: deleteError } = await supabase
      .from("names")
      .delete()
      .neq("nombretabas", "dummy"); // Elimina todas las filas

    if (deleteError) throw deleteError;

    console.log(
      "Limpieza completada: Tablas con imgsids y registros en names eliminados"
    );
    return { success: true };
  } catch (error) {
    console.error("Error durante la limpieza:", error);
    return { success: false, error };
  }
}

// Al mostrar el modeal se ejecutará esta función para traer los albums existentes
export async function mostrarAlbums() {
  const modal_menu_album =
    document.getElementsByClassName("modal_menu_album")[0];

  //para que no se pierda el boton crear al remplazar los chidls
  const hijosHtmlCollection = modal_menu_album.children;
  const hijosArray = Array.from(hijosHtmlCollection);
  hijosArray.forEach((ch) => {
    if (ch.classList.contains("menu_album_createAlbum_option") == false) {
      if (ch.classList.contains("galeria") == false) {
        ch.remove();
      }
    }
  });
  const albums = await listarTablasAlbums();
  if (albums) {
    albums.forEach((al) => {
      const div = document.createElement("div");
      div.onclick = () => {
        albumOnClick(div);
      };
      div.classList.add("album_item");
      div.textContent = al.nombrealbums;
      modal_menu_album.appendChild(div);
    });
  }
}

export function albumOnClick(div) {
  // prevenir el span de click inecesarios puede sobrecargar el servidor
  if (div.classList.contains("active")) return;

  // agregar la funcionalidad de estilos para color cuando este señalado
  const active = Array.from(document.getElementsByClassName("active"));
  if (active) {
    active.forEach((el) => {
      el.classList.remove("active");
    });
    div.classList.add("active");
  }
  // ejecutar la logica de abrir el album
  abrirAlbum(div);
}

// funcion asincrona para crear el album y esperar la respuesta
async function CrearAlbum() {
  const inputNombre = document.getElementsByClassName("nombre_album_input")[0];

  if (inputNombre.value == "") {
    console.log("esta vacío el campo");
    return;
  }

  // usar la query especializada para dispositivos moviles
  if (esDispositivoMovil() == true) {
    console.log("estamos ejecutando desde moviles");
    const idsSeleccionados = obtenerIdsSeleccionados();
    const cuerpoConsulta = ObtenerCuerpoDeConsulta(idsSeleccionados);
    insertarNombreAlbum(
      limpiarTextoCompleto(inputNombre.value),
      inputNombre.value
    );
    await crearTablaAlbumMoviles(
      limpiarTextoCompleto(inputNombre.value),
      cuerpoConsulta
    );
    Cerrar_modal_nombre_album();
    mostrarAlbums();
    return;
  }
  console.log("estamos ejecutando desde pc");

  const idsSeleccionados = obtenerIdsSeleccionados();
  const cuerpoConsulta = ObtenerCuerpoDeConsulta(idsSeleccionados);
  insertarNombreAlbum(
    limpiarTextoCompleto(inputNombre.value),
    inputNombre.value
  );
  // se crea el album en la base de datos
  await crearTablaAlbum(limpiarTextoCompleto(inputNombre.value));

  const { error } = await supabase.rpc("bulk_insert", {
    table_name: limpiarTextoCompleto(inputNombre.value),
    rows: cuerpoConsulta,
  });

  if (error) {
    console.error("Error insertando datos:", error);
    alert(`Error: ${error.message}`); // Mensaje específico
    return;
  }

  Cerrar_modal_nombre_album();
  mostrarAlbums();
}

async function abrirAlbum(elemento) {
  const nombreTabla = limpiarTextoCompleto(elemento.textContent);
  const ids = await SelectFromTabla(nombreTabla);
  const idsCodificados = CodificarDatos(ids);
  CargarImagenes(idsCodificados, "cargarAlbum");
}
//Función para obtener lso ids de los seleccionados
export function obtenerIdsSeleccionados() {
  //Seleccionar todas las fotos que tienen clase selcted
  const elementos = document.getElementsByClassName("selected");
  const ElementosSeleccionados = Array.from(elementos);
  const ids = [];

  ElementosSeleccionados.forEach((elem) => {
    const id = extraerNumeros(elem.id);
    ids.push(id);
  });
  return ids;
}
// Para que el arreglo tenga cuerpo de consulta con el nombre del campo y el valor (objetos)
function ObtenerCuerpoDeConsulta(ids) {
  const newIds = [];
  ids.forEach((id) => {
    newIds.push({
      imgsids: id,
    });
  });
  return newIds;
}

// funcion para abrir el modal de crear album para el nombre
function Mostrar_modal_nombre_album() {
  // Activar el modal para la captura del nombre
  const modal = document.getElementsByClassName("modal_nombre_album")[0];
  const overlay = document.getElementsByClassName("overlay")[0];
  modal.style.display = "flex";
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
}
// funcion para cerrar el modal de crear album
function Cerrar_modal_nombre_album() {
  const modal = document.getElementsByClassName("modal_nombre_album")[0];
  const overlay = document.getElementsByClassName("overlay")[0];
  modal.style.display = "none";
  overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

// Función para detectar si es móvil
function esDispositivoMovil() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function limpiarTextoCompleto(texto) {
  return (
    texto
      // Paso 1: Eliminar caracteres especiales y emojis
      .replace(/[^\p{L}\p{N}\.,;:!¡¿\?@#\$%\^&\*\(\)\-\+='"´`<>\/\\]/gu, "")
      // Paso 2: Eliminar todos los espacios
      .replace(/\s+/g, "")
      // Paso 3: Convertir a minúsculas (nuevo)
      .toLowerCase()
  );
}

function CodificarDatos(datos) {
  const codificados = [];
  datos.forEach((dato) => {
    codificados.push({ id: dato.imgsids });
  });
  return codificados;
}









mostrarAlbums();

// Eventos de botones aqui debajo

// boton de crear un nuevo album
const BotonCrearAlbum = document.getElementsByClassName(
  "menu_album_createAlbum_option"
)[0];
BotonCrearAlbum.onclick = () => {
  // verificar que al menos exista un archivo foto seleccionado
  if (!document.getElementsByClassName("selected")[0]) {
    alert("Selecciona al menos una foto");
    return;
  }
  Mostrar_modal_nombre_album();
};

// boton de aceptar del Modal nombre album para crear album
const aceptarCrearAlbum =
  document.getElementsByClassName("aceptarCrearAlbum")[0];
aceptarCrearAlbum.onclick = () => {
  CrearAlbum();
};

const cancelarCrearAlbum_ = document.getElementsByClassName(
  "cancelarCrearAlbum_"
)[0];
cancelarCrearAlbum_.onclick = () => {
  Cerrar_modal_nombre_album();
};
