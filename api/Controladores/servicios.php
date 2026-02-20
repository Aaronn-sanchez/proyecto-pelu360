<?php

require_once __DIR__ . "/../Conexion.php";
require_once __DIR__ . "/../Clases/serviciosClass.php";

class Servicios {

    private $servicios;

    public function __construct() {
        $conexion = new Conexion();
        $this->servicios = new ServiciosClass($conexion->getConexion());
    }

    // ===========================
    // GET → obtener servicios
    // ===========================
    public function get() {
        if (isset($_GET["id"])) {
            echo json_encode($this->servicios->getById($_GET["id"]));
        } else {
            echo json_encode($this->servicios->get());
        }
    }

    // ===========================
    // POST → crear servicio
    // ===========================
    public function post() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode(["ok" => false, "msg" => "Datos inválidos"]);
            return;
        }

        echo json_encode($this->servicios->post($data));
    }

    // ===========================
    // PUT → actualizar servicio
    // ===========================
    public function put() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode(["ok" => false, "msg" => "Datos inválidos"]);
            return;
        }

        echo json_encode($this->servicios->put($data));
    }

    // ===========================
    // DELETE → eliminar servicio
    // ===========================
    public function delete() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["id_servicio"])) {
            echo json_encode(["ok" => false, "msg" => "Falta id_servicio"]);
            return;
        }

        echo json_encode($this->servicios->delete($data["id_servicio"]));
    }
}