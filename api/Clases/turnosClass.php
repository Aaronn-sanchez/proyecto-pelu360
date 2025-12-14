<?php

class TurnosClass {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // =====================================================
    // GET - Obtener todos los turnos (simple)
    // =====================================================
    public function obtenerTodos() {
        $sql = "SELECT * FROM turnos ORDER BY dia DESC, horario ASC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turnos con información completa (JOIN)
    // =====================================================
    public function obtenerTodosCompletos() {
        $sql = "
            SELECT 
                t.id_turno,
                t.dia,
                t.horario,
                t.estado,
                t.sugerencias,
                -- Información del cliente
                c.id_cliente,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                c.Telefono AS cliente_telefono,
                -- Información del servicio
                s.id_servicio,
                s.nombre_servicio,
                s.duracion_estimada,
                -- Información del empleado
                u.id_usuario AS id_empleado,
                u.nombre AS empleado_nombre,
                u.apellido AS empleado_apellido
            FROM turnos t
            LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            LEFT JOIN usuarios u ON t.id_empleado = u.id_usuario
            ORDER BY t.dia DESC, t.horario ASC
        ";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turno por ID
    // =====================================================
    public function obtenerPorId($id_turno) {
        $sql = "SELECT * FROM turnos WHERE id_turno = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_turno]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turno completo por ID (con JOIN)
    // =====================================================
    public function obtenerCompletoPorId($id_turno) {
        $sql = "
            SELECT 
                t.*,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                c.Telefono AS cliente_telefono,
                s.nombre_servicio,
                s.duracion_estimada,
                u.nombre AS empleado_nombre,
                u.apellido AS empleado_apellido
            FROM turnos t
            LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            LEFT JOIN usuarios u ON t.id_empleado = u.id_usuario
            WHERE t.id_turno = ?
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_turno]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turnos por fecha
    // =====================================================
    public function obtenerPorFecha($fecha) {
        $sql = "
            SELECT 
                t.*,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                s.nombre_servicio,
                u.nombre AS empleado_nombre,
                u.apellido AS empleado_apellido
            FROM turnos t
            LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            LEFT JOIN usuarios u ON t.id_empleado = u.id_usuario
            WHERE t.dia = ?
            ORDER BY t.horario ASC
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$fecha]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turnos por empleado
    // =====================================================
    public function obtenerPorEmpleado($id_empleado) {
        $sql = "
            SELECT 
                t.*,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                c.Telefono AS cliente_telefono,
                s.nombre_servicio,
                s.duracion_estimada
            FROM turnos t
            LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            WHERE t.id_empleado = ?
            ORDER BY t.dia DESC, t.horario ASC
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_empleado]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turnos por cliente
    // =====================================================
    public function obtenerPorCliente($id_cliente) {
        $sql = "
            SELECT 
                t.*,
                s.nombre_servicio,
                s.duracion_estimada,
                u.nombre AS empleado_nombre,
                u.apellido AS empleado_apellido
            FROM turnos t
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            LEFT JOIN usuarios u ON t.id_empleado = u.id_usuario
            WHERE t.id_cliente = ?
            ORDER BY t.dia DESC, t.horario ASC
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_cliente]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // GET - Obtener turnos por estado
    // =====================================================
    public function obtenerPorEstado($estado) {
        $sql = "
            SELECT 
                t.*,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                s.nombre_servicio,
                u.nombre AS empleado_nombre,
                u.apellido AS empleado_apellido
            FROM turnos t
            LEFT JOIN clientes c ON t.id_cliente = c.id_cliente
            LEFT JOIN servicios s ON t.id_servicio = s.id_servicio
            LEFT JOIN usuarios u ON t.id_empleado = u.id_usuario
            WHERE t.estado = ?
            ORDER BY t.dia DESC, t.horario ASC
        ";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$estado]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =====================================================
    // POST - Crear turno
    // =====================================================
    public function crear($data) {
        try {
            // Validar que el turno no se solape
            if ($this->validarDisponibilidad($data)) {
                $sql = "INSERT INTO turnos (id_servicio, id_empleado, id_cliente, dia, horario, estado, sugerencias)
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
                
                $stmt = $this->pdo->prepare($sql);
                $resultado = $stmt->execute([
                    $data['id_servicio'],
                    $data['id_empleado'],
                    $data['id_cliente'],
                    $data['dia'],
                    $data['horario'],
                    $data['estado'] ?? 'Pendiente',
                    $data['sugerencias'] ?? null
                ]);

                if ($resultado) {
                    return [
                        'success' => true,
                        'id_turno' => $this->pdo->lastInsertId(),
                        'msg' => 'Turno creado correctamente'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'msg' => 'El empleado ya tiene un turno asignado en ese horario'
                ];
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'msg' => 'Error al crear turno: ' . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // PUT - Modificar turno
    // =====================================================
    public function modificar($data) {
        try {
            // Validar disponibilidad (excluyendo el turno actual)
            if ($this->validarDisponibilidad($data, $data['id_turno'])) {
                $sql = "UPDATE turnos SET 
                        id_servicio = ?, 
                        id_empleado = ?, 
                        id_cliente = ?, 
                        dia = ?, 
                        horario = ?, 
                        estado = ?, 
                        sugerencias = ?
                        WHERE id_turno = ?";

                $stmt = $this->pdo->prepare($sql);
                $resultado = $stmt->execute([
                    $data['id_servicio'],
                    $data['id_empleado'],
                    $data['id_cliente'],
                    $data['dia'],
                    $data['horario'],
                    $data['estado'],
                    $data['sugerencias'] ?? null,
                    $data['id_turno']
                ]);

                return [
                    'success' => $resultado,
                    'msg' => $resultado ? 'Turno modificado correctamente' : 'Error al modificar turno'
                ];
            } else {
                return [
                    'success' => false,
                    'msg' => 'El empleado ya tiene un turno asignado en ese horario'
                ];
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'msg' => 'Error al modificar turno: ' . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // DELETE - Eliminar turno
    // =====================================================
    public function eliminar($id_turno) {
        try {
            $sql = "DELETE FROM turnos WHERE id_turno = ?";
            $stmt = $this->pdo->prepare($sql);
            $resultado = $stmt->execute([$id_turno]);
            
            return [
                'success' => $resultado,
                'msg' => $resultado ? 'Turno eliminado correctamente' : 'Error al eliminar turno'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'msg' => 'Error al eliminar turno: ' . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // VALIDAR DISPONIBILIDAD DEL EMPLEADO
    // =====================================================
    private function validarDisponibilidad($data, $id_turno_excluir = null) {
        $sql = "SELECT COUNT(*) as count FROM turnos 
                WHERE id_empleado = ? 
                AND dia = ? 
                AND horario = ?
                AND estado != 'Cancelado'";
        
        $params = [$data['id_empleado'], $data['dia'], $data['horario']];
        
        // Si estamos editando, excluir el turno actual
        if ($id_turno_excluir) {
            $sql .= " AND id_turno != ?";
            $params[] = $id_turno_excluir;
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result['count'] == 0;
    }

    // =====================================================
    // OBTENER ESTADÍSTICAS
    // =====================================================
    public function obtenerEstadisticas() {
        $sql = "
            SELECT 
                COUNT(*) as total_turnos,
                SUM(CASE WHEN estado = 'Confirmado' THEN 1 ELSE 0 END) as confirmados,
                SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estado = 'Cancelado' THEN 1 ELSE 0 END) as cancelados,
                COUNT(DISTINCT id_empleado) as empleados_activos,
                COUNT(DISTINCT id_cliente) as clientes_unicos
            FROM turnos
        ";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}