// ============================================
// ROUTER - SISTEMA DE NAVEGACIÓN
// ============================================

const Router = {
    /**
     * Navega a una sección diferente
     * @param {string} seccion - Nombre de la sección (inicio, turnos, empleados)
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
     * @param {string} accion - Nombre de la acción (ver, agregar, buscar, etc.)
     */
    navegarAccion(accion) {
        StateManager.cambiarAccion(accion);
        Sidebar.render();
        Utilidades.cerrarSidebarMobile();
        
        this.renderSeccionActual();
    },
    
    /**
     * Renderiza la sección actual según el estado
     */
    renderSeccionActual() {
        const seccion = State.seccionActual;
        
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