<?php

require_once __DIR__ . '/../Conexion.php';

class Login {

    private $pdo;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->getConexion();
    }

    // LOGIN con POST
    public function post() {

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["usuario_login"]) || !isset($data["pass"])) {
            echo json_encode(["error" => "Faltan datos"]);
            return;
        }

        $query = $this->pdo->prepare("SELECT * FROM usuarios WHERE usuario_login = :u");
        $query->execute([":u" => $data["usuario_login"]]);
        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            echo json_encode(["error" => "Usuario no encontrado"]);
            return;
        }

        // ✅ Verificar contraseña con password_verify
      if (!password_verify($data["pass"], $usuario["password"])) {

            echo json_encode(["error" => "Contraseña incorrecta"]);
            return;
        }

       unset($usuario["password"]); // Nunca enviar contraseña
        echo json_encode([
            "success" => true,
            "usuario" => $usuario
        ]);
    }

    public function get() { echo json_encode(["error" => "GET no disponible en Login"]); }
    public function put() { echo json_encode(["error" => "PUT no disponible en Login"]); }
    public function delete() { echo json_encode(["error" => "DELETE no disponible en Login"]); }
}
