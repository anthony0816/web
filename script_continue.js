import { idsActivos } from "./script.js"
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

export function Seleccionar(CheckbosHidden){
    if(!(CheckbosHidden.checked)){
            idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("divImg"+element)
                        imgDiv.addEventListener('click', ()=>{
                            imgDiv.style.backgroundColor="red"
                        })
            }))
    
    }else{
        idsActivos.forEach((element=>{
                const imgDiv = document.getElementById("divImg"+element)
                        imgDiv.addEventListener('click', ()=>{
                            //
                        })
            }))
    }
    
}