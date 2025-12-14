<?php

class ClientesClass {

    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todos los clientes
    public function obtenerUsuarios() {
        $sql = "SELECT * FROM clientes";
        $query = $this->pdo->prepare($sql);
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un solo cliente
    public function obtenerUsuario($id) {
        $sql = "SELECT * FROM clientes WHERE id_cliente = ?";
        $query = $this->pdo->prepare($sql);
        $query->execute([$id]);
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    // Crear cliente
    public function crearUsuario($data) {

        $sql = "INSERT INTO clientes (Nombre, Apellido, Telefono)
                VALUES (?, ?, ?)";

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([
                $data["Nombre"],
                $data["Apellido"],
                $data["Telefono"]
            ]);

            return ["success" => "Cliente añadido correctamente"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Actualizar telefono
    public function actualizarClienteTelefono($id, $telefono) {

        $sql = "UPDATE clientes 
                SET Telefono = ?
                WHERE id_cliente = ?";

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([$telefono, $id]);
            return ["success" => "Teléfono actualizado correctamente"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Eliminar cliente
    public function eliminarUsuario($id) {
        $sql = "DELETE FROM clientes WHERE id_cliente = ?";
        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([$id]);
            return ["success" => "Cliente eliminado"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }
}
