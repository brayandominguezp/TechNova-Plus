/*------------------------CARGAR NOTICIAS INDEX CON FETCH Y JSON ----------------------------------- */

const contenedorNoticias = document.getElementById("contenedor-noticias");

if (contenedorNoticias) {
    fetch("./data/noticias.json")
    .then(respuesta=> {
        if (!respuesta.ok) {
            throw new Error ("No se pudo cargar el archivo de noticias");
        }
        
        return respuesta.json();
    })
    .then(noticias => {
        contenedorNoticias.innerHTML= "";
        
        noticias.forEach(noticia => {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-noticia");

            const titulo = document.createElement("h3");
            titulo.textContent = noticia.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = noticia.descripcion;
            
            const categoria = document.createElement("span");
            categoria.textContent = noticia.categoria;
            
            tarjeta.appendChild(categoria);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(descripcion);
            
            contenedorNoticias.appendChild(tarjeta);
        });
    })
    .catch(error => {
        console.error("Error al cargar las noticias:", error);
        
        contenedorNoticias.textContent = "No se han podido cargar las noticias. Intentalo más tarde.";
    });
}
