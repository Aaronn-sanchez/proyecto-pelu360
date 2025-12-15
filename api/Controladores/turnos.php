<?php

require_once __DIR__ . '/../Conexion.php';
require_once __DIR__ . '/../Clases/turnosClass.php';

class Turnos {

    private $turnosClass;

    public function __construct() {
        $conexion = new Conexion();
        $pdo = $conexion->getConexion();
        $this->turnosClass = new TurnosClass($pdo);
    }

    // =====================================================
    // GET
    // =====================================================
    public function get() {
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        try {
            if (isset($_GET['completo']) && $_GET['completo'] == '1') {
                $data = $this->turnosClass->obtenerTodosCompletos();
            } elseif (isset($_GET['id'])) {
                $data = $this->turnosClass->obtenerCompletoPorId($_GET['id']);
            } elseif (isset($_GET['fecha'])) {
                $data = $this->turnosClass->obtenerPorFecha($_GET['fecha']);
            } elseif (isset($_GET['empleado'])) {
                $data = $this->turnosClass->obtenerPorEmpleado($_GET['empleado']);
            } elseif (isset($_GET['cliente'])) {
                $data = $this->turnosClass->obtenerPorCliente($_GET['cliente']);
            } elseif (isset($_GET['estado'])) {
                $data = $this->turnosClass->obtenerPorEstado($_GET['estado']);
            } elseif (isset($_GET['estadisticas'])) {
                $data = $this->turnosClass->obtenerEstadisticas();
            } else {
                $data = $this->turnosClass->obtenerTodosCompletos();
            }

            echo json_encode($data);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "msg" => "Error al obtener turnos: " . $e->getMessage()
            ]);
        }
    }

    // =====================================================
    // POST
    // =====================================================
    public function post() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $resultado = $this->turnosClass->crear($data);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["msg" => "Error al crear turno: " . $e->getMessage()]);
        }
    }

    // =====================================================
    // PUT - Modificar o Aceptar turno
    // =====================================================
    public function put() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            // ✅ NUEVA LÓGICA: Si viene "accion: aceptar", usar el método específico
            if (isset($data['accion']) && $data['accion'] === 'aceptar') {
                $resultado = $this->turnosClass->aceptar($data);
            } else {
                $resultado = $this->turnosClass->modificar($data);
            }
            
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["msg" => "Error al modificar turno: " . $e->getMessage()]);
        }
    }

    // =====================================================
    // DELETE
    // =====================================================
    public function delete() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $resultado = $this->turnosClass->eliminar($data['id_turno']);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["msg" => "Error al eliminar turno: " . $e->getMessage()]);
        }
    }
}