/* ----------------------------------------------------------------- GALERIA Y FILTRO DE PRODUCTOS -------------------------------------------------------------------- */

const contenedorProductos = document.getElementById("contenedor-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroMarca = document.getElementById("filtro-marca");
const filtroPrecio = document.getElementById("filtro-precio");

if (contenedorProductos) {
    let listaProductos = [];

    // Cargar los productos desde el archivo JSON
    fetch ("../data/productos.json")
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los productos");
            }

            return respuesta.json();
        })
        .then(productos=> {
            listaProductos = productos;
            mostrarProductos(listaProductos);
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            contenedorProductos.textContent="No se han podido cargar los productos.";
        });
    // Crear y mostrar las tarjetas 
    function mostrarProductos(productos) {
        contenedorProductos.innerHTML = "";

        if (productos.length === 0){
            contenedorProductos.textContent= "No hay productos que coincidan con los filtros.";
            return;
        }

        productos.forEach(producto => {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjeta-producto");

            const imagen = document.createElement("img");
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;

            const nombre = document.createElement("h3");
            nombre.textContent = producto.nombre;

            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion;

            const precio = document.createElement("p");
            precio.textContent = producto.precio + "€"

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(nombre);
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(precio);

            contenedorProductos.appendChild(tarjeta);
        })
    }

    //Aplicar filros seleccionados 
    function filtrarProductos(){
        const categoriaSeleccionada = filtroCategoria.value;
        const marcaSeleccionada = filtroMarca.value;
        const precioSeleccionado = filtroPrecio.value;

        const productosFiltrados = listaProductos.filter( producto=> {
            const coincideCategoria = categoriaSeleccionada === "Todos" || producto.categoria === categoriaSeleccionada;
            const coincideMarca = marcaSeleccionada === "Todas" || producto.marca === marcaSeleccionada;

            let coincidePrecio = true;
            if(precioSeleccionado === "0-200"){
                coincidePrecio = producto.precio > 0 && producto.precio <= 200;
            }else if (precioSeleccionado === "200-400"){
                coincidePrecio = producto.precio > 200 &&producto.precio <= 400;
            }else if (precioSeleccionado === "400-600"){
                coincidePrecio = producto.precio > 400 &&producto.precio <= 600;
            }else if (precioSeleccionado === "600-mas"){
                coincidePrecio = producto.precio > 600 ;
            }

            return coincideCategoria && coincideMarca && coincidePrecio;
        });
        mostrarProductos(productosFiltrados);
    }

    if ( filtroCategoria && filtroMarca && filtroPrecio) {
        filtroCategoria.addEventListener("change", filtrarProductos);
        filtroMarca.addEventListener("change", filtrarProductos);
        filtroPrecio.addEventListener("change", filtrarProductos);
    }
}
