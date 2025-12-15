// ============================================
// MODAL DE SERVICIOS - OPTIMIZADO
// ============================================

const ServiciosModal = {
    
    // ============================================
    // CONSTANTES
    // ============================================
    LIMITES: {
        NOMBRE: 50,
        HORAS_MAX: 8,
        MINUTOS_MAX: 59,
        DURACION_MAXIMA_MINUTOS: 480,
        NOMBRE_MIN: 3
    },

    // ============================================
    // VALIDACIONES COMPARTIDAS
    // ============================================
    validarRango(valor, min, max, nombreCampo) {
        if (isNaN(valor)) return min;
        if (valor < min) return min;
        if (valor > max) {
            Utilidades.mostrarNotificacion(`⚠️ Máximo ${max} ${nombreCampo} permitid${nombreCampo === 'horas' ? 'as' : 'os'}`);
            return max;
        }
        return valor;
    },

    validarNombreServicio(nombre) {
        if (!nombre) {
            Utilidades.mostrarNotificacion('⚠️ Ingresa el nombre del servicio');
            return false;
        }
        
        if (nombre.length < this.LIMITES.NOMBRE_MIN) {
            Utilidades.mostrarNotificacion(`⚠️ El nombre debe tener al menos ${this.LIMITES.NOMBRE_MIN} caracteres`);
            return false;
        }
        
        const existe = State.servicios.some(
            s => s.nombre_servicio.toLowerCase() === nombre.toLowerCase()
        );
        
        if (existe) {
            Utilidades.mostrarNotificacion(`⚠️ El servicio "${nombre}" ya existe`);
            return false;
        }
        
        return true;
    },

    validarDuracion(horas, minutos) {
        if (horas === 0 && minutos === 0) {
            Utilidades.mostrarNotificacion('⚠️ La duración debe ser mayor a 0');
            return false;
        }
        
        const totalMinutos = (horas * 60) + minutos;
        if (totalMinutos > this.LIMITES.DURACION_MAXIMA_MINUTOS) {
            Utilidades.mostrarNotificacion('⚠️ La duración máxima es de 8 horas');
            return false;
        }
        
        return true;
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

    // ============================================
    // SETUP DE CONTADORES
    // ============================================
    setupContador(inputId, contadorId, limite) {
        const input = document.getElementById(inputId);
        const contador = document.getElementById(contadorId);
        
        input.addEventListener('input', () => {
            const longitud = input.value.length;
            if (longitud > limite) {
                input.value = input.value.substring(0, limite);
                Utilidades.mostrarNotificacion(`⚠️ Máximo ${limite} caracteres`);
            }
            
            contador.textContent = `${input.value.length}/${limite}`;
            
            // Cambiar color según proximidad al límite
            if (longitud >= limite - 5) {
                contador.style.color = '#c0392b';
                contador.style.fontWeight = 'bold';
            } else if (longitud >= limite - 15) {
                contador.style.color = '#e67e22';
            } else {
                contador.style.color = '#999';
                contador.style.fontWeight = 'normal';
            }
        });
    },

    // ============================================
    // PREVENIR ENTRADAS INVÁLIDAS
    // ============================================
    setupInputNumerico(input) {
        input.addEventListener('keydown', (e) => {
            // Permitir: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
                (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        input.addEventListener('paste', (e) => {
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(pastedText)) {
                e.preventDefault();
                Utilidades.mostrarNotificacion('⚠️ Solo se permiten números');
            }
        });
    },

    crearModal() {
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
                                           maxlength="${this.LIMITES.NOMBRE}"
                                           required>
                                    <small class="text-muted">
                                        <i class="fas fa-info-circle"></i> 
                                        Máximo ${this.LIMITES.NOMBRE} caracteres
                                        <span id="contadorNombre" style="float: right; color: #999;">0/${this.LIMITES.NOMBRE}</span>
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
                                                   max="${this.LIMITES.HORAS_MAX}" 
                                                   value="0">
                                            <small class="text-muted">0-${this.LIMITES.HORAS_MAX} horas</small>
                                        </div>
                                        <div class="col-6">
                                            <input type="number" 
                                                   class="form-control form-control-custom" 
                                                   id="modalMinutos" 
                                                   placeholder="Minutos" 
                                                   min="0" 
                                                   max="${this.LIMITES.MINUTOS_MAX}" 
                                                   value="30">
                                            <small class="text-muted">0-${this.LIMITES.MINUTOS_MAX} minutos</small>
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
        const modalHoras = document.getElementById('modalHoras');
        const modalMinutos = document.getElementById('modalMinutos');
        const vistaPrevia = document.getElementById('vistaPrevia');
        const textoPrevia = document.getElementById('textoPrevia');
        
        // Setup contador de nombre
        this.setupContador('modalNombreServicio', 'contadorNombre', this.LIMITES.NOMBRE);
        
        // Sanitización del nombre
        nombreInput.addEventListener('blur', () => {
            nombreInput.value = nombreInput.value.replace(/\s+/g, ' ').trim();
            
            if (nombreInput.value) {
                nombreInput.value = nombreInput.value.charAt(0).toUpperCase() + 
                                   nombreInput.value.slice(1);
            }
        });
        
        // Actualizar vista previa
        const actualizarPrevia = () => {
            const horas = parseInt(modalHoras.value) || 0;
            const minutos = parseInt(modalMinutos.value) || 0;
            
            if (horas === 0 && minutos === 0) {
                vistaPrevia.style.display = 'none';
                return;
            }
            
            textoPrevia.textContent = this.formatearDuracion(horas, minutos);
            vistaPrevia.style.display = 'block';
        };
        
        modalHoras.addEventListener('input', actualizarPrevia);
        modalMinutos.addEventListener('input', actualizarPrevia);
        
        // Validar rangos con función compartida
        modalHoras.addEventListener('blur', () => {
            const val = this.validarRango(
                parseInt(modalHoras.value), 
                0, 
                this.LIMITES.HORAS_MAX, 
                'horas'
            );
            modalHoras.value = val;
            actualizarPrevia();
        });
        
        modalMinutos.addEventListener('blur', () => {
            const val = this.validarRango(
                parseInt(modalMinutos.value), 
                0, 
                this.LIMITES.MINUTOS_MAX, 
                'minutos'
            );
            modalMinutos.value = val;
            actualizarPrevia();
        });
        
        // Setup inputs numéricos
        this.setupInputNumerico(modalHoras);
        this.setupInputNumerico(modalMinutos);
        
        // Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardar();
        });
        
        // Limpiar al cerrar
        const modal = document.getElementById('modalNuevoServicio');
        modal.addEventListener('hidden.bs.modal', () => {
            form.reset();
            vistaPrevia.style.display = 'none';
            document.getElementById('contadorNombre').textContent = `0/${this.LIMITES.NOMBRE}`;
            document.getElementById('contadorNombre').style.color = '#999';
            modalHoras.value = 0;
            modalMinutos.value = 30;
        });
        
        actualizarPrevia();
    },
    
    async guardar() {
        const nombreServicio = document.getElementById('modalNombreServicio').value.trim();
        const horas = parseInt(document.getElementById('modalHoras').value) || 0;
        const minutos = parseInt(document.getElementById('modalMinutos').value) || 0;
        
        // Validaciones usando funciones compartidas
        if (!this.validarNombreServicio(nombreServicio)) {
            document.getElementById('modalNombreServicio').focus();
            return;
        }
        
        if (!this.validarDuracion(horas, minutos)) {
            document.getElementById('modalMinutos').focus();
            return;
        }
        
        // Crear servicio
        const duracionFormateada = this.formatearDuracion(horas, minutos);
        
        const nuevoServicio = {
            nombre_servicio: nombreServicio,
            duracion_estimada: duracionFormateada
        };
        
        const resultado = await ApiServicios.crearServicio(nuevoServicio);
        
        if (resultado.ok) {
            Utilidades.mostrarNotificacion('✅ Servicio agregado exitosamente');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoServicio'));
            modal.hide();
            
            await this.actualizarSelectServicios();
            
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
        
        servicioSelect.innerHTML = '<option value="">Seleccionar servicio...</option>';
        
        State.servicios.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id_servicio;
            option.setAttribute('data-duracion', s.duracion_estimada);
            option.textContent = `${s.nombre_servicio} (${s.duracion_estimada})`;
            servicioSelect.appendChild(option);
        });
    }
};

console.log("✅ serviciosModal.js optimizado cargado"); 