<?php

require_once "../Clases/serviciosClass.php";

$servicios = new ServiciosClass();

header("Content-Type: application/json");

switch ($_SERVER["REQUEST_METHOD"]) {

    case "GET":
        if (isset($_GET["id"])) {
            echo json_encode($servicios->getById($_GET["id"]));
        } else {
            echo json_encode($servicios->get());
        }
        break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($servicios->post($data));
        break;

    case "PUT":
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($servicios->put($data));
        break;

    case "DELETE":
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($servicios->delete($data["id_servicio"]));
        break;

    default:
        echo json_encode(["ok" => false, "msg" => "Método no permitido"]);
}
