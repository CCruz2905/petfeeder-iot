// Requisitos particle
let accessToken = "38171622b7b626a9d197c71a834cedab0228155d";
let deviceID = "28003b001747393035313137";
let urlHumedad = `https://api.particle.io/v1/devices/${deviceID}/humedad`;
let urlFunction = `https://api.particle.io/v1/devices/${deviceID}/feederRemote`;
let urlFirebase = 'https://pet-feeder-2df3c-default-rtdb.firebaseio.com/state.json';

// Referencia de los elementos
let btnON = document.querySelector('#on');
const body = document.querySelector( 'body' );
const img = document.querySelector( '#img' );
const status = document.querySelector( '#status' );
const conection = document.querySelector( '#conection' );

// Bandera para cambiar imágen
let flag = true;
		
// Listener del botón
btnON.addEventListener( 'click', ()  => {

    feed( "on", accessToken );

});

const feed = ( params, access_token ) => {

    loading();

    // Petición POST para activar la función
    $.post( urlFunction, { params, access_token }, () => {

    }).done( ( data ) => {

        let { return_value } = data;

        value( return_value );
        restore();

    }).fail( () => {

        failed();

    });
}

// Coloca texto e imágen de carga
const loading = () => {

    img.setAttribute( 'src', 'https://lh3.googleusercontent.com/pw/ACtC-3eEjlSYYSkLCRmrzit0gn--zlE2BcqofzG5X-NW4nSh79tDa80-n_qr77bcvFyf1ytMY3GlYt9Z9eOTBILrgJt7fvChGKvo7iPwM2eso2RiG4Bo6jCwpgT3cZrkQY0-4MURq6bWOhaea0Or-d5R9SjG=w732-h975-no?authuser=0');
    btnON.innerText = 'Espere';
    btnON.disabled = true;
    status.innerText = 'Alimentando mascotas';

}

// Regresa al estado inicial
const restore = () => {

    img.setAttribute( 'src', 'https://lh3.googleusercontent.com/pw/ACtC-3ftbysZbOe0u26JMFpxa2Y2XapWY_CuUYrUwfj10jkhcTGPYQz4FHUHavF-aYNWjzJ6E7NYr8g6-Q2PCL5uwkNuz_5NsykaGyrm2FoBze4yvzKleQpG0QOlDeIbobXLmxfjEKyjwGfKAvJEp0Aae6_m=w732-h975-no?authuser=0');
    btnON.innerText = 'Alimentar';
    btnON.disabled = false;
    status.innerText = 'Los gatos esperan su comida';

}

// En caso de fallo
const failed = () => {

    img.setAttribute( 'src', 'https://lh3.googleusercontent.com/pw/ACtC-3c5q6ztEbFrAJQm79DB9eBXM5xEw5OcBr5k4u-3FrtpCaKzRmYb3H2G3N7p1J_zrMatZ6m0MrZN4MUCaK535Si2Pwj6d8B75-3U07QwvFZy-Uw6iBw3UMwngcMtsUYerH6niQzGmoFIC7Syy1B5EKjy=s720-no?authuser=0');
    btnON.innerText = 'Alimentar';
    btnON.disabled = false;
    status.innerText = 'Ocurrió un problema y los michis siguen hambrientos';

    Swal.fire({
        title: 'Ocurrió un problema en la conexión',
        width: 600,
        icon: 'error',
        padding: '3em',
        background: '#fff',
        backdrop: '#FF0000'
    });

}

const value = ( value ) => {
    switch ( value ) {

        case 1:
            Swal.fire({
                title: 'Se han alimentado las mascotas',
                width: 600,
                icon: 'success',
                padding: '3em',
                background: '#fff',
                backdrop: '#00FF00'
            });
            break;
        default:
            failed();
            break;
            
    }
}

const request = ( data, status ) => {

    if (status == "success") {
		let variable = parseFloat(data.result);
		variable = variable.toFixed(2);

        if ( variable < 90 ) {

            btnON.disabled = false;

            c.refresh( variable );

		    setTimeout(getReading, 1000);

        } else {

            c.refresh( variable );
            Swal.fire({
                title: 'El alimento está demasiado humedo, debes cambiarlo',
                width: 600,
                icon: 'error',
                padding: '3em',
                background: '#fff',
                backdrop: '#FF0000'
            });
            btnON.disabled = true;
            setTimeout(request, 1000);

        }
	}
	else {
		alert("There was a problem");
	}

}

const getReading = () => {

    $.get( urlHumedad, { access_token: accessToken }, request ).done( () => {

        conection.style.display = 'none';

    })
    .fail( () => {

        c.refresh( 0 );
        conection.style.display = 'block';
    });

}

var c = new JustGage({
    id: "humedad",
    value: 0,
    min: 0,
    max: 100,
    title: "Humedad",
    label: "%",
    donut: true
});

getReading();