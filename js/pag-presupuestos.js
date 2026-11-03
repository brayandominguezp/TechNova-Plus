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
