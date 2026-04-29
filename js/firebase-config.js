import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAo3jrNj8tE4f1rjtv1ac6baXwbadybpwA",
    authDomain: "mafermex-4f125.firebaseapp.com",
    projectId: "mafermex-4f125",
    storageBucket: "mafermex-4f125.firebasestorage.app",
    messagingSenderId: "140753612550",
    appId: "1:140753612550:web:33bd69a83caf10b8d5b887"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            alert("¡Bienvenido a MaferMex!");

            window.location.href = "reservafin.html"; 

        } catch (error) {
            console.error("Error al ingresar:", error.code);
            alert("Credenciales incorrectas: " + error.message);
        }
    });
}
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("¡Cuenta creada exitosamente!");
            window.location.href = "reserva.html";
        } catch (error) {
            console.error("Error en registro:", error.code);
            alert("Error al registrar: " + error.message);
        }
    });
}

const reservaForm = document.getElementById('reserva-form');

if (reservaForm) {
    reservaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Iniciando proceso de reserva...");

        // 1. Verificar usuario
        const user = auth.currentUser;
        if (!user) {
            alert("Debes estar logueado.");
            return;
        }
        const fechaVal = document.getElementById('reserva-fecha').value;
        const horaVal = document.getElementById('reserva-hora').value;
        const personasVal = document.getElementById('reserva-personas').value;
        const notasVal = document.getElementById('reserva-notas').value || "Sin notas";

        const datosReserva = {
            uid: user.uid,
            email: user.email,
            fecha: fechaVal,
            hora: horaVal,
            personas: personasVal,
            notas: notasVal,
            timestamp: serverTimestamp()
        };

        try {
            console.log("Guardando en Firebase...", datosReserva);
            await addDoc(collection(db, "reservaciones"), datosReserva);

            document.getElementById('t-fecha').textContent = fechaVal;
            document.getElementById('t-hora').textContent = horaVal;
            document.getElementById('t-personas').textContent = personasVal;
            document.getElementById('t-email').textContent = user.email;

            const ticketContainer = document.getElementById('ticket-container');
            ticketContainer.style.display = 'flex'; 
            
            console.log("¡Reserva completada con éxito!");

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar tu reserva: " + error.message);
        }
    });
}