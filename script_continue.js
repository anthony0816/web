
import { extraerNumeros } from "./script.js"
import { supabase } from "./script.js"
import { ExpandirImagen } from "./script.js"
import { CerrarExpandirImg } from "./script.js"
import { CargarMasElementos } from "./script.js"
import { cambiarEstadoCheckbox } from "./script.js"
import { desmarcarCheckbox } from "./script.js"
var idsActivos = []
//Expandir la barra de navegación
export function ExpandirNav(nav_expandir){
    const botones = document.getElementsByClassName("botonesExpandir")
    const nav = document.getElementsByClassName("nav")[0]
    if(nav_expandir.classList.contains("fa-plus")){
        Array.from(botones).forEach((element) =>{
            element.classList.add("fas")
        })
        nav_expandir.classList.remove("fa-plus");
        nav_expandir.classList.add("fa-xmark");
        nav_expandir.style.color = "#d81b60"
        nav.style.width="80%"
    }
    else{
        Array.from(botones).forEach((element) =>{
            element.classList.remove("fas")
        })
        nav_expandir.classList.add("fa-plus");
        nav_expandir.classList.remove("fa-xmark");
        nav_expandir.style.color = "black"
        nav.style.width="50%"
        desmarcarCheckbox()
    }
}

//Funcion para seleccionar
export function RecopilarIds(data,info){
    if(info == "Cargada por el usuario"){
        data.forEach((element)=>{
            idsActivos.unshift(element.id)
        })
        console.log("ids activos", idsActivos)
        return
    }
    data.forEach((element)=>{
        idsActivos.push(element.id)
    })
    console.log("ids activos", idsActivos)
}
// Función para seleccionar las fotos 1x1
export function Seleccionar(CheckbosHidden , modalNotificaciones , nav){
    modalNotificaciones.style.display ="none"
    nav.style.top = "15px" 

    try{
        if(!(CheckbosHidden.checked)){
            idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("img"+element)
                    imgDiv.classList.add("transition")
                    imgDiv.onclick = function(){
                        if(this.classList.contains("selected")){
                            this.style.scale = "1"
                            this.classList.remove("singleIMG_onSelect")
                            this.classList.remove("selected")
                        }
                        else{
                            this.style.scale = "0.9"
                            this.classList.add("singleIMG_onSelect")
                            this.classList.add("selected")
                        }   
                    }
                            
            }))
    
    }else if(CheckbosHidden.checked){
            idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("img"+element)
                    imgDiv.style.scale = "1"
                    imgDiv.classList.remove("singleIMG_onSelect")
                    imgDiv.classList.remove("selected")
                    imgDiv.onclick = function(){
                        return
                    };
            }))
    }
    }catch(error){
        console.log("Debe esperar a que carguen las fotos ")
        modalNotificaciones.style.display="block"
        modalNotificaciones.textContent = "(inválido)Esperar a cargar fotos..."
        nav.style.top = "32px"
            idsActivos.forEach((element)=>{
                const imgDiv = document.getElementById("img"+element)
                    try{
                        imgDiv.onclick= function(){
                        return
                        }
                    }
                    catch(error){
                        console.log("el arreglo esta vacío")
                    }
                    finally{
                        try{imgDiv.classList.remove("selected")}
                        catch(error){console.log("No existe clase que remover")}
                    }
            })
    }
    
    
}

export async function DeleteImg(elements, nav){
    
    const modalNotificaciones = document.getElementsByClassName("modalNotificaciones")[0]
    const param1 = document.getElementsByClassName("param1")[0]
    let numero1 = extraerNumeros(param1.textContent)
    const param2 = document.getElementsByClassName("param2")[0]
    
    modalNotificaciones.style.display = "block"
    nav.style.top = "32px"
    for(const element of elements){
        param2.textContent = elements.length
        const id = extraerNumeros(element.id)
        const {data , error} = await supabase
            .from("Imagenes")
            .delete()
            .eq("id",id)
            .select("id")
            if (error) {
            console.error(`Error al eliminar la imagen con ID ${id}:`, error);
            }
            if(data){
                numero1++
                param1.textContent = numero1
                const div = document.getElementById("divImg"+id)
                div.remove()
                for (let index = 0; index < idsActivos.length; index++) {
                    if(idsActivos[index] == id)idsActivos.splice(index,1)
                    
                }
            }
    }
    param1.textContent = "1"
    param2.textContent = "0"
    modalNotificaciones.style.display = "none"
    nav.style.top = "15px"
    console.log("ids activos despues de eliminar", idsActivos)
}

