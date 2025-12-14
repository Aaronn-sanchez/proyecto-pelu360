<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../Conexion.php';
require_once '../Clases/avisosClass.php';

$conexionObj = new Conexion();
$pdo = $conexionObj->getConexion();

$avisosClass = new AvisosClass($pdo);

$metodo = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener un aviso específico
            $resultado = $avisosClass->obtenerAviso($_GET['id']);
        } elseif (isset($_GET['recientes'])) {
            // Obtener avisos recientes
            $limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 5;
            $resultado = $avisosClass->obtenerAvisosRecientes($limite);
        } else {
            // Obtener todos los avisos
            $resultado = $avisosClass->obtenerAvisos();
        }
        echo json_encode($resultado);
        break;

    case 'POST':
        // Crear nuevo aviso
        $resultado = $avisosClass->crearAviso($input);
        echo json_encode($resultado);
        break;

    case 'PUT':
        // Actualizar aviso
        if (isset($_GET['id'])) {
            $resultado = $avisosClass->actualizarAviso($_GET['id'], $input);
            echo json_encode($resultado);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    case 'DELETE':
        // Eliminar aviso
        if (isset($_GET['id'])) {
            $resultado = $avisosClass->eliminarAviso($_GET['id']);
            echo json_encode($resultado);
        } else {
            echo json_encode(["error" => "ID no proporcionado"]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}