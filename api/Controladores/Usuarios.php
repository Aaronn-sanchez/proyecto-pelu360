<?php

require_once __DIR__ . '/../Conexion.php';

class Usuarios {

    private $pdo;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->getConexion();
    }

    // -------------------------
    // GET → Obtener todos los usuarios
    // -------------------------
    public function get() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM usuarios");
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($usuarios);

        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    // -------------------------
    // POST → Crear usuario
    // -------------------------
    public function post() {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
        return;
    }

    try {
        $query = "INSERT INTO usuarios (nombre, apellido, usuario_login, contraseña, rol)
                  VALUES (:nombre, :apellido, :usuario_login, :contraseña, :rol)";
        $stmt = $this->pdo->prepare($query);

        $stmt->execute([
            ":nombre" => $data["nombre"],
            ":apellido" => $data["apellido"],
            ":usuario_login"=> $data["usuario_login"],
            ":contraseña" => password_hash($data["contraseña"], PASSWORD_DEFAULT),
            ":rol" => $data["rol"]
        ]);

        echo json_encode([
            "success" => true,
            "mensaje" => "Usuario creado correctamente"
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
}


    // -------------------------
    // PUT → Actualizar usuario
    // -------------------------
    // -------------------------
// PUT → Actualizar usuario
// -------------------------
public function put() {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id_usuario"])) {
        echo json_encode(["error" => "Falta id_usuario"]);
        return;
    }

    try {
        // Verificar si el usuario a modificar es administrador
        $queryCheck = "SELECT rol FROM usuarios WHERE id_usuario = :id";
        $stmtCheck = $this->pdo->prepare($queryCheck);
        $stmtCheck->execute([":id" => $data["id_usuario"]]);
        $usuarioActual = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        // NUEVA VALIDACIÓN: Solo bloquear si intenta modificarse a SÍ MISMO
        // Necesitas enviar el id_usuario_logueado desde el frontend
        if (isset($data['id_usuario_logueado']) && 
            $data['id_usuario_logueado'] == $data['id_usuario'] && 
            $usuarioActual['rol'] === 'administrador' && 
            isset($data['rol']) && 
            $data['rol'] !== 'administrador') {
            echo json_encode([
                "error" => "No puedes cambiar tu propio rol de administrador"
            ]);
            return;
        }

        // Actualizar usuario (ahora SÍ puede cambiar el rol de otros)
        $query = "UPDATE usuarios 
                  SET nombre = :nombre,
                      apellido = :apellido,
                      usuario_login = :usuario_login,
                      rol = :rol
                  WHERE id_usuario = :id";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ":nombre"       => $data["nombre"],
            ":apellido"     => $data["apellido"],
            ":usuario_login"=> $data["usuario_login"],
            ":rol"          => $data["rol"],
            ":id"           => $data["id_usuario"]
        ]);

        echo json_encode(["mensaje" => "Usuario actualizado"]);

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

    // -------------------------
    // DELETE → Eliminar usuario
    // -------------------------
    public function delete() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data["id_usuario"])) {
            echo json_encode(["error" => "Falta id_usuario"]);
            return;
        }

        try {
            // Verificar si el usuario a eliminar es administrador
            $queryCheck = "SELECT rol FROM usuarios WHERE id_usuario = :id";
            $stmtCheck = $this->pdo->prepare($queryCheck);
            $stmtCheck->execute([":id" => $data["id_usuario"]]);
            $usuario = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$usuario) {
                echo json_encode(["error" => "Usuario no encontrado"]);
                return;
            }

            // Bloquear eliminación de administradores
            if ($usuario['rol'] === 'administrador') {
                echo json_encode([
                    "error" => "No se puede eliminar un usuario administrador"
                ]);
                return;
            }

            // Eliminar usuario
            $query = "DELETE FROM usuarios WHERE id_usuario = :id";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([":id" => $data["id_usuario"]]);

            echo json_encode(["mensaje" => "Usuario eliminado"]);

        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}