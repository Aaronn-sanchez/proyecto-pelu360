// ============================================
// VISTA: LOGIN
// ============================================

console.log("✅ login.js cargado");

const Login = {
    
    async procesarLogin() {
        console.log("🔍 Procesando login...");
        
        const usuario = document.getElementById("usuario").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();
        
        console.log("📤 Datos capturados:", { usuario, contraseña: "***" });
        
        if (!usuario || !contraseña) {
            alert("Por favor completa todos los campos");
            return;
        }
        
        try {
            console.log("🌐 Llamando a ApiServicios.login...");
            
            const respuesta = await ApiServicios.login(usuario, contraseña);
            
            console.log("📥 Respuesta procesada:", respuesta);
            
            if (respuesta.success) {
                console.log("✅ Login exitoso");
                
                // Guardar datos
                sessionStorage.setItem('usuario', JSON.stringify(respuesta));
                
                // Guardar en StateManager si existe
                if (typeof StateManager !== 'undefined' && StateManager.setUsuario) {
                    StateManager.setUsuario({
                        id_usuario: respuesta.id_usuario,
                        nombre: respuesta.nombre,
                        apellido: respuesta.apellido,
                        usuario_login: respuesta.usuario_login,
                        rol: respuesta.rol
                    });
                }
                
                // Mostrar notificación
                if (typeof Utilidades !== 'undefined' && Utilidades.mostrarNotificacion) {
                    Utilidades.mostrarNotificacion(
                        `¡Bienvenido/a ${respuesta.nombre}!`, 
                        'success'
                    );
                } else {
                    alert(`¡Bienvenido/a ${respuesta.nombre}!`);
                }
                
                // Redirigir
                console.log("🚀 Redirigiendo a 360.html...");
                setTimeout(() => {
                    window.location.href = "360.html";
                }, 500);
                
            } else {
                console.log("❌ Login fallido:", respuesta.message);
                
                if (typeof Utilidades !== 'undefined' && Utilidades.mostrarNotificacion) {
                    Utilidades.mostrarNotificacion(
                        respuesta.message || 'Usuario o contraseña incorrectos', 
                        'error'
                    );
                } else {
                    alert(respuesta.message || 'Usuario o contraseña incorrectos');
                }
            }
            
        } catch (error) {
            console.error("❌ Error capturado:", error);
            
            if (typeof Utilidades !== 'undefined' && Utilidades.mostrarNotificacion) {
                Utilidades.mostrarNotificacion(
                    'Error al conectar con el servidor', 
                    'error'
                );
            } else {
                alert('Error al conectar con el servidor: ' + error.message);
            }
        }
    },
    
    cerrarSesion() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            if (typeof StateManager !== 'undefined' && StateManager.cerrarSesion) {
                StateManager.cerrarSesion();
            }
            
            sessionStorage.removeItem('usuario');
            
            window.location.href = "login.html";
            
            if (typeof Utilidades !== 'undefined' && Utilidades.mostrarNotificacion) {
                Utilidades.mostrarNotificacion(
                    'Sesión cerrada correctamente', 
                    'info'
                );
            }
        }
    }
};

// ============================================
// CONECTAR EVENTOS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM cargado");
    
    const btnLogin = document.getElementById('btnLogin');
    const loginForm = document.getElementById('loginForm');
    
    if (btnLogin) {
        console.log("✅ Botón encontrado, conectando evento click...");
        
        btnLogin.addEventListener('click', function() {
            console.log("🖱️ Click en botón Ingresar");
            Login.procesarLogin();
        });
    } else {
        console.error("❌ No se encontró el botón btnLogin");
    }
    
    // También permitir Enter en los inputs
    if (loginForm) {
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log("⌨️ Enter presionado");
                    Login.procesarLogin();
                }
            });
        });
    }
});