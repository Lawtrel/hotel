// Verificar se o usuário está logado
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcome-message');
    const sessionTime = document.getElementById('session-time');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
        try {
            const response = await fetch('http://localhost:5000/api/current-user', {
                method: 'GET',
                headers: { 'x-auth-token': token },
            });

            if (response.ok) {
                const { user, expiresIn } = await response.json();
                const remainingTime = expiresIn - Math.floor(Date.now() / 1000);

                if (remainingTime <= 0) {
                    alert('Sua sessão expirou. Por favor, faça login novamente.');
                    return logout();
                }

                // Exibir informações do usuário
                welcomeMessage.textContent = `Bem-vindo, ${user.name}!`;
                sessionTime.textContent = `Sessão expira em: ${formatTime(remainingTime)}`;
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
                logoutBtn.style.display = 'inline';

                // Atualizar o tempo restante da sessão
                const interval = setInterval(() => {
                    const newTime = expiresIn - Math.floor(Date.now() / 1000);
                    if (newTime <= 0) {
                        clearInterval(interval);
                        alert('Sessão expirada! Faça login novamente.');
                        return logout();
                    }
                    sessionTime.textContent = `Sessão expira em: ${formatTime(newTime)}`;
                }, 1000);

                logoutBtn.addEventListener('click', () => {
                    clearInterval(interval);
                    logout();
                });
            } else {
                throw new Error('Falha ao obter informações do usuário.');
            }
        } catch (error) {
            console.error('Erro ao verificar usuário logado:', error);
            alert('Erro ao carregar informações do usuário.');
            logout();
        }
    } else {
        welcomeMessage.textContent = '';
        sessionTime.textContent = '';
        logoutBtn.style.display = 'none';
    }
});

// Formatar tempo (segundos para hh:mm:ss)
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Função de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

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
    const checkInDate = document.getElementById("checkin").value;
    const checkOutDate = document.getElementById("checkout").value;
    const guests = parseInt(document.getElementById("guests").value, 10);

    localStorage.setItem("checkInDate", checkInDate);
    localStorage.setItem("checkOutDate", checkOutDate);
    localStorage.setItem("guests", guests);
    
   // Validações básicas
   if (!name || !checkInDate || !checkOutDate || isNaN(guests) || guests < 1) {
    alert("Preencha todos os campos corretamente.");
    return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        alert("A data de check-out deve ser posterior a data de check-in.");
        return;
    }
    // Dados para enviar para a API
    const reservationData = {
        name,
        checkInDate,
        checkOutDate,
        guests,
    };

    // Enviando a reserva para a API
   try {
        const response = await fetch('http://127.0.0.1:5000/api/reservar', {  // Substitua pela URL da API de reservas
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("token"),
            },
            body: JSON.stringify(reservationData)
        });
        const result = await response.json();
            // Exibir mensagem de sucesso ou erro com base na resposta da API
            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "room.html";
                }, 2000);
            } else {
                document.getElementById("message").textContent = 'Erro ao fazer a reserva. Tente novamente.';
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
