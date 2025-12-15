<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

ini_set('display_errors', 0);  
ini_set('log_errors', 1);      
error_reporting(E_ALL);


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar conexión a la base de datos
require_once __DIR__ . '/Conexion.php';

// Obtener recurso (ej: usuarios, turnos, clientes)
$recurso = $_GET['recurso'] ?? null;

// Validar recurso enviado
if (!$recurso) {
    echo json_encode(["error" => "No se especificó ningún recurso."]);
    exit;
}

// Nombre del archivo del controlador
$controladorPath = __DIR__ . "/Controladores/" . $recurso . ".php";

// Verificar si el controlador existe
if (!file_exists($controladorPath)) {
    echo json_encode(["error" => "El controlador '$recurso' no existe."]);
    exit;
}

// Incluir controlador solicitado
require_once $controladorPath;


// Clase con el mismo nombre del archivo
$claseControlador = ucfirst($recurso);

// Instanciamos
$controlador = new $claseControlador();

// Determinamos método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Routing principal
switch ($method) {
    case 'GET':
        $controlador->get();
        break;

    case 'POST':
        $controlador->post();
        break;

    case 'PUT':
        $controlador->put();
        break;

    case 'DELETE':
        $controlador->delete();
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método HTTP no permitido"]);
}
