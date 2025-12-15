// ============================================
// VISTA: LOGIN
// ============================================

const Login = {
    
    async procesarLogin() {
        const usuario = document.getElementById("usuario").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();
        
        if (!usuario || !contraseña) {
            Utilidades.mostrarNotificacion(
                "Por favor completa todos los campos", 
                "warning"
            );
            return;
        }
        
        try {
            const respuesta = await ApiServicios.login(usuario, contraseña);
            
            if (respuesta.success) {
                // Guardar sesión
                sessionStorage.setItem('usuario', JSON.stringify(respuesta));
                
                StateManager.setUsuario({
                    id_usuario: respuesta.id_usuario,
                    nombre: respuesta.nombre,
                    apellido: respuesta.apellido,
                    usuario_login: respuesta.usuario_login,
                    rol: respuesta.rol
                });
                
                Utilidades.mostrarNotificacion(
                    `¡Bienvenido/a ${respuesta.nombre}!`, 
                    'success'
                );
                
                setTimeout(() => window.location.href = "360.html", 500);
                
            } else {
                Utilidades.mostrarNotificacion(
                    respuesta.message || 'Usuario o contraseña incorrectos', 
                    'error'
                );
            }
            
        } catch (error) {
            console.error("Error en login:", error);
            Utilidades.mostrarNotificacion(
                'Error al conectar con el servidor', 
                'error'
            );
        }
    },
    
    cerrarSesion() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            StateManager.cerrarSesion();
            sessionStorage.removeItem('usuario');
            window.location.href = "login.html";
        }
    }
};

// ============================================
// EVENTOS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btnLogin');
    const loginForm = document.getElementById('loginForm');
    
    if (btnLogin) {
        btnLogin.addEventListener('click', () => Login.procesarLogin());
    }
    
    if (loginForm) {
        loginForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    Login.procesarLogin();
                }
            });
        });
    }
});

console.log("✅ login.js cargado");