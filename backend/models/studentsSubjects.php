<?php
/**
 * Modelo para la gestión de relaciones estudiantes-materias (students_subjects).
 * Maneja la asignación, consulta y actualización de materias asignadas a estudiantes.
 * 
 * Funcionalidades principales:
 * - Asignación de materias a estudiantes
 * - Consulta de relaciones existentes
 * - Actualización de estado (aprobado/no aprobado)
 * - Eliminación de asignaciones
 * 
 * Dependencias:
 * - Requiere conexión MySQLi activa ($conn)
 */

/**
 * Asigna una materia a un estudiante.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $student_id - ID del estudiante
 * @param int $subject_id - ID de la materia
 * @param int $approved - Estado de aprobación (0/1)
 * @return array - Resultado de la operación:
 *                ['inserted' => filas afectadas, 'id' => ID del nuevo registro]
 */
function assignSubjectToStudent($conn, $student_id, $subject_id, $approved) 
{
    $sql = "INSERT INTO students_subjects (student_id, subject_id, approved) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $student_id, $subject_id, $approved);
    $stmt->execute();

    return [
        'inserted' => $stmt->affected_rows,        
        'id' => $conn->insert_id
    ];
}

/**
 * Obtiene todas las relaciones estudiantes-materias con información detallada.
 * @param mysqli $conn - Conexión a la base de datos
 * @return array - Lista de relaciones con estructura:
 *                [ ['id'=>, 'student_id'=>, 'subject_id'=>, 
 *                   'approved'=>, 'student_fullname'=>, 'subject_name'=>] ]
 */
function getAllSubjectsStudents($conn) 
{
    $sql = "SELECT students_subjects.id,
                students_subjects.student_id,
                students_subjects.subject_id,
                students_subjects.approved,
                students.fullname AS student_fullname,
                subjects.name AS subject_name
            FROM students_subjects
            JOIN subjects ON students_subjects.subject_id = subjects.id
            JOIN students ON students_subjects.student_id = students.id";

    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

/**
 * Obtiene las materias asignadas a un estudiante específico.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $student_id - ID del estudiante
 * @return array - Lista de materias con estructura:
 *                [ ['subject_id'=>, 'name'=>, 'approved'=>] ]
 */
function getSubjectsByStudent($conn, $student_id) 
{
    $sql = "SELECT ss.subject_id, s.name, ss.approved
        FROM students_subjects ss
        JOIN subjects s ON ss.subject_id = s.id
        WHERE ss.student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $student_id);
    $stmt->execute();
    $result= $stmt->get_result();

    return $result->fetch_all(MYSQLI_ASSOC); 
}

/**
 * Actualiza una relación estudiante-materia existente.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID de la relación
 * @param int $student_id - Nuevo ID de estudiante (opcional)
 * @param int $subject_id - Nuevo ID de materia (opcional)
 * @param int $approved - Nuevo estado de aprobación
 * @return array - ['updated' => filas afectadas]
 */
function updateStudentSubject($conn, $id, $student_id, $subject_id, $approved) 
{
    $sql = "UPDATE students_subjects 
            SET student_id = ?, subject_id = ?, approved = ? 
            WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiii", $student_id, $subject_id, $approved, $id);
    $stmt->execute();

    return ['updated' => $stmt->affected_rows];
}

/**
 * Elimina una relación estudiante-materia.
 * @param mysqli $conn - Conexión a la base de datos
 * @param int $id - ID de la relación a eliminar
 * @return array - ['deleted' => filas afectadas]
 */
function removeStudentSubject($conn, $id) 
{
    $sql = "DELETE FROM students_subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    return ['deleted' => $stmt->affected_rows];
}
?>