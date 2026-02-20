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

     $query = $this->pdo->prepare("SELECT * FROM clientes WHERE telefono = ?");
    $query->execute([$data["telefono"]]);
    $existe = $query->fetch(PDO::FETCH_ASSOC);

    if ($existe) {
        return ["error" => "Ya existe un cliente con este teléfono"];
    }

        $sql = "INSERT INTO clientes (nombre, apellido, telefono)
                VALUES (?, ?, ?)";

        $query = $this->pdo->prepare($sql);

        try {
            $query->execute([
                $data["nombre"],
                $data["apellido"],
                $data["telefono"]
            ]);

            return ["success" => "Cliente añadido correctamente"];
        } catch (PDOException $e) {
            return ["error" => $e->getMessage()];
        }
    }

    // Actualizar telefono
    public function actualizarClientetelefono($id, $telefono) {

        $sql = "UPDATE clientes 
                SET telefono = ?
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
