// ============================================
// VISTA: SIDEBAR
// ============================================

const Sidebar = {
    render() {
        const sidebar = document.getElementById("sidebar");
        const menuItems = Config.menuConfig[State.seccionActual] || [];
        const itemsFiltrados = menuItems.filter(
            item => item.roles.includes(State.usuarioActual.rol)
        );
        
        let html = `
            <h5><i class="fas fa-bars"></i> Menú</h5>
            <ul class="sidebar-menu">
        `;
        
        itemsFiltrados.forEach(item => {
            const active = State.accionActual === item.id ? 'active' : '';
            html += `
                <li class="sidebar-menu-item">
                    <button class="sidebar-menu-btn ${active}" 
                            onclick="Router.navegarAccion('${item.id}')">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.text}</span>
                    </button>
                </li>
            `;
        });
        
        html += `</ul>`;
        sidebar.innerHTML = html;

        
    }
    
};