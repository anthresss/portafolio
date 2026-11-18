<?php
/**
 * contacto-v2.php - Guarda los mensajes del portafolio en MySQL usando PDO seguro
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

// Solo aceptar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Usa POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Verificación anti-spam (campo honeypot oculto)
$honeypot = trim((string)($_POST['website'] ?? ''));
if ($honeypot !== '') {
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje recibido correctamente.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sanitizar texto básico
 */
function limpiarTexto(string $valor): string {
    $valor = strip_tags($valor);
    $valor = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $valor);
    return trim($valor);
}

$nombre   = limpiarTexto((string)($_POST['nombre'] ?? ''));
$telefono = limpiarTexto((string)($_POST['telefono'] ?? ''));
$email    = trim((string)($_POST['email'] ?? ''));
$servicio = limpiarTexto((string)($_POST['servicio'] ?? 'Consulta General'));
$consulta = trim(strip_tags((string)($_POST['consulta'] ?? '')));
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';

// Validación de campos obligatorios
if ($nombre === '' || $telefono === '' || $email === '' || $consulta === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos marcados con (*) son obligatorios.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'El formato del correo electrónico no es válido.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// =========================================================================
// CONFIGURACIÓN DE LA BASE DE DATOS MYSQL
// En XAMPP local usa: localhost | portafolio_db | root | ''
// En InfinityFree reemplaza estos 4 valores por los de tu panel "MySQL Databases"
// =========================================================================
$dbHost = 'sql112.infinityfree.com';
$dbName = 'if0_43471188_portafolio';
$dbUser = 'if0_43471188';
$dbPass = 'y0oviZmapXFGB6I';

try {
    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $sql = "INSERT INTO mensajes (nombre, telefono, email, servicio, consulta, ip)
            VALUES (:nombre, :telefono, :email, :servicio, :consulta, :ip)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre'   => $nombre,
        ':telefono' => $telefono,
        ':email'    => $email,
        ':servicio' => $servicio,
        ':consulta' => $consulta,
        ':ip'       => $ip,
    ]);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "¡Gracias, {$nombre}! Tu mensaje sobre '{$servicio}' fue registrado correctamente."
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al conectar o guardar en la base de datos. Revisa la configuración en contacto-v2.php.'
    ], JSON_UNESCAPED_UNICODE);
}