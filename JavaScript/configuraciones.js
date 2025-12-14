// ============================================
// CONFIGURACIONES Y CONSTANTES
// ============================================

const Config = {
    API_BASE_URL: (window.location.hostname === "localhost")
    ? "http://localhost/estetica360/api/index.php"
    : "https://sanchez.ctpoba.com/estetica360/api/index.php",

    // Configuración de menús por sección
    menuConfig: {
        inicio: [
            {id: "ver", icon: "fa-home", text: "Vista General", roles: ["administrador", "empleado"]},
            {id: "alertas", icon: "fa-bell", text: "Gestionar Alertas", roles: ["administrador"]},
            {id: "estadisticas", icon: "fa-chart-line", text: "Estadísticas", roles: ["administrador"]}
        ],
        turnos: [
            {id: "ver", icon: "fa-calendar-check", text: "Ver Turnos", roles: ["administrador", "empleado"]},
            {id: "agregar", icon: "fa-plus-circle", text: "Agregar Turno", roles: ["administrador", "empleado"]},
            {id: "buscar", icon: "fa-search", text: "Buscar Turno", roles: ["administrador"]}
        ],
        empleados: [
            {id: "ver", icon: "fa-users", text: "Ver Empleados", roles: ["administrador"]},
            {id: "agregar", icon: "fa-user-plus", text: "Agregar Empleado", roles: ["administrador"]}
        ]
    },
    
    // Secciones del navbar
    navbarSecciones: [
        {seccion: "inicio", texto: "Inicio", roles: ["administrador", "empleado"]},
        {seccion: "turnos", texto: "Turnos", roles: ["administrador", "empleado"]},
        {seccion: "empleados", texto: "Empleados", roles: ["administrador"]}
    ]
};
