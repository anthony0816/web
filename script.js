
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';


const supabaseUrl = "https://nvunvfuliztilbzbydqs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dW52ZnVsaXp0aWxiemJ5ZHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODg5OTYsImV4cCI6MjA2MzQ2NDk5Nn0.pBp5CkGva3Y_2xBP9BVq-qnHng6M_1rikTalGHRGfd8";
const supabase = createClient(supabaseUrl, supabaseKey);

//Extraer los numeros de un string 
function extraerNumeros(str) {
    return str.match(/\d+/g) ? str.match(/\d+/g).join('') : '';
}

async function ExpandirImagen(id,src,id_original){

  const existe = document.getElementById("modal"+id_original)
  if(existe){
    existe.style.display="flex"
    const modalchild = document.getElementsByClassName("modal_expandirImagen_contenedor")[0]
    existe.appendChild(modalchild)
    modalchild.id = " "+existe.id
    return
  }

const body = document.getElementsByTagName('body')[0]
const modal = document.createElement('div')
modal.style.display="none"
modal.id = 'modal'+id_original
body.appendChild(modal)
const modalchild = document.getElementsByClassName("modal_expandirImagen_contenedor")[0]
modal.appendChild(modalchild)
modalchild.id = " "+modal.id
modalchild.style.display="flex"

const imgDiv = document.createElement('div')

modal.classList.add('modal_mostrarImg')
modal.style.display="flex"  
imgDiv.classList.add("imgDiv")
const img = document.createElement('img')
img.classList.add('img_mostrar_modal')
img.src = src
img.id = id 


modal.insertBefore(imgDiv, modal.firstChild)
imgDiv.appendChild(img)


async function CargarImagenAltaCalidad (id){
  
  const { data , error } = await supabase
      .from('Imagenes')
      .select('data')
      .eq('id', id)
      .single();

  if(error){
    console.log("error al recargar la imagen")
  }
  const newsrc = `data:image/jpeg;base64,${data.data}`;
  
  return newsrc
  }
  img.src = await CargarImagenAltaCalidad(id_original)
}

