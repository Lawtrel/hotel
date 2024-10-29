document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Pegando os valores dos campos
    const name = document.getElementById("name").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;

    // Dados para enviar para a API
    const reservationData = {
        nome: name,
        data_checkin: checkin,
        data_checkout: checkout,
        numero_hospedes: guests
    };

    // Enviando a reserva para a API
    fetch('https://127.0.0.1/api/reservar', {  // Substitua pela URL da API de reservas
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        // Exibir mensagem de sucesso ou erro com base na resposta da API
        if (data.success) {
            document.getElementById("message").textContent = `Reserva confirmada para ${name}.`;
        } else {
            document.getElementById("message").textContent = 'Erro ao fazer a reserva';
        }
    })
    .catch(error => {
        console.error('Erro ao enviar reserva:', error);
        document.getElementById("message").textContent = 'ERRO ao fazer a reserva. Tente novamente.';
    });
});

// Google Maps - Mapa de Localização
function initMap() {
    var location = { lat: -12.1346692, lng: -38.431337 }; // coordenadas
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location
    });
    var marker = new google.maps.Marker({ position: location, map: map });
}

function displayQuartos(quartos) {
    const galeria = document.querySelector('.gallery');
    galeria.innerHTML = ''; // Limpar a galeria atual

    quartos.forEach(quarto => {
        const div = document.createElement('div');
        div.classList.add('quarto-item');

        const img = document.createElement('img');
        img.src = quarto.imagem_url;
        img.alt = `Quarto ${quarto.numero}`;

        const descricao = document.createElement('p');
        descricao.textContent = `${quarto.descricao} - R$${quarto.preco}`;

        div.appendChild(img);
        div.appendChild(descricao);
        galeria.appendChild(div);
    });
}
