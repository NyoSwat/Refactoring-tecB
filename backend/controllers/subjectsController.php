<?php
/**
 * Controlador para manejar las operaciones CRUD de materias (subjects).
 * 
 * Funcionalidades principales:
 * - Manejo de peticiones HTTP (GET, POST, PUT, DELETE)
 * - Interacción con el modelo subjects.php
 * - Formateo de respuestas JSON
 * - Manejo básico de errores
 * 
 * Dependencias:
 * - Requiere el modelo subjects.php
 * - Requiere conexión a base de datos ($conn)
 */

require_once("./models/subjects.php");

/**
 * Maneja las peticiones GET para materias.
 * @param mysqli $conn - Conexión a la base de datos
 * 
 * Comportamiento:
 * - Si recibe un 'id' en el input: Devuelve una materia específica
 * - Sin 'id': Devuelve todas las materias
 */
function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) 
    {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } 
    else 
    {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}

/**
 * Maneja las peticiones POST para crear nuevas materias.
 * @param mysqli $conn - Conexión a la base de datos
 * 
 * Valida:
 * - Existencia del campo 'name' en el input
 * - Resultado de la operación en base de datos
 */
function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = createSubject($conn, $input['name']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Materia creada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo crear"]);
    }
}

/**
 * Maneja las peticiones PUT para actualizar materias existentes.
 * @param mysqli $conn - Conexión a la base de datos
 * 
 * Requiere:
 * - Campos 'id' y 'name' en el input
 * - Verifica que se hayan actualizado registros
 */
function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateSubject($conn, $input['id'], $input['name']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Materia actualizada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

/**
 * Maneja las peticiones DELETE para eliminar materias.
 * @param mysqli $conn - Conexión a la base de datos
 * 
 * Requiere:
 * - Campo 'id' en el input
 * - Confirma que se haya eliminado el registro
 */
function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    $result = deleteSubject($conn, $input['id']);
    if ($result['deleted'] > 0) 
    {
        echo json_encode(["message" => "Materia eliminada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>