// Obtener version de baja calidad de la foto 
async function generate_low_quatity_version(base64, maxWidth = 300, quality = 0.3) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });
  
}




  // Subir imagenes por el usuario 
  async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const modal = document.getElementById("panel_insertar")
    const Cargando = document.createElement('div')
    const inputFile = document.getElementById("imageInput")

    if (!file) {
      alert("¡Selecciona una imagen primero!");
      return;
    }
    const elementos = modal.querySelectorAll('*');
    elementos.forEach(elemento=>{
      elemento.style.display="none"
    })
    Cargando.textContent = "Cargando..."
    Cargando.classList.add('Cargando')
    modal.appendChild(Cargando)
  
    const base64Data = await toBase64(file);
    const low_quality_version = await generate_low_quatity_version(base64Data)
    // Insertar la nueva imagen en la tabla 
    const { data, error } = await supabase
      .from('Imagenes')
      .insert([
        { 
          name: file.name,
          data: base64Data,
          datalow: low_quality_version  
        }
      ])
      .select('id')

    if (error) {
      console.error("Error al insertar:", error);
    } else {
      console.log("Imagen guardada en Base64:", data);
      console.log("¡Imagen subida con éxito!");
      const info = "Cargada por el usuario"
      CargarImagenes(data, info)
    }
    modal.style.display="none"
    Cargando.style.display="none"
    elementos.forEach(elemento=>{
    elemento.style.display="flex"
    })
    inputFile.style.display="none"
    
    //Obtener el id para mostrar el archivo 

    // Cargar la foto en la pagina una vez subida 
    /* 
    const nameImgParaCargar = file.name
    console.log("Este es el nombre del archivo" , nameImgParaCargar)
    
    const {data2,error2} = await supabase
    .from('Imagenes')
    .select('id')
    .eq('name', nameImgParaCargar)
    .single();
    if(error2){
      console.log("ha ocurrido un error al actualizar la pagina")
    }
    console.log("datos de la imagen a subir", data2)
    */
  }





 // Función para convertir File a Base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Solo la parte Base64
      reader.onerror = reject;
    });
  }

  



  //para obtener los id 
  async function ObtenerIds() {
    try {
      const { data, error } = await supabase
        .from("Imagenes")  // ¡Asegúrate de que coincida con el nombre real!
        .select("id")
        .limit(4/*--Poner un limite de datos obtenidos--*/)
        .order('id', { ascending: false });
      if (error) {
        console.error("Error de Supabase:", error.message);
        console.error("Detalles:", error.details);
      } else {
        console.log("¡Conexión exitosa! Datos:", data);
        
      }
      CargarImagenes(data)
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  
}




// construir la imagen 
function displayBase64Image(base64Data, imageType ) {
  // Create the full Base64 URL
  const imageUrl = `data:image/${imageType};base64,${base64Data}`;
  
  // Create and configure the image element
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = "Converted from Base64";
  img.style.maxWidth = '100%';
  img.style.height = 'auto';

  return img; 
}




// detectar el formato de la imagen 
function detectImageFormatFromBase64(base64Data) {
  // Remove the data URL prefix if present
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  
  // Get the first few bytes of the actual Base64 data
  const signature = atob(cleanBase64).substring(0, 8);
  
  // Check against known file signatures
  if (signature.startsWith('\xFF\xD8\xFF')) return 'jpeg';
  if (signature.startsWith('\x89PNG\r\n\x1A\n')) return 'png';
  if (signature.startsWith('GIF87a') || signature.startsWith('GIF89a')) return 'gif';
  if (signature.startsWith('\x52\x49\x46\x46') && signature.includes('WEBP')) return 'webp';
  
  return 'unknown';
}




// cargar las imagenes desde la base de datos 
async function CargarImagenes(data,info) {
  const Galeria = document.getElementById("gallery");
  if(info != "Cargada por el usuario"){
    Galeria.innerHTML = ""; 
  }

  
  for (const element of data) {  
    const { data: imgData, error } = await supabase
      .from('Imagenes')
      .select('datalow')
      .eq('id', element.id)
      .single();

    if (!error) {
      const imgFormat = detectImageFormatFromBase64(imgData.datalow);
      const img = displayBase64Image(imgData.datalow, imgFormat);
      const id = element.id
      img.classList = "singleIMG";
      img.id = "img"+id

      const divImg = document.createElement('div');
      divImg.id = "divImg"+id
      divImg.classList = "singleIMG-continer";
      divImg.appendChild(img);
      Galeria.appendChild(divImg);
      if(info == "Cargada por el usuario"){
        Galeria.insertBefore(divImg, Galeria.firstChild);
      }
      img.addEventListener('click', function(){
        ExpandirImagen(img.id, img.src,id);
      })
    }
  }
}










ObtenerIds();

const GuardarImagen = document.getElementById("GuardarImagen")
GuardarImagen.addEventListener('click',function(){
    
    uploadImage()
})

const Cancelar = document.getElementById("Cancelar")
Cancelar.addEventListener('click', function(){
  let modal = document.getElementById("panel_insertar")
  modal.style.display="none";
})

const subir = document.getElementById("subir")
subir.addEventListener('click', function(){
  let modal = document.getElementById("panel_insertar")
  modal.style.display="flex";
})

const actualizar = document.getElementById("actualizar")
actualizar.addEventListener('click', function(){
  window.location.reload();
  modal.style.display="flex";
})

const CerrarExpandirImg = document.getElementById("CerrarExpandirImg");
CerrarExpandirImg.addEventListener('click', function() {
  const modal_mostrarImg = document.getElementsByClassName("modal_mostrarImg");

  Array.from(modal_mostrarImg).forEach(element => {
    element.style.display = "none";
  });
});


const EliminarImg = document.getElementById("EliminarImg")
EliminarImg.addEventListener('click',function(){
const modalchild = document.getElementsByClassName("modal_expandirImagen_contenedor")[0]
const modalchild_id = modalchild.id


const id = extraerNumeros(modalchild_id)

const ModaleEliminar = document.getElementsByClassName('modalEliminar')[0]
// Mostrar el modal 
ModaleEliminar.style.display = "flex"

// Manejar cancelar 
const BotonCancelar = document.getElementsByClassName("cancelarEliminarPhoto")[0]
BotonCancelar.addEventListener('click', function(){
  ModaleEliminar.style.display = "none"
})

// Manejar Aceptar
const eliminarPhoto = document.getElementsByClassName("eliminarPhoto")[0]
eliminarPhoto.addEventListener('click', async function(){
  ModaleEliminar.style.display = "none"
  const QuitarExpandir = document.getElementById("modal"+id)
        QuitarExpandir.style.display="none"
  const { data , error } = await supabase
    .from("Imagenes") // Asegúrate de que el nombre coincida con tu tabla
    .delete()
    .eq("id", id)
    .select();
    if (error) {
    console.error("Error al eliminar la imagen:", error);
    }
    if(data){
      const divImg = document.getElementById("divImg"+id)
      divImg.remove();
      console.log("eliminado exitosamente ")
      alert("Eliminado Exitosamente")
    }
})


})


