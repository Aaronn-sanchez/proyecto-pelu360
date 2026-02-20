// ============================================
// VISTA: NAVBAR
// ============================================

const Navbar = {
    render() {
        const usuario = State.usuarioActual;

        if (!usuario) return;

        // Filtrar secciones según rol
        const secciones = Config.navbarSecciones.filter(
            s => s.roles.includes(State.usuarioActual.rol)
        );

        let navHTML = '';
        secciones.forEach(item => {
            const active = State.seccionActual === item.seccion ? 'active' : '';
            navHTML += `
                <li class="nav-item">
                    <a class="nav-link ${active}" href="#" 
                       onclick="Router.navegarSeccion('${item.seccion}'); return false;">
                        ${item.texto}
                    </a>
                </li>
            `;
        });
        document.getElementById("navMenu").innerHTML = navHTML;

        
        const iconoRol = usuario.rol === "administrador"
            ? '<i class="fas fa-crown" style="color: #ffd700;"></i>'
            : '<i class="fas fa-user-circle"></i>';

       
        document.getElementById("userInfo").innerHTML =
            `${iconoRol} ${usuario.nombre} ${usuario.apellido}`;
    }
};
