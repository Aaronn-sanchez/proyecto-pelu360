<?php

class Conexion {

    private $host = "auth-db847.hstgr.io";
    private $dbname = "u732148899_sanchez";
    private $user = "u732148899_sanchez";
    private $pass = "Sanchez.2025";

    private $conexion;

    public function __construct() {
        try {
            $this->conexion = new PDO(
                "mysql:host={$this->host};dbname={$this->dbname};charset=utf8",
                $this->user,
                $this->pass
            );

            // Configurar errores para ver qué pasa si algo falla
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $e) {
            echo json_encode([
                "error" => "Error en la conexión: " . $e->getMessage()
            ]);
            exit;
        }
    }

    public function getConexion() {
        return $this->conexion;
    }

}
