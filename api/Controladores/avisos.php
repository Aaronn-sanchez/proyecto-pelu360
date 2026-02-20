<?php

require_once __DIR__ . '/../Conexion.php';
require_once __DIR__ . '/../Clases/avisosClass.php';

class Avisos {

    private $avisosClass;

    public function __construct() {
        $conexionObj = new Conexion();
        $pdo = $conexionObj->getConexion();
        $this->avisosClass = new AvisosClass($pdo);
    }

    // ===========================
    // GET → obtener avisos
    // ===========================
    public function get() {
        if (isset($_GET['id'])) {
            // Obtener un aviso específico
            $resultado = $this->avisosClass->obtenerAviso($_GET['id']);
        } elseif (isset($_GET['recientes'])) {
            // Obtener avisos recientes
            $limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 5;
            $resultado = $this->avisosClass->obtenerAvisosRecientes($limite);
        } else {
            // Obtener todos los avisos
            $resultado = $this->avisosClass->obtenerAvisos();
        }
        
        echo json_encode($resultado);
    }

    // ===========================
    // POST → crear aviso
    // ===========================
    public function post() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            echo json_encode(["error" => "Datos inválidos"]);
            return;
        }

        $resultado = $this->avisosClass->crearAviso($input);
        echo json_encode($resultado);
    }

    // ===========================
    // PUT → actualizar aviso
    // ===========================
    public function put() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id_aviso'])) {
            echo json_encode(["error" => "ID no proporcionado"]);
            return;
        }

        $resultado = $this->avisosClass->actualizarAviso($input['id_aviso'], $input);
        echo json_encode($resultado);
    }

    // ===========================
    // DELETE → eliminar aviso
    // ===========================
    public function delete() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id_aviso'])) {
            echo json_encode(["error" => "ID no proporcionado"]);
            return;
        }

        $resultado = $this->avisosClass->eliminarAviso($input['id_aviso']);
        echo json_encode($resultado);
    }
}