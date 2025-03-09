<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$request_uri = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

if (!isset($request_uri[1])) {
    echo json_encode(['error' => 'Entidad no especificada']);
    exit;
}

$entity = $request_uri[1];
$method = $_SERVER['REQUEST_METHOD'];



switch ($entity) {
    case 'usuarios':
        include 'usuarios.php';
        break;
    case 'rutas':
        include 'rutas.php';
        break;
    case 'reservas':
        include 'reservas.php';
        break;
    case 'valoraciones':
        include 'valoraciones.php';
        break;
    case 'asignaciones':
        include 'asignaciones.php';
        break;
    default:
        echo json_encode(['error' => 'Entidad no encontrada']);
        break;
}
?>
