const apiUrl = 'http://localhost:5000/api';
const baseImgPath = './img';

window.onload = async () => {
    loadUserReservations();
    loadAvailableRooms();
    displayUserInfo();
};

async function displayUserInfo() {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');

    if (!token) {
        welcomeMessage.textContent = 'Você não está logado!';
        return;
    }

    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        welcomeMessage.textContent = `Bem-vindo, ${user.name}!`;
        logoutBtn.style.display = 'inline';

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        welcomeMessage.textContent = 'Erro ao carregar usuário.';
    }
}

async function loadUserReservations() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Você precisa estar logado para visualizar suas reservas.");
        window.location.href = 'login.html';
    }
    
    try {
        const response = await fetch(`${apiUrl}/reservas`, {
            method: "GET",
            headers: {
                "x-auth-token": token,
            },
        });
        
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Erro ao carregar as reservas:", errorDetails);
            alert("Erro ao carregar suas reservas.");
            return;
        }

        const reservations = await response.json();
        const reservationsList = document.getElementById("user-reservations");

        if (reservations.length == 0) {
            reservationsList.innerHTML = "<p>Você não tem reservas.</p>";
            console.log(reservations);
            return;
        }

        reservationsList.innerHTML = '';  // Limpar antes de adicionar as novas reservas

        reservations.forEach((reserva) => {
            const card = document.createElement("div");
            card.className = "card";
            const photoPath = `./img/sala${reserva.roomId.nSala}.jpg`;  // Verifique se a imagem existe

            const checkIn = new Date(reserva.checkInDate).toLocaleDateString();
            const checkOut = new Date(reserva.checkOutDate).toLocaleDateString();
            
            card.innerHTML = `
                <h3>Quarto: ${reserva.roomId.nSala}</h3>
                <p>Tipo: ${reserva.roomId.tipoSala}</p>
                <p>Check-in: ${checkIn}</p>
                <p>Check-out: ${checkOut}</p>
                <p>Hóspedes: ${reserva.guests}</p>
                <button onclick="cancelarReserva('${reserva._id}')">Cancelar Reserva</button>
            `;
            reservationsList.appendChild(card);
        });

    } catch (error) {
        console.error("Erro na requisição:", error);
        document.getElementById('user-reservations').innerHTML = '<p>Erro ao buscar reservas...</p>';
    }
}

async function cancelarReserva() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para cancelar uma reserva.");
        window.location.href = 'login.html';
    }

    try {
        const response = await fetch(`${apiUrl}/desfazer-reserva/${reserva._id}`, {
            method: "POST",
            headers: {
                "x-auth-token": token,
            },
        });

        if (response.ok){
            const quarto = await Quarto.findOneAndUpdate( 
                { numero: req.params.numero }, 
                { disponivel: false }, 
                { new: true } 
            );

        } else {
            const errorDetails = await response.json();
            console.error("Erro ao cancelar a reserva:", errorDetails);
            alert("Erro ao cancelar a reserva.");
            return;
        }

        alert("Reserva cancelada com sucesso!");
        loadUserReservations();  // Atualizar a lista de reservas

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao cancelar a reserva.");
    }
}



async function loadAvailableRooms() {
    try {
        const response = await fetch(`${apiUrl}/salas-disponivel`, {
            method: "GET"
        });

        if (!response.ok) {
            console.error("Erro ao carregar os quartos disponíveis.");
            return;
        }

        const rooms = await response.json();
        const roomsList = document.getElementById("available-rooms");

        // Limpar a lista antes de adicionar novos quartos
        roomsList.innerHTML = '';

        if (rooms.length === 0) {
            roomsList.innerHTML = "<p>Não há quartos disponíveis no momento.</p>";
            return;
        }

        // Adicionar os quartos disponíveis à lista
        rooms.forEach((room) => {
            const photoPath = `${baseImgPath}/sala${room.nSala}.jpg`;  // Verifique se a imagem está correta

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${photoPath}" alt="Foto da ${room.tipoSala}" class="room-photo">
                <h3>Quarto: ${room.nSala}</h3>
                <p>Tipo: ${room.tipoSala}</p>
                <p>${room.disponivel ? "Disponível" : "Indisponível"}</p>
                <button data-room-id="${room._id}" ${!room.disponivel ? 'disabled' : ''}>Reservar</button>
            `;

            const button = card.querySelector("button");
            button.addEventListener("click", () => reservarSala(room._id));
            roomsList.appendChild(card);
        });
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao carregar as salas disponíveis.");
    }
}


async function reservarSala(roomId) {
    const checkInDate = localStorage.getItem('checkInDate');
    const checkOutDate = localStorage.getItem('checkOutDate');
    const guests = localStorage.getItem('guests');
    const token = localStorage.getItem('token');

    if (!checkInDate || !checkOutDate || !guests) {
        alert('Você precisa preencher as informações de reserva na página inicial.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/reservar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({
                name: 'Reserva Automática',
                checkInDate,
                checkOutDate,
                guests,
                roomId,
            }),
        });

        if (response.ok) {
            alert('Sala reservada com sucesso!');
            loadUserReservations();
            loadAvailableRooms();

        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao reservar a sala:', error);
        alert('Erro ao reservar a sala. Tente novamente.');
    }
}

