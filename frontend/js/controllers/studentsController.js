/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

/**
 * Controlador para la gestión de estudiantes (CRUD).
 * Maneja:
 * - Creación, lectura, actualización y eliminación de estudiantes
 * - Renderizado de tabla de estudiantes
 * - Formulario para edición/creación
 * 
 * Dependencias:
 * - studentsAPI.js: Módulo para interactuar con el backend
 */

import { subjectsAPI } from '../api/subjectsAPI.js';
import { subjectsAPI } from '../api/subjectsAPI.js';

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();      // Carga inicial de estudiantes
    setupFormHandler();  // Configura el manejador del formulario
    setupCancelHandler();// Configura el botón de cancelar
});

/**
 * Configura el event handler para el formulario de estudiantes.
 * Maneja tanto creación como actualización de registros.
 */
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    { 
        e.preventDefault();
        const student = getFormData(); // Obtiene datos del formulario
    
        try 
        {
            // Decide si es actualización o creación basado en la presencia de ID
            if (student.id) 
            {
                await studentsAPI.update(student);
            } 
            else 
            {
                await studentsAPI.create(student);
            }
            clearForm();     // Limpia el formulario
            loadStudents();  // Recarga la tabla
        }
        catch (err)
        {
            console.error(err.message); // Manejo básico de errores (solo consola)
        }
    });
}

/**
 * Configura el botón de cancelar para limpiar el campo de ID
 * (vuelve al formulario a modo creación).
 */
function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}
  
/**
 * Obtiene los datos del formulario y los estructura como objeto estudiante.
 * @returns {Object} { id, fullname, email, age }
 */
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10) // Convierte a número
    };
}
  
/**
 * Limpia el formulario y resetea el campo de ID.
 */
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}
  
/**
 * Carga todos los estudiantes desde el backend y los renderiza en la tabla.
 */
async function loadStudents()
{
    try 
    {
        const students = await studentsAPI.fetchAll();
        renderStudentTable(students);
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
/**
 * Renderiza la tabla de estudiantes.
 * @param {Array} students - Lista de estudiantes con formato:
 *        [{ id, fullname, email, age }]
 */
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren(); // Limpia la tabla antes de renderizar
  
    students.forEach(student => 
    {
        const tr = document.createElement('tr');
    
        // Columnas: Nombre, Email, Edad, Acciones
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString())); // Convierte edad a string
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
/**
 * Crea una celda de tabla estándar.
 * @param {string} text - Contenido de la celda
 * @returns {HTMLElement} TD creado
 */
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
/**
 * Crea celda con botones de acciones (editar/borrar).
 * @param {Object} student - Estudiante a editar/borrar
 * @returns {HTMLElement} TD con botones
 */
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    // Botón Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));
  
    // Botón Borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
/**
 * Rellena el formulario con los datos de un estudiante existente para edición.
 * @param {Object} student - Estudiante con { id, fullname, email, age }
 */
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
/**
 * Confirma y ejecuta el borrado de un estudiante.
 * @param {string} id - ID del estudiante a borrar
 */
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await studentsAPI.remove(id);
        loadStudents(); // Recarga la tabla después de borrar
    } 
    catch (err) 
    {
        console.error('Error al borrar:', err.message);
    }
}
  