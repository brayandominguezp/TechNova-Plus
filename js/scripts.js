
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


/* ----------------------------------------------------------------- CALCULO DE PRESUPUESTO -------------------------------------------------------------------- */

    const formularioPresupuesto = document.getElementById("formu");

    if (formularioPresupuesto) {
        const selectorProducto = document.getElementById("producto");
        const selectorPlazo = document.getElementById("plazo");

        const precioBaseElemento = document.getElementById("precio-base");
        const descuentoElemento = document.getElementById("descuento");
        const precioExtrasElemento = document.getElementById("precio-extras");
        const precioTotalElemento = document.getElementById("precio-total");

        const preciosProductos = {
            Smartphones: 999,
            Portatiles: 899,
            Ordenadores: 650,
            Auriculares: 59,
            Accesorios: 25
        };

        function calcularPresupuesto(){
            const productoSeleccionado = selectorProducto.value;
            const precioBase = preciosProductos[productoSeleccionado] || 0;

            const plazoSeleccionado = Number(selectorPlazo.value);

            let porcentajeDescuento = 0;

            if (plazoSeleccionado === 2){
                porcentajeDescuento = 5;
            } else if (plazoSeleccionado === 3){
                porcentajeDescuento = 10;
            }

            const descuento = precioBase * porcentajeDescuento / 100;

            let precioExtras = 0

            const extrasSeleccionados = formularioPresupuesto.querySelectorAll('input[name="extras"]:checked');
            extrasSeleccionados.forEach(extra => {
                precioExtras += Number(extra.value);
            });

            const precioTotal = precioBase - descuento + precioExtras;

            precioBaseElemento.textContent = precioBase.toFixed(2) + " €";
            descuentoElemento.textContent = descuento.toFixed(2) + " €";
            precioExtrasElemento.textContent = precioExtras.toFixed(2) + " €";
            precioTotalElemento.textContent = precioTotal.toFixed(2) + " €";
        }

        formularioPresupuesto.addEventListener("change", calcularPresupuesto);
        calcularPresupuesto();
    }


/* =================================================================================================================================================================================================== MAPA INTERACTIVO DE CONTACTO ===========================================================================================================================================*/
        
        const mapaElemento = document.getElementById("map");
        
        if (mapaElemento && typeof L !== "undefined"){
            /* Coordenadas de la empresa */
            const ubicacionEmpresa = [38.342396,-0.486413]
            /* Crear el mapa */
            const map = L.map("map").setView(ubicacionEmpresa, 16);

            // Cargar el mapa de OpenStreetMap
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:' &copy; OpenStreetMap contributors  Mi openStreetMap'}).addTo(map)
        
            //------------------AÑADIR POP UP --------------------------------------
            const iconoEmpresa = L.icon({
                iconUrl:"../images/popups/alfiler.png",
                shadowUrl:"../images/popups/leaf-shadow.png",
                iconSize: [60,60],
                shadowSize: [50,34],
                iconAnchor: [20,60],
                shadowAnchor: [4,62],
                popupAnchor: [6,-50]
            })

            // Marcador de TechNova Plus
            L.marker(ubicacionEmpresa, { icon: iconoEmpresa})
                .addTo(map)
                .bindPopup(
                    '<h1> TechNova Plus </h1>' +
                    '<a href="../index.html">' +
                    '<img src="../images/image.png" alt="Logo" class="logo linea" >' + 
                    '</a>' + 
                    '<a href="../index.html">TechNova Plus</a>'
                )
                .openPopup()

            // Elemento del boton y mensaje 
            const botonUbicacion = document.getElementById("btn-ubicacion")
            const estadoUbicacion = document.getElementById("estado-ubicacion")
            
            // Localizar al cliente cuando pulse el boton
            if (botonUbicacion && estadoUbicacion){
                botonUbicacion.addEventListener("click", function (){
                    if (!navigator.geolocation){
                        estadoUbicacion.textContent = "Tu navegador no permite obtener la ubicacion.";
                        return;
                    }

                    estadoUbicacion.textContent = "Solicitando tu ubicacion...";

                    
                    navigator.geolocation.getCurrentPosition(

                        function (posicion) {
                            const latitud = posicion.coords.latitude;
                            const longitud = posicion.coords.longitude;

                            const ubicacionCliente = [latitud, longitud];

                            // Icono del cliente
                            const iconoCliente = L.icon({
                                iconUrl:"../images/popups/cliente.png",
                                    shadowUrl:"../images/popups/leaf-shadow.png",
                                    iconSize: [60,60],
                                    shadowSize: [20,40],
                                    iconAnchor: [20,60],
                                    shadowAnchor: [4,62],
                                    popupAnchor: [6,-50]
                            })
                            // Marcar la ubicación del cliente
                            L.marker(ubicacionCliente, { icon: iconoCliente})
                                .addTo(map)
                                .bindPopup("Estás aquí")
                                .openPopup()

                            // Preparar las coordenadas para solicitar la ruta
                            const origen = `${longitud},${latitud}`;
                            const destino = `${ubicacionEmpresa[1]},${ubicacionEmpresa[0]}`;

                            const urlRuta =
                                `https://router.project-osrm.org/route/v1/driving/${origen};${destino}?overview=full&geometries=geojson`;

                            // Solicitar la ruta
                            fetch(urlRuta)
                                .then(respuesta => respuesta.json())
                                .then(datos => {
                                    if (datos.code !== "Ok" || datos.routes.length === 0) {
                                        estadoUbicacion.textContent =
                                            "No se ha podido calcular la ruta.";
                                        return;
                                    }
                                    const coordenadasRuta = datos.routes[0].geometry;
                                    L.geoJSON(coordenadasRuta, {
                                        style: {
                                            color: "#7900d6",
                                            weight: 6
                                        }
                                    }).addTo(map);

                                    estadoUbicacion.textContent =
                                        "¡Ruta calculada! La línea morada indica el camino hasta TechNova Plus.";
                                    map.fitBounds(
                                        L.geoJSON(coordenadasRuta).getBounds(),
                                        { padding: [30, 30] }
                                        );
                                })
                                .catch(error => {
                                    console.error("Error al calcular la ruta:", error);
                                    
                                    estadoUbicacion.textContent =
                                        "No se ha podido calcular la ruta. Inténtalo de nuevo.";
                                });
                        },

                        // Si falla la obtención de la ubicación
                        function (error) {
                            if (error.code === 1) {
                                estadoUbicacion.textContent =
                                    "Has denegado el permiso de ubicación.";
                            } else if (error.code === 2) {
                                estadoUbicacion.textContent =
                                    "No se ha podido determinar tu ubicación.";
                            } else {
                                estadoUbicacion.textContent =
                                    "Se ha agotado el tiempo para obtener tu ubicación. Inténtalo de nuevo.";
                            }
                        },

                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    );
                });
            }
        }