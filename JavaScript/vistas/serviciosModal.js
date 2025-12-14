// ============================================
// MODAL DE SERVICIOS
// ============================================

const ServiciosModal = {
    
    crearModal() {
        // Verificar si ya existe el modal
        if (document.getElementById('modalNuevoServicio')) {
            return;
        }
        
        const modalHTML = `
            <div class="modal fade" id="modalNuevoServicio" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                            <h5 class="modal-title">
                                <i class="fas fa-cut"></i> Agregar Nuevo Servicio
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formNuevoServicio">
                                <div class="mb-3">
                                    <label class="form-label fw-bold">
                                        <i class="fas fa-cut"></i> Nombre del Servicio
                                    </label>
                                    <input type="text" class="form-control" id="modalNombreServicio" 
                                           placeholder="Ej: Corte de Cabello" required>
                                    <small class="text-muted">
                                        <i class="fas fa-info-circle"></i> 
                                        Se verificará si ya existe
                                    </small>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label fw-bold">
                                        <i class="fas fa-clock"></i> Duración Estimada
                                    </label>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <input type="number" class="form-control" id="modalHoras" 
                                                   placeholder="Horas" min="0" max="23" value="0">
                                        </div>
                                        <div class="col-6">
                                            <input type="number" class="form-control" id="modalMinutos" 
                                                   placeholder="Minutos" min="0" max="59" value="30">
                                        </div>
                                    </div>
                                    <small class="text-muted">
                                        <i class="fas fa-lightbulb"></i> 
                                        Ingresa las horas y minutos por separado
                                    </small>
                                    <div id="vistaPrevia" class="mt-2 p-2 bg-light rounded" style="display: none;">
                                        <strong>Vista previa:</strong> <span id="textoPrevia"></span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="button" class="btn btn-primary" onclick="ServiciosModal.guardar()" 
                                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                                <i class="fas fa-save"></i> Guardar Servicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupEventos();
    },
    
    setupEventos() {
        const modalHoras = document.getElementById('modalHoras');
        const modalMinutos = document.getElementById('modalMinutos');
        const vistaPrevia = document.getElementById('vistaPrevia');
        const textoPrevia = document.getElementById('textoPrevia');
        
        // Actualizar vista previa al cambiar valores
        const actualizarPrevia = () => {
            const horas = parseInt(modalHoras.value) || 0;
            const minutos = parseInt(modalMinutos.value) || 0;
            
            if (horas === 0 && minutos === 0) {
                vistaPrevia.style.display = 'none';
                return;
            }
            
            const duracionTexto = this.formatearDuracion(horas, minutos);
            textoPrevia.textContent = duracionTexto;
            vistaPrevia.style.display = 'block';
        };
        
        modalHoras.addEventListener('input', actualizarPrevia);
        modalMinutos.addEventListener('input', actualizarPrevia);
        
        // Validar rangos
        modalHoras.addEventListener('blur', () => {
            let val = parseInt(modalHoras.value) || 0;
            if (val < 0) val = 0;
            if (val > 23) val = 23;
            modalHoras.value = val;
            actualizarPrevia();
        });
        
        modalMinutos.addEventListener('blur', () => {
            let val = parseInt(modalMinutos.value) || 0;
            if (val < 0) val = 0;
            if (val > 59) val = 59;
            modalMinutos.value = val;
            actualizarPrevia();
        });
        
        // Limpiar formulario al cerrar
        const modal = document.getElementById('modalNuevoServicio');
        modal.addEventListener('hidden.bs.modal', () => {
            document.getElementById('formNuevoServicio').reset();
            vistaPrevia.style.display = 'none';
            modalHoras.value = 0;
            modalMinutos.value = 30;
        });
    },
    
    formatearDuracion(horas, minutos) {
        let partes = [];
        
        if (horas > 0) {
            partes.push(`${horas}h`);
        }
        
        if (minutos > 0) {
            partes.push(`${minutos} min`);
        }
        
        return partes.length > 0 ? partes.join(' ') : '0 min';
    },
    
    async guardar() {
        const nombreServicio = document.getElementById('modalNombreServicio').value.trim();
        const horas = parseInt(document.getElementById('modalHoras').value) || 0;
        const minutos = parseInt(document.getElementById('modalMinutos').value) || 0;
        
        // Validar nombre
        if (!nombreServicio) {
            Utilidades.mostrarNotificacion('⚠️ Ingresa el nombre del servicio', 'error');
            return;
        }
        
        // Validar duración
        if (horas === 0 && minutos === 0) {
            Utilidades.mostrarNotificacion('⚠️ La duración debe ser mayor a 0', 'error');
            return;
        }
        
        // ✅ Verificar duplicados (case-insensitive)
        const existe = State.servicios.some(
            s => s.nombre_servicio.toLowerCase() === nombreServicio.toLowerCase()
        );
        
        if (existe) {
            Utilidades.mostrarNotificacion(
                `⚠️ El servicio "${nombreServicio}" ya existe`, 
                'error'
            );
            return;
        }
        
        const duracionFormateada = this.formatearDuracion(horas, minutos);
        
        const nuevoServicio = {
            nombre_servicio: nombreServicio,
            duracion_estimada: duracionFormateada
        };
        
        // Llamar a la API
        const resultado = await ApiServicios.crearServicio(nuevoServicio);
        
        if (resultado.ok) {
            Utilidades.mostrarNotificacion('✅ Servicio agregado exitosamente');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoServicio'));
            modal.hide();
            
            // Actualizar select de servicios
            await this.actualizarSelectServicios();
            
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`, 'error');
        }
    },
    
    async actualizarSelectServicios() {
        const servicioSelect = document.getElementById('servicioSelect');
        if (!servicioSelect) return;
        
        // Limpiar opciones excepto la primera
        servicioSelect.innerHTML = '<option value="">Seleccionar servicio...</option>';
        
        // Agregar servicios actualizados
        State.servicios.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id_servicio;
            option.setAttribute('data-duracion', s.duracion_estimada);
            option.textContent = `${s.nombre_servicio} (${s.duracion_estimada})`;
            servicioSelect.appendChild(option);
        });
    }
};