<?php
/**
 * Controlador para gestionar las relaciones entre estudiantes y materias.
 * Maneja las operaciones CRUD para la tabla de asociación students_subjects.
 * 
 * Responsabilidades principales:
 * - Procesar peticiones HTTP (GET, POST, PUT, DELETE)
 * - Validar datos básicos de entrada
 * - Gestionar respuestas JSON al frontend
 * - Manejo básico de errores HTTP
 * 
 * Dependencias:
 * - studentsSubjects.php (modelo)
 */

require_once("./models/studentsSubjects.php");

/**
 * Maneja solicitudes GET para obtener relaciones estudiante-materia.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Respuesta:
 * - JSON con todas las relaciones existentes
 * - Estructura: [{id, student_id, subject_id, approved, student_fullname, subject_name}]
 */
function handleGet($conn) 
{
    $studentsSubjects = getAllSubjectsStudents($conn);
    echo json_encode($studentsSubjects);
}

/**
 * Maneja solicitudes POST para crear nuevas relaciones.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Valida:
 * - Campos requeridos (student_id, subject_id, approved)
 * - Resultado de la operación en BD
 * 
 * Respuestas posibles:
 * - 200: Asignación exitosa
 * - 500: Error en el servidor
 */
function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    $result = assignSubjectToStudent($conn, $input['student_id'], $input['subject_id'], $input['approved']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Asignación realizada"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "Error al asignar"]);
    }
}

/**
 * Maneja solicitudes PUT para actualizar relaciones existentes.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Valida:
 * - Campos obligatorios (id, student_id, subject_id, approved)
 * - Existencia del registro a modificar
 * 
 * Respuestas posibles:
 * - 200: Actualización exitosa
 * - 400: Datos incompletos
 * - 500: Error en el servidor
 */
function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id'], $input['student_id'], $input['subject_id'], $input['approved'])) 
    {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos"]);
        return;
    }

    $result = updateStudentSubject($conn, $input['id'], $input['student_id'], $input['subject_id'], $input['approved']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Actualización correcta"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

/**
 * Maneja solicitudes DELETE para eliminar relaciones.
 * @param mysqli $conn Conexión a la base de datos
 * 
 * Valida:
 * - Campo id en la solicitud
 * - Existencia del registro
 * 
 * Respuestas posibles:
 * - 200: Eliminación exitosa
 * - 500: Error en el servidor
 */
function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = removeStudentSubject($conn, $input['id']);
    if ($result['deleted'] > 0) 
    {
        echo json_encode(["message" => "Relación eliminada"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>