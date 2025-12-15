// Agregar esta sección en tu archivo de turnos o crear uno nuevo llamado misTurnos.js

const MisTurnos = {
    
    /**
     * Renderiza la vista de turnos para empleados
     */
    render() {
        const usuario = State.usuarioActual;
        
        // Solo empleados pueden ver esta vista
        if (usuario.rol !== 'empleado') {
            document.getElementById("mainContent").innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Esta sección es solo para empleados
                </div>
            `;
            return;
        }
        
        // Filtrar turnos asignados a este empleado
        const misTurnos = State.turnos.filter(turno => {
            const empleadoCompleto = `${usuario.nombre} ${usuario.apellido}`;
            return turno.empleado === empleadoCompleto || 
                   turno.id_empleado == usuario.id_usuario;
        });
        
        console.log('👤 Mis turnos:', misTurnos);
        
        const content = `
            <div class="container-fluid">
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="section-title">
                            <i class="fas fa-calendar-check"></i> Mis Turnos Asignados
                        </h2>
                        <p class="text-muted">
                            Aquí puedes ver y confirmar los turnos que te han sido asignados
                        </p>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="card stat-card">
                            <div class="card-body">
                                <h6 class="text-muted">Total Asignados</h6>
                                <h3 class="mb-0">${misTurnos.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card stat-card">
                            <div class="card-body">
                                <h6 class="text-muted">Pendientes</h6>
                                <h3 class="mb-0 text-warning">
                                    ${misTurnos.filter(t => t.estado === 'Pendiente').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card stat-card">
                            <div class="card-body">
                                <h6 class="text-muted">Confirmados</h6>
                                <h3 class="mb-0 text-success">
                                    ${misTurnos.filter(t => t.estado === 'Confirmado').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card custom-card">
                    <div class="card-body">
                        ${this.renderTablaTurnos(misTurnos)}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById("mainContent").innerHTML = content;
    },
    
    /**
     * Renderiza la tabla de turnos
     */
    renderTablaTurnos(turnos) {
        if (turnos.length === 0) {
            return `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    No tienes turnos asignados en este momento
                </div>
            `;
        }
        
        return `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Servicio</th>
                            <th>Estado</th>
                            <th>Sugerencias</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${turnos.map((turno, index) => this.renderFilaTurno(turno, index)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    /**
     * Renderiza una fila de turno
     */
    renderFilaTurno(turno, index) {
        const estadoClass = {
            'Pendiente': 'warning',
            'Confirmado': 'success',
            'Cancelado': 'danger'
        }[turno.estado] || 'secondary';
        
        const puedeAceptar = turno.estado === 'Pendiente';
        
        return `
            <tr>
                <td>${turno.dia || 'Sin fecha'}</td>
                <td><strong>${turno.hora}</strong></td>
                <td>
                    <i class="fas fa-user"></i> ${turno.cliente}
                </td>
                <td>
                    <a href="tel:${turno.telefono}" class="text-decoration-none">
                        <i class="fas fa-phone"></i> ${turno.telefono}
                    </a>
                </td>
                <td>
                    <span class="badge bg-info">${turno.servicio}</span>
                </td>
                <td>
                    <span class="badge bg-${estadoClass}">
                        ${turno.estado}
                    </span>
                </td>
                <td>
                    <small class="text-muted">
                        ${turno.sugerencias || 'Sin sugerencias'}
                    </small>
                </td>
                <td>
                    ${puedeAceptar ? `
                        <button 
                            class="btn btn-sm btn-success" 
                            onclick="MisTurnos.aceptarTurno(${turno.id})"
                            title="Confirmar turno">
                            <i class="fas fa-check"></i> Aceptar
                        </button>
                    ` : `
                        <span class="text-muted">
                            <i class="fas fa-check-circle"></i> Ya confirmado
                        </span>
                    `}
                </td>
            </tr>
        `;
    },
    
    /**
     * Acepta un turno asignado
     */
    async aceptarTurno(id_turno) {
        const usuario = State.usuarioActual;
        
        if (!confirm('¿Confirmar que aceptas este turno?')) {
            return;
        }
        
        try {
            const resultado = await ApiServicios.aceptarTurno(
                id_turno, 
                usuario.id_usuario, 
                usuario.rol
            );
            
            if (resultado.success) {
                Utilidades.mostrarNotificacion('✅ Turno aceptado correctamente');
                
                // Recargar los datos
                await cargarTurnos();
                
                // Re-renderizar la vista
                this.render();
            } else {
                alert('Error: ' + (resultado.msg || 'No se pudo aceptar el turno'));
            }
        } catch (error) {
            console.error('Error al aceptar turno:', error);
            alert('Error al aceptar el turno');
        }
    }
};

// Hacer disponible globalmente
window.MisTurnos = MisTurnos;