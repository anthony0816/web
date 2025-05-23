
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = "https://nvunvfuliztilbzbydqs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dW52ZnVsaXp0aWxiemJ5ZHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODg5OTYsImV4cCI6MjA2MzQ2NDk5Nn0.pBp5CkGva3Y_2xBP9BVq-qnHng6M_1rikTalGHRGfd8";
const supabase = createClient(supabaseUrl, supabaseKey);




// Obtener version de baja calidad de la foto 
async function generate_low_quatity_version(base64, maxWidth = 300, quality = 0.5) {
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
    
    if (!file) {
      alert("¡Selecciona una imagen primero!");
      return;
    }

  
    const base64Data = await toBase64(file);
    const low_quality_version = await generate_low_quatity_version(base64Data)
    
    const { data, error } = await supabase
      .from('Imagenes')
      .insert([
        { 
          name: file.name,
          data: base64Data,
          datalow: low_quality_version  
        }
      ]);

    if (error) {
      console.error("Error al insertar:", error);
    } else {
      console.log("Imagen guardada en Base64:", data);
      console.log("¡Imagen subida con éxito!");
    }
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

  



  
  async function ObtenerIds() {
    try {
      const { data, error } = await supabase
        .from("Imagenes")  // ¡Asegúrate de que coincida con el nombre real!
        .select("id")
        .limit(/*--Poner un limite de datos obtenidos--*/)
        .order('id', { ascending: true });
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





function CargarImagenes(data){

  const Galeria = document.getElementById("gallery")

  data.forEach(async  element => {
    const id = element.id
    
    const { data, error } = await supabase
    .from('Imagenes')
    .select('datalow') 
    .eq('id', id)
    .single();
  
    if (error) console.error("Error fetching image:", error);
  
  const base64Img = data.datalow
  /*const low_quality_img = await generate_low_quatity_version(base64Img)
  
  const { datalow, errorr } = await supabase
  .from('Imagenes')
  .update({ 
    datalow: low_quality_img,
  })
  .eq('id', id); 
  console.log("Datos de asignación de low quality",datalow,errorr)*/

  const imgFormat = detectImageFormatFromBase64(base64Img)
  const img = displayBase64Image(base64Img,imgFormat)
  
  let divImg = document.createElement('div')
  divImg.classList="singleIMG-continer"
  img.classList ="singleIMG"
  
  Galeria.appendChild(divImg)
  divImg.appendChild(img)
  
  });
  
}










ObtenerIds();

const GuardarImagen = document.getElementById("GuardarImagen")
GuardarImagen.addEventListener('click',function(){
    
    uploadImage()
})










