export async function DisplayFromAlbum(StringAlbum){
    
    const Album = document.getElementById(StringAlbum)
    if(Album){
        const paginas = Array.from(document.getElementsByClassName("gallery_page"))
        console.log("paginas", paginas)
        paginas.forEach((pg)=>{
            pg.style.backgroudColor = "none"
        })
        Album.style.display = "block"
        return
    }else{
        // Crear el album y ponerle las fotos 
    }
    
}