export function añadirFuncionesDeNavegacion(modal){
    
    const navegablefoward = document.createElement('div')
    const navegablebackwards = document.createElement('div')
    const imgDiv = modal.children[0]
    
    imgDiv.classList.add("navegable-continer")
    navegablefoward.classList.add("navegablefoward")
    navegablebackwards.classList.add("navegablebackwards")
    imgDiv.appendChild(navegablefoward)
    imgDiv.appendChild(navegablebackwards)
    

    // Extraer el id 
    const id = extraerNumeros(modal.id)
    const posicion_en_array = idsActivos.indexOf(id)
    const idSiguiente = idsActivos[posicion_en_array+1]

    const fotosiguiente = document.getElementById("img"+idSiguiente)
    console.log("foto siguiente", fotosiguiente)
    if(!fotosiguiente){
        if( idsActivos.length - posicion_en_array == 1){
            CargarMasElementos()
        }
    }


    navegablefoward.onclick = function(){
        const direccion = "final"
        const next = idsActivos[posicion_en_array+1]
        pasarImagen(next,direccion,modal,navegablefoward)
    }
    navegablebackwards.onclick = function(){
        const idAnterior = idsActivos[posicion_en_array-1]
        const direccion = "inicio" 
        pasarImagen(idAnterior,direccion,modal)
    }

}

function pasarImagen(id,direccion){
    const notificacion = document.getElementsByClassName("modalNotificaciones3")[0]
    const img = document.getElementById("img"+id)
    notificacion.style.display = "none"

    if(!img && direccion == "inicio"){
        notificacion.style.display = "block"
        notificacion.textContent = `Haz llegado al ${direccion}`
        return
    }
    else if(!img && direccion == "final"){
        notificacion.textContent = "Cargando..."
        notificacion.style.display = "block"
        setTimeout(()=>{
            notificacion.style.display = "none"
        },3000)
        return
    }
    const src = img.src
    const info = "next"
    CerrarExpandirImg()
    ExpandirImagen( "img"+id, src, id,info)
}

export async function Descargar(ids , info){
    const notificacion = document.getElementsByClassName("modalNotificaciones3")[0]
    const cantidad = ids.length
    let en_proceso = 0
    for(const id of ids){
        en_proceso ++;
        notificacion.classList.add("modalNotificaciones3_error_mode")
        notificacion.textContent = `Preparando para la descarga... ${en_proceso} de ${cantidad}`
        const {data , error} = await supabase
                .from("Imagenes")
                .select("name, data")
                .eq("id",id)
                .single()
        
        if(error){
            console.log("Ha ocurrido un error al obtener los datos de la imagen", error)
            notificacion.textContent = "Ha ocurrido un error, intentar de nuevo "
            notificacion.style.backgroundColor = "#d81b37" 
            setTimeout(()=>{
            notificacion.style.backgroundColor = "#17b95a"
            notificacion.classList.remove("modalNotificaciones3_error_mode")
            },3000) 

        }  
        if(data){
            const src = data.data
            const name = data.name
            const enlace = document.createElement("a")
            enlace.download = name
            enlace.href = `data:image/jpeg;base64,${src}`
            document.body.appendChild(enlace)
            enlace.click()
            document.body.removeChild(enlace)
            
            setTimeout(()=>{
            notificacion.classList.remove("modalNotificaciones3_error_mode")
            },3000) 
        }        
    }
    if(info == "many"){
        cambiarEstadoCheckbox()
    }
    
}