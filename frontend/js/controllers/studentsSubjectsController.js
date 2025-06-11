/**
 * Controlador para gestionar la relación entre estudiantes y materias (inscripciones).
 * Permite:
 * - Asignar materias a estudiantes
 * - Marcar materias como aprobadas
 * - Listar/editar/eliminar relaciones existentes
 * 
 * Dependencias:
 * - studentsAPI.js: Maneja datos de estudiantes
 * - subjectsAPI.js: Maneja datos de materias
 * - studentsSubjectsAPI.js: Maneja la relación estudiante-materia
 */

// Inicialización al cargar el DOM
import { studentsAPI } from '../api/studentsAPI.js';
import { subjectsAPI } from '../api/subjectsAPI.js';
import { studentsSubjectsAPI } from '../api/studentsSubjectsAPI.js';
document.addEventListener('DOMContentLoaded', () => 
{
    initSelects();       // Carga selects de estudiantes/materias
    setupFormHandler();  // Configura el formulario
    setupCancelHandler();// Botón cancelar
    loadRelations();     // Carga relaciones existentes
});

/**
 * Inicializa los dropdowns de estudiantes y materias con datos del backend.
 * Usa studentsAPI y subjectsAPI para obtener los datos.
 */
async function initSelects() 
{
    try 
    {
        // Carga estudiantes y llena el select
        const students = await studentsAPI.fetchAll();
        const studentSelect = document.getElementById('studentIdSelect');
        students.forEach(s => 
        {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.fullname;
            studentSelect.appendChild(option);
        });

        // Carga materias y llena el select
        const subjects = await subjectsAPI.fetchAll();
        const subjectSelect = document.getElementById('subjectIdSelect');
        subjects.forEach(sub => 
        {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.name;
            subjectSelect.appendChild(option);
        });
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes o materias:', err.message);
    }
}

/**
 * Configura el manejador del formulario para crear/actualizar relaciones.
 * Detecta si es una edición (cuando hay ID) o creación nueva.
 */
function setupFormHandler() 
{
    const form = document.getElementById('relationForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const relation = getFormData(); // Obtiene datos del formulario

        try 
        {
            // Decide si es update o create basado en la presencia de ID
            if (relation.id) 
            {
                await studentsSubjectsAPI.update(relation);
            } 
            else 
            {
                await studentsSubjectsAPI.create(relation);
            }
            clearForm();    // Limpia el formulario
            loadRelations(); // Recarga la tabla
        } 
        catch (err) 
        {
            console.error('Error guardando relación:', err.message);
        }
    });
}

/**
 * Configura el botón de cancelar para limpiar el ID de relación
 * (reinicia el formulario para modo creación).
 */
function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('relationId').value = '';
    });
}

/**
 * Obtiene los datos del formulario y los estructura como objeto.
 * @returns {Object} { id, student_id, subject_id, approved }
 */
function getFormData() 
{
    return{
        id: document.getElementById('relationId').value.trim(),
        student_id: document.getElementById('studentIdSelect').value,
        subject_id: document.getElementById('subjectIdSelect').value,
        approved: document.getElementById('approved').checked ? 1 : 0 // Convierte checkbox a 1/0
    };
}

/**
 * Limpia el formulario y resetea el ID de relación.
 */
function clearForm() 
{
    document.getElementById('relationForm').reset();
    document.getElementById('relationId').value = '';
}

/**
 * Carga todas las relaciones estudiante-materia desde el backend.
 * Nota: Convierte el campo 'approved' de string a número para manejo consistente.
 */
async function loadRelations() 
{
    try 
    {
        const relations = await studentsSubjectsAPI.fetchAll();
        
        // DEBUG (comentado)
        //console.log(relations);

        /**
         * Soluciona inconsistencia con valores truthy/falsy:
         * Convierte 'approved' (string) a número para evitar 
         * que "0" sea evaluado como truthy.
         */
        relations.forEach(rel => 
        {
            rel.approved = Number(rel.approved);
        });
        
        renderRelationsTable(relations);
    } 
    catch (err) 
    {
        console.error('Error cargando inscripciones:', err.message);
    }
}

/**
 * Renderiza la tabla de relaciones estudiante-materia.
 * @param {Array} relations - Lista de relaciones con formato:
 *        [{ id, student_id, student_fullname, subject_id, subject_name, approved }]
 */
function renderRelationsTable(relations) 
{
    const tbody = document.getElementById('relationTableBody');
    tbody.replaceChildren(); // Limpia la tabla

    relations.forEach(rel => 
    {
        const tr = document.createElement('tr');

        // Columnas: Estudiante, Materia, Estado, Acciones
        tr.appendChild(createCell(rel.student_fullname));
        tr.appendChild(createCell(rel.subject_name));
        tr.appendChild(createCell(rel.approved ? 'Sí' : 'No')); // Mapea 1/0 a "Sí"/"No"
        tr.appendChild(createActionsCell(rel));

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
 * @param {Object} relation - Relación a editar/borrar
 * @returns {HTMLElement} TD con botones
 */
function createActionsCell(relation) 
{
    const td = document.createElement('td');

    // Botón Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(relation));

    // Botón Borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(relation.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

/**
 * Rellena el formulario con los datos de una relación existente para edición.
 * @param {Object} relation - Relación con { id, student_id, subject_id, approved }
 */
function fillForm(relation) 
{
    document.getElementById('relationId').value = relation.id;
    document.getElementById('studentIdSelect').value = relation.student_id;
    document.getElementById('subjectIdSelect').value = relation.subject_id;
    document.getElementById('approved').checked = !!relation.approved; // Fuerza booleano
}

/**
 * Confirma y ejecuta el borrado de una relación.
 * @param {string} id - ID de la relación a borrar
 */
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar esta inscripción?')) return;

    try 
    {
        await studentsSubjectsAPI.remove(id);
        loadRelations(); // Recarga la tabla después de borrar
    } 
    catch (err) 
    {
        console.error('Error al borrar inscripción:', err.message);
    }
}