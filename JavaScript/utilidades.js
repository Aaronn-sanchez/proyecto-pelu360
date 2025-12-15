// ============================================
// UTILIDADES GENERALES
// ============================================

const Utilidades = {
    /**
     * Muestra una notificación temporal con tipo
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} tipo - 'success' | 'error' | 'warning' | 'info'
     */
    mostrarNotificacion(mensaje, tipo = 'success') {
        const colores = {
            success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            error: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
            warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo] || colores.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
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
     * Valida formato de teléfono (6-15 dígitos)
     * @param {string} telefono
     * @returns {boolean}
     */
    validarTelefono(telefono) {
        const regex = /^[0-9]{6,15}$/;
        return regex.test(telefono);
    },
    
    /**
     * Valida nombre/apellido (solo letras y espacios)
     * @param {string} nombre
     * @returns {boolean}
     */
    validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return regex.test(nombre.trim()) && nombre.trim().length >= 2;
    },
    
    /**
     * Formatea fecha DD/MM/YYYY a YYYY-MM-DD
     * @param {string} fecha
     * @returns {string}
     */
    formatearFechaParaDB(fecha) {
        const [dia, mes, año] = fecha.split('/');
        return `${año}-${mes}-${dia}`;
    },
    
    /**
     * Formatea fecha YYYY-MM-DD a DD/MM/YYYY
     * @param {string} fecha
     * @returns {string}
     */
    formatearFechaParaVista(fecha) {
        const [año, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${año}`;
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

console.log("✅ utilidades.js cargado");