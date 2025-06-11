/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

/**
 * Controlador principal para la gestión de materias (CRUD).
 * Se encarga de:
 * - Cargar y mostrar la lista de materias.
 * - Manejar el formulario para crear/editar materias.
 * - Gestionar las acciones de edición y borrado.
 * 
 * Dependencias:
 * - subjectsAPI.js: Módulo que realiza las llamadas HTTP al backend.
 */
import { subjectsAPI } from '../api/subjectsAPI.js';
document.addEventListener('DOMContentLoaded', () => 
{
    // Inicialización: Carga las materias y configura los event handlers al cargar el DOM
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
});

/**
 * Configura el event handler para el formulario de materias.
 * Maneja tanto la creación como la actualización de materias.
 */
function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', async e => 
  {
        e.preventDefault();
        const subject = 
        {
            id: document.getElementById('subjectId').value.trim(),
            name: document.getElementById('name').value.trim()
        };

        try 
        {
            // Si hay ID, es una actualización; si no, es una creación
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            }
            else
            {
                await subjectsAPI.create(subject);
            }
            
            // Limpia el formulario y recarga la lista
            form.reset();
            document.getElementById('subjectId').value = '';
            loadSubjects();
        }
        catch (err)
        {
            console.error(err.message);
        }
  });
}

/**
 * Configura el botón de cancelar para limpiar el ID de materia
 * (útil cuando se cancela una edición).
 */
function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

/**
 * Carga todas las materias desde el backend y las renderiza en la tabla.
 */
async function loadSubjects()
{
    try
    {
        const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(subjects);
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
    }
}

/**
 * Renderiza la lista de materias en la tabla HTML.
 * @param {Array} subjects - Lista de materias a mostrar.
 */
function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren(); // Limpia la tabla antes de renderizar

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(subject.name)); // Celda con el nombre
        tr.appendChild(createSubjectActionsCell(subject)); // Celda con botones de acciones
        tbody.appendChild(tr);
    });
}

/**
 * Crea una celda de tabla (<td>) con texto.
 * @param {string} text - Contenido de la celda.
 * @returns {HTMLElement} Elemento <td> creado.
 */
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

/**
 * Crea una celda de acciones (editar/borrar) para una materia.
 * @param {Object} subject - Objeto materia con {id, name}.
 * @returns {HTMLElement} Celda con botones de acciones.
 */
function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    // Botón Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        // Rellena el formulario con los datos de la materia seleccionada
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    // Botón Borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDeleteSubject(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

/**
 * Confirma y ejecuta el borrado de una materia.
 * @param {string} id - ID de la materia a borrar.
 */
async function confirmDeleteSubject(id)
{
    if (!confirm('¿Seguro que deseas borrar esta materia?')) return;

    try
    {
        await subjectsAPI.remove(id);
        loadSubjects(); // Recarga la lista después de borrar
    }
    catch (err)
    {
        console.error('Error al borrar materia:', err.message);
    }
}