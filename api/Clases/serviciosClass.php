<?php

require_once __DIR__ . '/../Conexion.php';

class ServiciosClass {

    private $pdo;

    public function __construct() {
        $conexion = new Conexion();
        $this->pdo = $conexion->getConexion();
    }

    // ======================================================
    // GET → obtener todos los servicios
    // ======================================================
    public function get() {
        try {
            $sql = "SELECT id_servicio, nombre_servicio, duracion_estimada 
                    FROM servicios 
                    WHERE activo = 1 
                    ORDER BY id_servicio ASC";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();

            return ["ok" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];

        } catch (Exception $e) {
            return ["ok" => false, "msg" => $e->getMessage()];
        }
    }

    // ======================================================
    // GET BY ID
    // ======================================================
    public function getById($id) {
        try {
            $sql = "SELECT id_servicio, nombre_servicio, duracion_estimada 
                    FROM servicios 
                    WHERE id_servicio = :id AND activo = 1";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([":id" => $id]);

            return ["ok" => true, "data" => $stmt->fetch(PDO::FETCH_ASSOC)];

        } catch (Exception $e) {
            return ["ok" => false, "msg" => $e->getMessage()];
        }
    }

    // ======================================================
    // POST → crear servicio
    // ======================================================
    public function post($data) {
        try {
            if (!isset($data["nombre_servicio"]) || trim($data["nombre_servicio"]) === "") {
                return ["ok" => false, "msg" => "El nombre del servicio es obligatorio."];
            }

            $duracion = $data["duracion_estimada"] ?? null;

            $sql = "INSERT INTO servicios (nombre_servicio, duracion_estimada, activo) 
                    VALUES (:nombre, :duracion, 1)";

            $stmt = $this->pdo->prepare($sql);

            $stmt->execute([
                ":nombre" => $data["nombre_servicio"],
                ":duracion" => $duracion
            ]);

            return ["ok" => true, "msg" => "Servicio creado correctamente."];

        } catch (Exception $e) {
            return ["ok" => false, "msg" => $e->getMessage()];
        }
    }

    // ======================================================
    // PUT → actualizar servicio
    // ======================================================
    public function put($data) {
        try {
            if (!isset($data["id_servicio"])) {
                return ["ok" => false, "msg" => "Falta el ID del servicio."];
            }

            $sql = "UPDATE servicios SET 
                        nombre_servicio = :nombre,
                        duracion_estimada = :duracion
                    WHERE id_servicio = :id";

            $stmt = $this->pdo->prepare($sql);

            $stmt->execute([
                ":nombre" => $data["nombre_servicio"],
                ":duracion" => $data["duracion_estimada"] ?? null,
                ":id" => $data["id_servicio"]
            ]);

            return ["ok" => true, "msg" => "Servicio actualizado correctamente."];

        } catch (Exception $e) {
            return ["ok" => false, "msg" => $e->getMessage()];
        }
    }

    // ======================================================
    // DELETE → soft delete
    // ======================================================
    public function delete($id) {
        try {
            $sql = "UPDATE servicios SET activo = 0 WHERE id_servicio = :id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([":id" => $id]);

            return ["ok" => true, "msg" => "Servicio eliminado correctamente."];

        } catch (Exception $e) {
            return ["ok" => false, "msg" => $e->getMessage()];
        }
    }
}
