<?php
/**
 * Modelo para la gestión de estudiantes en la base de datos.
 * Implementa operaciones CRUD para la tabla 'students'.
 * 
 * Funcionalidades principales:
 * - Consulta de estudiantes (individual y completa)
 * - Creación/actualización/eliminación de registros
 * - Uso de prepared statements para seguridad
 * 
 * Dependencias:
 * - Requiere conexión MySQLi activa ($conn)
 */

/**
 * Obtiene todos los estudiantes registrados.
 * @param mysqli $conn - Conexión a la base de datos
 * @return array - Lista de estudiantes con estructura:
 *                [ ['id'=>, 'fullname'=>, 'email'=>, 'age'=>] ]
 */
function getAllStudents($conn) 
{
    $sql = "SELECT * FROM students";
    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

/**
 * Obtiene un estudiante específico por su ID.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID del estudiante a buscar
 * @return array|null - Datos del estudiante o null si no existe
 */
function getStudentById($conn, $id) 
{
    $stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc(); 
}

/**
 * Crea un nuevo registro de estudiante.
 * @param mysqli $conn - Conexión a la base de datos
 * @param string $fullname - Nombre completo del estudiante
 * @param string $email - Correo electrónico
 * @param int $age - Edad del estudiante
 * @return array - Resultado de la operación:
 *                ['inserted' => filas afectadas, 'id' => ID del nuevo registro]
 */
function createStudent($conn, $fullname, $email, $age) 
{
    $sql = "INSERT INTO students (fullname, email, age) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $fullname, $email, $age);
    $stmt->execute();

    return [
        'inserted' => $stmt->affected_rows,        
        'id' => $conn->insert_id
    ];
}

/**
 * Actualiza los datos de un estudiante existente.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID del estudiante a actualizar
 * @param string $fullname - Nuevo nombre completo
 * @param string $email - Nuevo correo electrónico
 * @param int $age - Nueva edad
 * @return array - ['updated' => filas afectadas]
 */
function updateStudent($conn, $id, $fullname, $email, $age) 
{
    $sql = "UPDATE students SET fullname = ?, email = ?, age = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssii", $fullname, $email, $age, $id);
    $stmt->execute();
    return ['updated' => $stmt->affected_rows];
}

/**
 * Elimina un estudiante de la base de datos.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID del estudiante a eliminar
 * @return array - ['deleted' => filas afectadas]
 */
function deleteStudent($conn, $id) 
{
    $sql = "DELETE FROM students WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    return ['deleted' => $stmt->affected_rows];
}
?>