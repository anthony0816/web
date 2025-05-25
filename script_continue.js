import { idsActivos } from "./script.js"
import { extraerNumeros } from "./script.js"
import { supabase } from "./script.js"

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
    }
}

//Funcion para seleccionar
export function RecopilarIds(data){
    data.forEach((element)=>{
        idsActivos.push(element.id)
    })
    console.log("ids activos", idsActivos)
}
// Función para seleccionar las fotos 1x1
export function Seleccionar(CheckbosHidden){
    if(!(CheckbosHidden.checked)){
            idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("img"+element)
                        imgDiv.addEventListener('click', ()=>{
                            imgDiv.style.scale = "0.7"
                            imgDiv.classList.add("selected")
                        })
            }))
    
    }else if(CheckbosHidden.checked){
            idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("img"+element)
                    imgDiv.style.scale = "1"
                    imgDiv.classList.remove("selected")
            }))
    }
    
}

export async function DeleteImg(elements){
    const modalNotificaciones = document.getElementsByClassName("modalNotificaciones")[0]
    const param1 = document.getElementsByClassName("param1")[0]
    const numero1 = extraerNumeros(param1.textContent)
    const param2 = document.getElementsByClassName("param2")[0]
    
    modalNotificaciones.style.display = "block"
    
    for(const element of elements){
        param2.textContent = elements.length
        const id = element.id
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
            }
    }
    param1.textContent = "1"
    param2.textContent = "0"
    modalNotificaciones.style.display = "none"
}