<?php
/**
 * Modelo para la gestión de materias/subjects en la base de datos.
 * Contiene las operaciones CRUD básicas para la tabla 'subjects'.
 * 
 * Funcionalidades principales:
 * - Consulta de materias
 * - Creación/actualización/eliminación
 * - Uso de prepared statements para seguridad
 * 
 * Dependencias:
 * - Requiere conexión MySQLi activa ($conn)
 */

/**
 * Obtiene todas las materias existentes en la base de datos.
 * @param mysqli $conn - Conexión a la base de datos
 * @return array - Lista de materias con estructura [ ['id'=>, 'name'=>] ]
 */
function getAllSubjects($conn) 
{
    $sql = "SELECT * FROM subjects";
    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

/**
 * Obtiene una materia específica por su ID.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID de la materia a buscar
 * @return array|null - Datos de la materia o null si no existe
 */
function getSubjectById($conn, $id) 
{
    $sql = "SELECT * FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc(); 
}

/**
 * Crea una nueva materia en la base de datos.
 * @param mysqli $conn - Conexión a la base de datos
 * @param string $name - Nombre de la materia
 * @return array - Resultado de la operación:
 *                ['inserted' => filas afectadas, 'id' => ID del nuevo registro]
 */
function createSubject($conn, $name) 
{
    $sql = "INSERT INTO subjects (name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $name);
    $stmt->execute();
    return [
        'inserted' => $stmt->affected_rows,        
        'id' => $conn->insert_id
    ];
}

/**
 * Actualiza una materia existente.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID de la materia a actualizar
 * @param string $name - Nuevo nombre para la materia
 * @return array - ['updated' => filas afectadas]
 */
function updateSubject($conn, $id, $name) 
{
    $sql = "UPDATE subjects SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $name, $id);
    $stmt->execute();
    return ['updated' => $stmt->affected_rows];
}

/**
 * Elimina una materia de la base de datos.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID de la materia a eliminar
 * @return array - ['deleted' => filas afectadas]
 */
function deleteSubject($conn, $id) 
{
    $sql = "DELETE FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    return ['deleted' => $stmt->affected_rows];
}
?>