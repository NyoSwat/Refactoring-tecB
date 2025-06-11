<?php
/**
 * Controlador para gestionar las operaciones CRUD de estudiantes.
 * Maneja las peticiones HTTP y coordina con el modelo students.php.
 * 
 * Funcionalidades principales:
 * - Procesamiento de solicitudes GET, POST, PUT, DELETE
 * - Validación básica de datos
 * - Comunicación con el modelo de estudiantes
 * - Formateo de respuestas JSON
 * 
 * Dependencias:
 * - models/students.php (contiene la lógica de acceso a datos)
 */

require_once("./models/students.php");

/**
 * Maneja las solicitudes GET para estudiantes.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Comportamiento:
 * - Con parámetro 'id': Devuelve un estudiante específico
 * - Sin parámetro: Devuelve todos los estudiantes
 */
function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['id'])) 
    {
        $student = getStudentById($conn, $input['id']);
        echo json_encode($student);
    } 
    else
    {
        $students = getAllStudents($conn);
        echo json_encode($students);
    }
}

/**
 * Maneja las solicitudes POST para crear nuevos estudiantes.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Requiere:
 * - fullname, email y age en el cuerpo de la solicitud
 * - Valida el resultado de la operación en la base de datos
 */
function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = createStudent($conn, $input['fullname'], $input['email'], $input['age']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Estudiante agregado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo agregar"]);
    }
}

/**
 * Maneja las solicitudes PUT para actualizar estudiantes existentes.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Requiere:
 * - id, fullname, email y age en el cuerpo de la solicitud
 * - Verifica que se haya realizado la actualización
 */
function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Actualizado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

/**
 * Maneja las solicitudes DELETE para eliminar estudiantes.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Requiere:
 * - id del estudiante a eliminar
 * - Confirma que se haya realizado la eliminación
 */
function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = deleteStudent($conn, $input['id']);
    if ($result['deleted'] > 0) 
    {
        echo json_encode(["message" => "Eliminado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>