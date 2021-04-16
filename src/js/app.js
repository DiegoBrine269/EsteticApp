let pagina = 1

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp()
})


const iniciarApp = function (){
    mostrarServicios()

    //Resaltar div actual (tabs)
    mostrarSeccion()

    //Ocultar o mostrar la sección, en función a la tab
    cambiarSeccion()

    //Cambia de página
    paginaAnterior()
    paginaSiguiente()

    //Comprueba la página actual para ocultar o mostrar la paginación
    botonesPaginador()

    //Muestra el resumen de la cita o mensaje de error
    mostrarResumen()

    //Almacena el nombre de la cita en el objeto
    nombreCita()

    //Almacena la fecha de la cita en el objeto
    fechaCita()

    //Deshabilitar días anteriores
    deshabilitarFechasPrevias()

    //Almacenamos la hora de la cita en el objeto
    horaCita()
}

function mostrarSeccion(){
    //Eliminar mostrar-seccion de la anterior sección
    const seccionAnterior = document.querySelector('.mostrar-seccion')
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion')
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('mostrar-seccion')


    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual')
    if(tabAnterior){
        tabAnterior.classList.remove('actual')
    }

    //Resaltar tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add('actual')
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e=>{
            e.preventDefault()

            pagina = parseInt(e.target.dataset.paso)

            //Llamar función mostrarSección
            mostrarSeccion()
            botonesPaginador()

        })
    });
}

async function mostrarServicios(){
    try{
        const URL = './servicios.json'
        const resultado = await fetch(URL)
        const db = await resultado.json()

        //Aplicamos destructuring para extraer el atributo servicios de bd
        const { servicios } = db

        let divs = []
        //Iteramos los servicios y creamos el HTML
        servicios.forEach(servicio => {
            //Volvemos a aplicar Destructuring
            const { id, nombre, precio } = servicio

            //DOM scripting 
            //Generar nombre
            const nombreServicio = document.createElement('P')
            nombreServicio.textContent = nombre
            nombreServicio.classList.add('nombre-servicio')

            //Precio
            const precioServicio = document.createElement('P')
            precioServicio.textContent = `$ ${precio}`
            precioServicio.classList.add('precio-servicio')

            //Div condenedor
            const contenedorServicio = document.createElement('DIV')
            contenedorServicio.classList.add('servicio')
            contenedorServicio.dataset.idServicio = id

            //Seleccionar servicio
            contenedorServicio.onclick = seleccionarServicio

            //Añadimos el nombre y el precio al div
            contenedorServicio.append(nombreServicio, precioServicio)

            divs.push(contenedorServicio)           
        });

        const app = document.querySelector('#servicios')
        app.append(...divs)
    }catch(error){
        console.log(error)
    }
}

function seleccionarServicio(e){

    let elemento

    //Forzar a que el elemento que se le dé click sea el div
    if(e.target.tagName === 'DIV'){
        elemento = e.target
    }
    else{
        elemento = e.target.parentElement
    }
 
    elemento.classList.toggle('seleccionado')

    if(elemento.classList.contains('seleccionado')){

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj)
    }
    else{
        const id = parseInt(elemento.dataset.idServicio)
        eliminarServicio(id)
    }
}

function eliminarServicio(id){
    const { servicios } = cita
    cita.servicios = servicios.filter(servicio => servicio.id !== id)
}

function agregarServicio(servicioObj){
    const { servicios } = cita
    cita.servicios = [...servicios, servicioObj]
    console.log(cita)
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#btnSiguiente')
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++
        console.log(pagina)
        botonesPaginador()
        
    })
    
}


function paginaAnterior(){
    const paginaAnterior = document.querySelector('#btnAnterior')
    paginaAnterior.addEventListener('click', ()=>{
        pagina--
        console.log(pagina)
        botonesPaginador()

        
    })
}

function botonesPaginador(){
    const btnSiguiente = document.querySelector('#btnSiguiente')
    const btnAnterior = document.querySelector('#btnAnterior')

    if(pagina === 1){
        btnAnterior.classList.add('ocultar')
        btnSiguiente.classList.remove('ocultar')
    }
    else if (pagina === 3){     
        btnSiguiente.classList.add('ocultar')
        btnAnterior.classList.remove('ocultar')

        //Estamos en la página 3, mostrar el resumen
        mostrarResumen()
    }
    else {
        btnSiguiente.classList.remove('ocultar')
        btnAnterior.classList.remove('ocultar')
    }

    mostrarSeccion()
}

