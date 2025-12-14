<?php

class UsuariosClass {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todos los usuarios
    public function obtenerUsuarios() {
        $sql = "SELECT * FROM usuarios";
        $query = $this->pdo->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un solo usuario
    public function obtenerUsuario($id) {
        $sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$id]);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    // Crear usuario
    public function crearUsuario($data) {

        $campos = ["nombre", "apellido", "usuario_login", "contraseña", "rol"];

        foreach ($campos as $campo) {
            if (!isset($data[$campo])) {
                return ["error" => "El campo '$campo' es obligatorio."];
            }
        }

        $sql = "INSERT INTO usuarios (nombre, apellido, usuario_login, contraseña, rol)
                VALUES (?, ?, ?, ?, ?)";

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([
                $data["nombre"],
                $data["apellido"],
                $data["usuario_login"],
                password_hash($data["contraseña"], PASSWORD_DEFAULT),
                $data["rol"]
            ]);

            return ["success" => "Usuario creado correctamente"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }


    // Actualizar usuario

    public function actualizarUsuario($id, $data) {
    if (!empty($data["contraseña"])) {
        $sql = "UPDATE usuarios 
                SET nombre = ?, apellido = ?, usuario_login = ?, rol = ?, contraseña = ?
                WHERE id_usuario = ?";
        $params = [
            $data["nombre"],
            $data["apellido"],
            $data["usuario_login"],
            $data["rol"],
            password_hash($data["contraseña"], PASSWORD_DEFAULT),
            $id
        ];
    } else {
        $sql = "UPDATE usuarios 
                SET nombre = ?, apellido = ?, usuario_login = ?, rol = ?
                WHERE id_usuario = ?";
        $params = [
            $data["nombre"],
            $data["apellido"],
            $data["usuario_login"],
            $data["rol"],
            $id
        ];
    }

    $query = $this->pdo->prepare($sql);

    try {
        $query->execute($params);
        return ["success" => "Usuario actualizado correctamente"];
    } catch (PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

    // Eliminar usuario
    public function eliminarUsuario($id) {
        $sql = "DELETE FROM usuarios WHERE id_usuario = ?";
        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([$id]);
            return ["success" => "Usuario eliminado"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }
    


}


