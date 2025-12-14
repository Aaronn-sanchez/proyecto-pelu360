// ============================================
// MODAL DE SERVICIOS - Estilo consistente con clientes
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
                    <div class="modal-content" style="background: white; border-radius: 15px;">
                        <div class="modal-header" style="border-bottom: 2px solid #e9ecef;">
                            <h5 class="modal-title">
                                <i class="fas fa-cut"></i> Registrar Nuevo Servicio
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formNuevoServicio">
                                <div class="mb-3">
                                    <label class="form-label-custom">
                                        <i class="fas fa-cut"></i> Nombre del Servicio
                                    </label>
                                    <input type="text" 
                                           class="form-control form-control-custom" 
                                           id="modalNombreServicio" 
                                           placeholder="Ej: Corte de Cabello"
                                           maxlength="50"
                                           required>
                                    <small class="text-muted">
                                        <i class="fas fa-info-circle"></i> 
                                        Máximo 50 caracteres
                                        <span id="contadorNombre" style="float: right; color: #999;">0/50</span>
                                    </small>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label-custom">
                                        <i class="fas fa-clock"></i> Duración Estimada
                                    </label>
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <input type="number" 
                                                   class="form-control form-control-custom" 
                                                   id="modalHoras" 
                                                   placeholder="Horas" 
                                                   min="0" 
                                                   max="8" 
                                                   value="0">
                                            <small class="text-muted">0-8 horas</small>
                                        </div>
                                        <div class="col-6">
                                            <input type="number" 
                                                   class="form-control form-control-custom" 
                                                   id="modalMinutos" 
                                                   placeholder="Minutos" 
                                                   min="0" 
                                                   max="59" 
                                                   value="30">
                                            <small class="text-muted">0-59 minutos</small>
                                        </div>
                                    </div>
                                    <div id="vistaPrevia" class="mt-2 p-2 rounded" 
                                         style="display: none; background: #f8f9fa; border-left: 3px solid #535c66;">
                                        <strong style="color: #535c66;">Vista previa:</strong> 
                                        <span id="textoPrevia" style="color: #2d3748;"></span>
                                    </div>
                                </div>
                                
                                <div class="d-flex gap-2">
                                    <button type="submit" class="btn btn-custom btn-primary-custom flex-grow-1">
                                        <i class="fas fa-save"></i> Guardar Servicio
                                    </button>
                                    <button type="button" class="btn btn-custom btn-delete" 
                                            data-bs-dismiss="modal">
                                        <i class="fas fa-times"></i> Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupEventos();
    },
    
    setupEventos() {
        const form = document.getElementById('formNuevoServicio');
        const nombreInput = document.getElementById('modalNombreServicio');
        const contadorNombre = document.getElementById('contadorNombre');
        const modalHoras = document.getElementById('modalHoras');
        const modalMinutos = document.getElementById('modalMinutos');
        const vistaPrevia = document.getElementById('vistaPrevia');
        const textoPrevia = document.getElementById('textoPrevia');
        
        // ========================================
        // CONTADOR DE CARACTERES PARA EL NOMBRE
        // ========================================
        nombreInput.addEventListener('input', () => {
            const longitud = nombreInput.value.length;
            contadorNombre.textContent = `${longitud}/50`;
            
            // Cambiar color según proximidad al límite
            if (longitud >= 45) {
                contadorNombre.style.color = '#c0392b';
                contadorNombre.style.fontWeight = 'bold';
            } else if (longitud >= 35) {
                contadorNombre.style.color = '#e67e22';
            } else {
                contadorNombre.style.color = '#999';
                contadorNombre.style.fontWeight = 'normal';
            }
        });
        
        // ========================================
        // VALIDACIÓN Y SANITIZACIÓN DEL NOMBRE
        // ========================================
        nombreInput.addEventListener('blur', () => {
            // Eliminar espacios múltiples
            nombreInput.value = nombreInput.value.replace(/\s+/g, ' ').trim();
            
            // Capitalizar primera letra
            if (nombreInput.value) {
                nombreInput.value = nombreInput.value.charAt(0).toUpperCase() + 
                                   nombreInput.value.slice(1);
            }
            
            // Actualizar contador
            contadorNombre.textContent = `${nombreInput.value.length}/50`;
        });
        
        // ========================================
        // ACTUALIZAR VISTA PREVIA DE DURACIÓN
        // ========================================
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
        
        // ========================================
        // VALIDAR RANGOS DE HORAS Y MINUTOS
        // ========================================
        modalHoras.addEventListener('blur', () => {
            let val = parseInt(modalHoras.value);
            
            // Si está vacío o es inválido, poner 0
            if (isNaN(val)) val = 0;
            
            // Limitar al rango 0-8
            if (val < 0) val = 0;
            if (val > 8) {
                val = 8;
                Utilidades.mostrarNotificacion('⚠️ Máximo 8 horas permitidas');
            }
            
            modalHoras.value = val;
            actualizarPrevia();
        });
        
        modalMinutos.addEventListener('blur', () => {
            let val = parseInt(modalMinutos.value);
            
            // Si está vacío o es inválido, poner 0
            if (isNaN(val)) val = 0;
            
            // Limitar al rango 0-59
            if (val < 0) val = 0;
            if (val > 59) {
                val = 59;
                Utilidades.mostrarNotificacion('⚠️ Máximo 59 minutos');
            }
            
            modalMinutos.value = val;
            actualizarPrevia();
        });
        
        // ========================================
        // PREVENIR NÚMEROS NEGATIVOS Y DECIMALES
        // ========================================
        [modalHoras, modalMinutos].forEach(input => {
            input.addEventListener('keydown', (e) => {
                // Permitir: backspace, delete, tab, escape, enter
                if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                    // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                }
                
                // Prevenir si no es un número
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
                    (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
            
            // Prevenir pegar texto no numérico
            input.addEventListener('paste', (e) => {
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                if (!/^\d+$/.test(pastedText)) {
                    e.preventDefault();
                    Utilidades.mostrarNotificacion('⚠️ Solo se permiten números');
                }
            });
        });
        
        // ========================================
        // SUBMIT DEL FORMULARIO
        // ========================================
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardar();
        });
        
        // ========================================
        // LIMPIAR FORMULARIO AL CERRAR
        // ========================================
        const modal = document.getElementById('modalNuevoServicio');
        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            vistaPrevia.style.display = 'none';
            contadorNombre.textContent = '0/50';
            contadorNombre.style.color = '#999';
            modalHoras.value = 0;
            modalMinutos.value = 30;
        });
        
        // Mostrar vista previa inicial
        actualizarPrevia();
    },
    
    formatearDuracion(horas, minutos) {
        let partes = [];
        
        if (horas > 0) {
            partes.push(horas === 1 ? '1 hora' : `${horas} horas`);
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
        
        // ========================================
        // VALIDACIONES
        // ========================================
        
        // Validar nombre vacío
        if (!nombreServicio) {
            Utilidades.mostrarNotificacion('⚠️ Ingresa el nombre del servicio');
            document.getElementById('modalNombreServicio').focus();
            return;
        }
        
        // Validar longitud mínima
        if (nombreServicio.length < 3) {
            Utilidades.mostrarNotificacion('⚠️ El nombre debe tener al menos 3 caracteres');
            document.getElementById('modalNombreServicio').focus();
            return;
        }
        
        // Validar duración
        if (horas === 0 && minutos === 0) {
            Utilidades.mostrarNotificacion('⚠️ La duración debe ser mayor a 0');
            document.getElementById('modalMinutos').focus();
            return;
        }
        
        // Validar duración máxima razonable (8 horas)
        const totalMinutos = (horas * 60) + minutos;
        if (totalMinutos > 480) {
            Utilidades.mostrarNotificacion('⚠️ La duración máxima es de 8 horas');
            return;
        }
        
        // Verificar duplicados (case-insensitive)
        const existe = State.servicios.some(
            s => s.nombre_servicio.toLowerCase() === nombreServicio.toLowerCase()
        );
        
        if (existe) {
            Utilidades.mostrarNotificacion(
                `⚠️ El servicio "${nombreServicio}" ya existe`
            );
            document.getElementById('modalNombreServicio').focus();
            return;
        }
        
        // ========================================
        // CREAR SERVICIO
        // ========================================
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
            
            // Autoseleccionar el nuevo servicio
            const servicioSelect = document.getElementById('servicioSelect');
            if (servicioSelect) {
                const ultimoServicio = State.servicios[State.servicios.length - 1];
                if (ultimoServicio) {
                    servicioSelect.value = ultimoServicio.id_servicio;
                    servicioSelect.dispatchEvent(new Event('change'));
                }
            }
            
        } else {
            Utilidades.mostrarNotificacion(`❌ Error: ${resultado.msg}`);
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

console.log("✅ serviciosModal.js cargado");