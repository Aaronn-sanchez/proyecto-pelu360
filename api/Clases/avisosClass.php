<?php

class AvisosClass {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todos los avisos
    public function obtenerAvisos() {
        $sql = "SELECT * FROM avisos ORDER BY fecha_publicacion DESC";
        $query = $this->pdo->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un solo aviso
    public function obtenerAviso($id) {
        $sql = "SELECT * FROM avisos WHERE id_aviso = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$id]);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    // Crear aviso
    public function crearAviso($data) {
        $campos = ["titulo", "contenido", "id_usuario"];
        
        foreach ($campos as $campo) {
            if (!isset($data[$campo]) || empty($data[$campo])) {
                return ["error" => "El campo '$campo' es obligatorio."];
            }
        }

        // Si no se proporciona fecha, usar la actual
        $fecha_publicacion = isset($data["fecha_publicacion"]) ? $data["fecha_publicacion"] : date('Y-m-d');

        $sql = "INSERT INTO avisos (titulo, contenido, fecha_publicacion, id_usuario)
                VALUES (?, ?, ?, ?)";

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([
                $data["titulo"],
                $data["contenido"],
                $fecha_publicacion,
                $data["id_usuario"]
            ]);

            return ["success" => "Aviso creado correctamente", "id" => $this->pdo->lastInsertId()];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Actualizar aviso
    public function actualizarAviso($id, $data) {
        $sql = "UPDATE avisos 
                SET titulo = ?, contenido = ?, fecha_publicacion = ?
                WHERE id_aviso = ?";
        
        $params = [
            $data["titulo"],
            $data["contenido"],
            $data["fecha_publicacion"],
            $id
        ];

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute($params);
            return ["success" => "Aviso actualizado correctamente"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Eliminar aviso
    public function eliminarAviso($id) {
        $sql = "DELETE FROM avisos WHERE id_aviso = ?";
        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([$id]);
            return ["success" => "Aviso eliminado"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Obtener avisos recientes (últimos 5)
    public function obtenerAvisosRecientes($limite = 5) {
        $sql = "SELECT * FROM avisos ORDER BY fecha_publicacion DESC LIMIT ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$limite]);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }
}