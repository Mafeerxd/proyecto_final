import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. CONFIGURACIÓN (Usa tus mismas credenciales)
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

const listaContenedor = document.getElementById('lista-reservaciones');

function escucharReservas() {
    const q = query(collection(db, "reservaciones"), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        listaContenedor.innerHTML = "";

        if (snapshot.empty) {
            listaContenedor.innerHTML = `<tr><td colspan="6" class="text-center text-secondary">No hay reservaciones pendientes.</td></tr>`;
            return;
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><i class="far fa-calendar-alt me-2 text-warning"></i>${data.fecha}</td>
                <td><span class="badge bg-dark border border-secondary">${data.hora}</span></td>
                <td class="small text-info">${data.email}</td>
                <td class="text-center">${data.personas}</td>
                <td class="small text-muted" style="max-width: 200px;">${data.notas || "<em>Sin notas</em>"}</td>
                <td>
                    <div class="d-flex">
                        <button class="btn btn-sm btn-outline-success me-2" onclick="confirmarLlegada(this)">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="borrarReserva('${id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            listaContenedor.appendChild(tr);
        });
    }, (error) => {
        console.error("Error en Snapshot:", error);
        listaContenedor.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Error de permisos. Asegúrate de estar logueado.</td></tr>`;
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Acceso concedido a:", user.email);
        escucharReservas();
    } else {
        console.warn("Acceso denegado. Redirigiendo...");
        alert("Debes iniciar sesión para ver el panel de meseros.");
        window.location.href = "reserva01.html"; 
    }
});

window.confirmarLlegada = (btn) => {
    const fila = btn.closest('tr');
    fila.classList.toggle('opacity-50');
    if(fila.classList.contains('opacity-50')) {
        btn.innerHTML = '<i class="fas fa-undo"></i>';
        btn.classList.replace('btn-outline-success', 'btn-outline-secondary');
    } else {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.replace('btn-outline-secondary', 'btn-outline-success');
    }
};

window.borrarReserva = async (id) => {
    if (confirm("¿Marcar reserva como finalizada/eliminada?")) {
        try {
            await deleteDoc(doc(db, "reservaciones", id));
        } catch (error) {
            alert("Error al eliminar: " + error.message);
        }
    }
};
