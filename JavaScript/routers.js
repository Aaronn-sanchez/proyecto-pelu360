// ============================================
// ROUTER - SISTEMA DE NAVEGACIÓN
// ============================================

const Router = {
    /**
     * Navega a una sección diferente
     * @param {string} seccion 
     */
    navegarSeccion(seccion) {
        StateManager.cambiarSeccion(seccion);
        StateManager.cambiarAccion("ver");
        
        Navbar.render();
        Sidebar.render();
        Utilidades.cerrarSidebarMobile();
        
        this.renderSeccionActual();
    },
    
    /**
     * Navega a una acción dentro de la sección actual
     * @param {string} accion 
     */
    navegarAccion(accion) {
        StateManager.cambiarAccion(accion);
        Sidebar.render();
        Utilidades.cerrarSidebarMobile();
        
        this.renderSeccionActual();
    },
    
    // Renderiza la sección actual según el estado
    
    renderSeccionActual() {
        const seccion = State.seccionActual;
        const accion = State.accionActual;
        
        //  Si estamos en turnos y la acción es "mis_turnos"
        if (seccion === "turnos" && accion === "mis_turnos") {
            if (typeof MisTurnos !== 'undefined') {
                MisTurnos.render();
            } else {
                console.error('❌ MisTurnos no está definido');
                Turnos.render();
            }
            return;
        }
        
        // Renderizado normal según sección
        switch(seccion) {
            case "inicio":
                Inicio.render();
                break;
            case "turnos":
                Turnos.render();
                break;
            case "empleados":
                Empleados.render();
                break;
            default:
                console.warn(`Sección desconocida: ${seccion}`);
                Inicio.render();
        }
    }
};