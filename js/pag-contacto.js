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