function mostrarResumen(){
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita

    //Seleccionamos el resumen
    const divResumen = document.querySelector('.contenido-resumen')

    
    //Limpiar mensaje previo
    while(divResumen.firstChild){
        divResumen.removeChild(divResumen.firstChild)
    }

    //Validación de objeto
    if(Object.values(cita).includes('')){
        //Algún atributo de la cita está vacío
        const noServicios = document.createElement('P')
        noServicios.textContent = 'Faltan información para la cita, compruebe sus datos'
        noServicios.classList.add('invalida-cita')
        
        //Agregamos el mensaje al div
        divResumen.append(noServicios)
        return
    }

    //Mostrar resumen

    const headingCita = document.createElement('H3')
    headingCita.textContent = 'Resumen de cita'

    const nombreCita = document.createElement('P')
    nombreCita.innerHTML = `<span> Nombre: </span> ${nombre}`

    const fechaCita = document.createElement('P')
    fechaCita.innerHTML = `<span> Fecha: </span> ${fecha}`

    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span> Hora: </span> ${hora}`

    const serviciosCita = document.createElement('DIV')
    serviciosCita.classList.add('resumen-servicios')

    const headingServicios = document.createElement('H3')
    headingServicios.textContent = 'Resumen de servicios'

    //Cantidad a pagar
    let cantidad = 0

    //Iteramos el arreglo de servicios para agregarlo
    servicios.forEach(servicio =>{

        const { nombre, precio } = servicio

        const contenedorServicio = document.createElement('DIV')
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre

        const precioServicio = document.createElement('P')
        precioServicio.textContent = precio
        precioServicio.classList.add('precio')

        const totalServicio = precio.split('$')
        cantidad += parseInt(totalServicio[1].trim())

        //Colocar texto y precio en el div
        contenedorServicio.append(textoServicio, precioServicio)

        serviciosCita.append(contenedorServicio)
    })

    const cantidadPagar = document.createElement('P')
    cantidadPagar.innerHTML = `<span> Total a pagar: </span> $ ${cantidad}`
    cantidadPagar.classList.add('total')

    divResumen.append(headingCita, nombreCita, fechaCita, horaCita, headingServicios, serviciosCita, cantidadPagar)
}

function nombreCita(){
    const txtNombre = document.querySelector('#txtNombre')

    txtNombre.addEventListener('input', e =>{
        nombreTexto = e.target.value.trim() //trim nos permite eliminar los espacios en balnco al inicio y l final
        
        //Validación del nombre

        if(nombreTexto === ''  || nombreTexto.length < 3){
            console.log('Nombre no válido')
            mostrarAlerta('Nombre no válido', 'error')
        }
        else{
            const alerta = document.querySelector('.alerta')
            if(alerta)
                alerta.remove()
            cita.nombre = nombreTexto
            
        }
    })
}

function mostrarAlerta(mensaje, tipo){

    //Si ya hay una alerta, entonces ya no crear otra
    const alertaPrevia = document.querySelector('.alerta')

    if(alertaPrevia){
        return
    }


    const alerta = document.createElement('DIV')
    alerta.textContent = mensaje
    alerta.classList.add('alerta')
    
    switch(tipo){
        case 'error':
           alerta.classList.add('error')
           break 
        
    }

    //Adjuntamos en el html
    const formulario = document.querySelector('.formulario')
    formulario.append(alerta)

    //Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove()
    }, 3000)
}

function fechaCita(){
    const dpFecha = document.querySelector('#dpFecha')

    dpFecha.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay()
        console.log(dia)


        //No se trabaja el domingo
        if([0].includes(dia)){
            e.preventDefault()
            dpFecha.value = ''
            mostrarAlerta('Lo sentimos, no hay servicio los domingos', 'error')
        }
        else{
            cita.fecha = dpFecha.value
        }

    })
}

function deshabilitarFechasPrevias(){
    const dpFecha = document.querySelector('#dpFecha')

    const fechaHoy = new Date()
    const year = fechaHoy.getFullYear()
    const mes = fechaHoy.getMonth() + 1
    const dia = fechaHoy.getDate()
    
    //Formato deseado: DD-MM-AAAAA
    const fechaMin = `${year}-${mes < 10 ?  `0${mes}`: mes }-${dia <10 ? `0${dia}`:dia}`;
    
    dpFecha.min = fechaMin
}

function horaCita(){
    const tpHora = document.querySelector('#tpHora')

    tpHora.addEventListener('input', e => {
        const horaCita = e.target.value
        const hora = horaCita.split(':')

        if(hora[0] < 9 || hora[0] > 18){
            mostrarAlerta('Hora no válida', 'error')
            setTimeout(()=>{
                tpHora.value = ''
            }, 3000)
        }
        else{
            cita.hora = horaCita
            console.log(cita)
        }

    })
}