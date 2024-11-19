
const apiUrl = 'http://localhost:5000/api';
const listaSalas = document.getElementById('lista-salas');

window.onload = () => {
    loadUserReservations();
    loadAvailableRooms();

    // Exibir mensagem de boas-vindas
    const token = localStorage.getItem("token");
    const welcomeMessage = document.getElementById("welcome-message");
    if (token) {
        const user = JSON.parse(atob(token.split(".")[1])); // Decodifica o token
        welcomeMessage.textContent = `Bem-vindo, ${user.name}!`;
        document.getElementById("logout-btn").style.display = "inline";
    }

    // Adicionar funcionalidade de logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
};


async function loadUserReservations() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${apiUrl}/reservas`, {
            method: "GET",
            headers: {
                "x-auth-token": token,
            },
        });

        if (response.ok) {
            const reservations = await response.json();
            const reservationsList = document.getElementById("user-reservations");
            reservationsList.innerHTML = '';

            reservations.forEach((reserva) => {
                const li = document.createElement("li");
                li.textContent = `Sala: ${reserva.nSala} | Check-in: ${new Date(reserva.checkInDate).toLocaleDateString()} | Check-out: ${new Date(reserva.checkOutDate).toLocaleDateString()}`;
                reservationsList.appendChild(li);
            });
        } else {
            console.error("Erro ao carregar as reservas.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

//Carregar as Salas disponiveis
async function loadAvailableRooms() {
    /*const checkInDate = new Date().toISOString().split('T')[0]; // Data atual
    const checkOutDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Amanhã

        // Validar se as datas foram fornecidas
        if (!checkInDate || !checkOutDate) {
            console.error("Datas de check-in e check-out são obrigatórias.");
            return;
        }
*/
    try {
        const response = await fetch(`${apiUrl}/salas-disponivel`, {
            method: "GET",
        });

        if (response.ok) {
            const rooms = await response.json();
            const roomsList = document.getElementById("available-rooms");
            roomsList.innerHTML = '';

            rooms.forEach((room) => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <h3>Sala: ${room.nSala}</h3>
                    <p>Tipo: ${room.tipoSala}</p>
                    <p>${room.disponivel ? "Disponível" : "Indisponível"}</p>
                    <button data-room-id="${room._id}">Reservar</button>`;
                const button = card.querySelector("button");
                button.addEventListener("click", () => reservarSala(room._id));
                roomsList.appendChild(card);
            });
        } else {
            console.error("Erro ao carregar os quartos disponíveis.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}

async function reservarSala(roomId) {
    const checkInDate = localStorage.getItem("checkInDate");
    const checkOutDate = localStorage.getItem("checkOutDate");
    const guests = localStorage.getItem("guests");

    if (!checkInDate || !checkOutDate || !guests) {
        alert("Você precisa preencher as informações de reserva na página inicial.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("{apiUrl}/reservar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
            },
            body: JSON.stringify({
                name: "Reserva Automática",
                checkInDate,
                checkOutDate,
                guests,
            }),
        });

        if (response.ok) {
            alert("Sala reservada com sucesso!");
            window.location.reload();
        } else {
            const error = await response.json();
            console.error("Erro ao reservar a sala:", error.message);
            alert("Erro ao reservar a sala. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao reservar a sala. Tente novamente.");
    }
}