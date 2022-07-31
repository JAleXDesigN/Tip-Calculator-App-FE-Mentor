const formulario = document.querySelector('#agregar-datos');
const resetBtn = document.querySelector('#reset');
const bill = document.querySelector('#bill');
const custom = document.querySelector('#tip-porcent');
const numberPeople = document.querySelector('#number-people');
const porcentBtn = document.querySelectorAll('#porcent button');

let datosIngresados = {
    bill: '',
    tipPorcent: '',
    numPerson: ''
}

//EventListeners
eventListeners() ;
function eventListeners() {
    //Campos del formulario
    bill.addEventListener('input', validarBill);
    custom.addEventListener('input', validarCustom);
    numberPeople.addEventListener('input', validarNumberPeople);
    resetBtn.addEventListener('click', borrarTodo);
    

    document.addEventListener('DOMContentLoaded', ()=> {
        datosIngresados = JSON.parse(localStorage.getItem('datosIngresados')) || {};
        imprimirHTML();
        if (localStorage.getItem('datosIngresados')) {
            bill.value = datosIngresados.bill;
            custom.value = datosIngresados.tipPorcent;
            numberPeople.value = datosIngresados.numPerson;
        }
    } ) 
}

//Agregar class Selected
porcentBtn.forEach(button =>{
    button.addEventListener('click', () =>{
        porcentBtn.forEach(button =>{
            button.classList.remove('selected');
        })
        button.classList.add('selected');
        custom.value = '';
        custom.classList.remove('border-error');
    });
})

porcentBtn.forEach(button =>{
    button.addEventListener('click', (e)=> {
        const datoBtn = Number(e.target.value);
        if (datoBtn) {
            datosIngresados.tipPorcent = datoBtn; 
        }
        imprimirHTML();
        sincronizarStorage();
    });
});

//Funciones
function validarBill(e) {
    const datoBill = Number(e.target.value);
    datosIngresados.bill = datoBill;

    if (datoBill <= 0 ) {
        mensajeErrorBill('Can\264t be zero', 'error');
        bill.classList.add('border-error');
    } else if (isNaN(datoBill)) {
        mensajeErrorBill('Only numbers are accepted', 'error');
        bill.classList.add('border-error');
    } else {
        bill.classList.remove('border-error');
    }
    sincronizarStorage();
    imprimirHTML();    
}

function validarCustom(e) {
    const datoCustom = Number(e.target.value);
    datosIngresados.tipPorcent = datoCustom;

    if ( isNaN(datoCustom) ) {
        mensajeErrorCustom('Only numbers', 'error');
        custom.classList.add('border-error');
    } else if ( datoCustom < 0 || datoCustom >= 101 ) {
        mensajeErrorCustom('Number out of range', 'error');
        custom.classList.add('border-error');
    } else if ( datoCustom === 0 || !datoCustom ) {
        mensajeErrorCustom('Write a number', 'error');
        custom.classList.add('border-error');
    } else {
        custom.classList.remove('border-error');
    };
    porcentBtn.forEach(button =>{
        button.classList.remove('selected');
    })
    sincronizarStorage();
    imprimirHTML();
}

function validarNumberPeople(e) {
    const datoNumPeople = Number(e.target.value);
    datosIngresados.numPerson = datoNumPeople;

    if (datoNumPeople === 0) {
        mensajeErrorNumPeople('Can\264t be zero', 'error');
        numberPeople.classList.add('border-error');
    } else if (isNaN(datoNumPeople)) {
        mensajeErrorNumPeople('Only numbers', 'error');
        numberPeople.classList.add('border-error');
    } else {
        numberPeople.classList.remove('border-error');
    }
    sincronizarStorage();
    imprimirHTML();
}


//Mensajes de validacion
const mensajeError = document.createElement('p');

function mensajeErrorBill(mensaje, tipo) {
    mensajeError.textContent = mensaje;
    const pError = document.querySelector('.bill');
    pError.appendChild(mensajeError);

    tipoError(tipo);
    removeError();
}
function mensajeErrorCustom(mensaje, tipo) {
    mensajeError.textContent = mensaje;
    const pError = document.querySelector('.porcent');
    pError.appendChild(mensajeError);

    tipoError(tipo);
    removeError();
}
function mensajeErrorNumPeople(mensaje, tipo) {
    mensajeError.textContent = mensaje;
    const pError = document.querySelector('.number-people');
    pError.appendChild(mensajeError);

    tipoError(tipo);
    removeError();
}
function tipoError(tipo) {
    if (tipo === 'error') {
        mensajeError.classList.add('error');
    }
}
function removeError() {
    setTimeout(() => {
        mensajeError.remove(); 
    }, 2000);
}

//Imprimir HTML con los resultados
function imprimirHTML() {
    const { bill, tipPorcent, numPerson } = datosIngresados;
    const amountPerson = document.querySelector('#amount span');
    if (!numPerson || !tipPorcent || bill.value) {
        amountPerson.remove();
        const content = document.createElement('span');
        content.textContent = `$0.00`
        const spanContent = document.querySelector('#amount');
        spanContent.appendChild(content)
    } else {
        let result = ((bill * tipPorcent) / 100) / numPerson;
        let resultDec = result.toFixed(2); 
        amountPerson.remove();
        const content = document.createElement('span');
        content.textContent = `$${resultDec}`;
        const spanContent = document.querySelector('#amount');
        spanContent.appendChild(content)
    }
    
    const amount = ((bill * tipPorcent) / 100) / numPerson;
    const total = document.querySelector('#total span');
    if (!numPerson){
        total === 0;
    } else {
        let result = (bill / numPerson) + amount;
        let resultDec = result.toFixed(2); 
        total.remove();
        const content = document.createElement('span');
        content.textContent = `$${resultDec}`;
        const spanContent = document.querySelector('#total');
        spanContent.appendChild(content)
    }
    //console.log('datosIngresados:', datosIngresados)
    
    resetForm();
}

//Resetera Formulario
function resetForm() {
    let amountRes = document.querySelector('#amount span').textContent;
    let totalRes = document.querySelector('#total span').textContent;
    if (totalRes === '$0.00' || amountRes === '$0.00') {
        resetBtn.disable = true;
        resetBtn.classList.remove('enable');
        resetBtn.classList.add('opacity-50', 'cursor-not-allowed')
    } else {
        resetBtn.disable = false;
        resetBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        resetBtn.classList.add('enable');
    }
}

function borrarTodo() {
    porcentBtn.forEach(button =>{
        button.classList.remove('selected');
    })

    const limpiarContentA = document.querySelector('#amount span');
    limpiarContentA.remove();
    const contentA = document.createElement('span');
    contentA.textContent = '$0.00';
    const spanContentA = document.querySelector('#amount');
    spanContentA.appendChild(contentA);

    const limpiarContentB = document.querySelector('#total span');
    limpiarContentB.remove();
    const contentB = document.createElement('span');
    contentB.textContent = '$0.00';
    const spanContentB = document.querySelector('#total');
    spanContentB.appendChild(contentB);

    datosIngresados = {
        bill: '',
        tipPorcent: '',
        numPerson: ''
    }
    resetBtn.disable = true;
    resetBtn.classList.remove('enable');
    resetBtn.classList.add('opacity-50', 'cursor-not-allowed');
    sincronizarStorage();
};

function sincronizarStorage() {
    localStorage.setItem('datosIngresados', JSON.stringify(datosIngresados));
}
