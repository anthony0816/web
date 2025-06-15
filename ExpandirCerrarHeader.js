// expandir 
const expandirHeader = document.getElementsByClassName("down")[0]
    expandirHeader.onclick = ()=>{
        ExpandirHeader(expandirHeader)
    }

function ExpandirHeader (down){
    const header = document.getElementsByTagName('header')[0]
    const up = document.getElementsByClassName("up")[0]
    const p = document.getElementsByClassName("p")[0]

    header.classList.add("header_expanded")
    p.classList.remove("hidetext")
    down.style.display = "none"
    up.style.display = "block"
}

// colapsar

const colapsarHeader = document.getElementsByClassName("up")[0]
    colapsarHeader.onclick = ()=>{
        ColapsarHeader(colapsarHeader)
    }

function ColapsarHeader (up){
    const header = document.getElementsByTagName('header')[0]
    const down = document.getElementsByClassName("down")[0]
    const p = document.getElementsByClassName("p")[0]

    header.classList.remove("header_expanded")
    setTimeout(()=>{
    down.style.display = "block"
    up.style.display = "none"
    },500)
    return
    p.classList.add("hidetext")
}