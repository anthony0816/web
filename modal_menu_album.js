import { supabase } from "./script.js";
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
        imgsIds NUMERIC PRIMARY KEY
      );
    `,
  });

  if (error) {
    console.error("Error creando tabla:", error);
    return;
  }

  console.log("✅ Tabla creada exitosamente");
}

// Eliminar una tabla como album  de la base de datos 
export async function eliminarTablaAlbum(tableName) {
    // no borrar la tabla principal de las imagenes por accidente 
    if(tableName == "Imagenes"){
        console.log("Imposible eliminar o modificar la tabla Imagenes")
        return
    }
  const { data, error } = await supabase.rpc('execute_sql', {
    query: `
      DROP TABLE IF EXISTS ${tableName};
    `,
  });

  if (error) {
    console.error("Error eliminando tabla:", error);
    return false;
  }

  console.log("✅ Tabla eliminada exitosamente");
  return true;
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
    albums.forEach(al => {
        const div = document.createElement('div')
        div.classList.add("album_item")
        div.textContent = al
        modal_menu_album.appendChild(div)
    });
    
}

mostrarAlbums()










