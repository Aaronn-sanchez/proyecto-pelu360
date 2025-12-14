// ============================================
// UTILIDADES GENERALES
// ============================================

const Utilidades = {
    /**
     * Muestra una notificación temporal
     * @param {string} mensaje - Mensaje a mostrar
     */
    mostrarNotificacion(mensaje) {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
            font-weight: 600;
            max-width: 350px;
        `;
        notif.textContent = mensaje;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notif);
            }, 500);
        }, 3000);
    },
    
    /**
     * Aplica una transición al cambiar contenido
     * @param {Function} callback - Función a ejecutar después de la transición
     */
    transicionContenido(callback) {
        const content = document.getElementById("mainContent");
        content.classList.add('fade-out');
        
        setTimeout(() => {
            callback();
            content.classList.remove('fade-out');
        }, 300);
    },
    
    /**
     * Toggle del sidebar en móvil
     */
    toggleSidebarMobile() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },
    
    /**
     * Cierra el sidebar en móvil
     */
    cerrarSidebarMobile() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};