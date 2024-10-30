document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    //Checa se usuario esta autenticado.
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Voce precisa estar logado para fazer a reservar.");
        window.location.href = "login.html";
        return;
    }

    // Pegando os valores dos campos
    const name = document.getElementById("name").value;
    const checkInDate  = document.getElementById("checkin").value;
    const checkOutDate  = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;

    // Dados para enviar para a API
    const reservationData = {
        name: name,
        checkInDate : checkInDate,
        checkOutDate: checkOutDate,
        guests: guests
    };

    // Enviando a reserva para a API
   try {
        const response = await fetch('https://127.0.0.1:5000/api/reservar', {  // Substitua pela URL da API de reservas
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(reservationData)
        });

        const data = await response.json();
            // Exibir mensagem de sucesso ou erro com base na resposta da API
            if (response.ok) {
                document.getElementById("message").textContent = `Reserva confirmada para ${name}.`;
            } else {
                document.getElementById("message").textContent = data.message || 'Erro ao fazer a reserva. Tente novamente.';
            }
        } catch(error) {
            console.error('Erro ao enviar reserva:', error);
            document.getElementById("message").textContent = 'Erro ao fazer a reserva. Tente novamente.';
        }
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
