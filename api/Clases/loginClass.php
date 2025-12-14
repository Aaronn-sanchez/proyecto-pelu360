<?php

class LoginClass {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function autenticar($usuario_login, $contraseña) {

        $sql = "SELECT * FROM usuarios WHERE usuario_login = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$usuario_login]);

        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if (!$usuario) {
            return ["error" => "Usuario no encontrado"];
        }

        // 🔹 Comparar contraseña con hash
        if (!password_verify($contraseña, $usuario["contraseña"])) {
            return ["error" => "Contraseña incorrecta"];
        }

        unset($usuario["contraseña"]); // Nunca devolver la contraseña

        return [
            "success" => true,
            "usuario" => $usuario
        ];
    }
}