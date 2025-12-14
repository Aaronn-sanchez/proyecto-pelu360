<?php

require_once __DIR__ . '/../Conexion.php';
require_once __DIR__ . '/../clases/clientesClass.php';

class Clientes {

    private $pdo;
    private $clientesModel;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->getConexion();
        $this->clientesModel = new ClientesClass($this->pdo);
    }

    // ===========================
    // GET → obtener clientes
    // ===========================
    public function get() {
        echo json_encode($this->clientesModel->obtenerUsuarios());
    }

    // ===========================
    // POST → crear cliente
    // ===========================
    public function post() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode(["error" => "Datos inválidos"]);
            return;
        }

        // Validar teléfono duplicado
        $query = $this->pdo->prepare("SELECT * FROM clientes WHERE Telefono = ?");
        $query->execute([$data["Telefono"]]);
        $existe = $query->fetch(PDO::FETCH_ASSOC);

        if ($existe) {
            echo json_encode(["error" => "Ya existe un cliente con este teléfono"]);
            return;
        }

        $resultado = $this->clientesModel->crearUsuario($data);
        echo json_encode($resultado);
    }

    // ===========================
    // PUT → actualizar teléfono
    // ===========================
    public function put() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["id_cliente"]) || !isset($data["Telefono"])) {
            echo json_encode(["error" => "Faltan datos obligatorios"]);
            return;
        }

        // Validar teléfono duplicado (que no sea el suyo)
        $query = $this->pdo->prepare(
            "SELECT * FROM clientes WHERE Telefono = ? AND id_cliente != ?"
        );
        $query->execute([$data["Telefono"], $data["id_cliente"]]);
        $existe = $query->fetch(PDO::FETCH_ASSOC);

        if ($existe) {
            echo json_encode(["error" => "Ese teléfono pertenece a otro cliente"]);
            return;
        }

        $resultado = $this->clientesModel
                           ->actualizarClienteTelefono($data["id_cliente"], $data["Telefono"]);

        echo json_encode($resultado);
    }

    // ===========================
    // DELETE → eliminar cliente
    // ===========================
    public function delete() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["id_cliente"])) {
            echo json_encode(["error" => "Falta id_cliente"]);
            return;
        }

        $resultado = $this->clientesModel->eliminarUsuario($data["id_cliente"]);
        echo json_encode($resultado);
    }
}
