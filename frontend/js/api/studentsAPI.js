/**
 * Módulo API para la gestión de estudiantes.
 * Proporciona una interfaz CRUD estándar para interactuar con el backend
 * mediante llamadas HTTP automatizadas.
 * 
 * Este archivo funciona como una capa delgada que:
 * 1. Especializa la factory genérica (apiFactory) para el recurso 'students'
 * 2. Expone los métodos básicos para operaciones con estudiantes
 * 
 * Métodos disponibles (implementados por apiFactory):
 * - fetchAll(): Obtiene todos los estudiantes
 * - create(): Añade un nuevo estudiante
 * - update(): Modifica un estudiante existente
 * - remove(): Elimina un estudiante
 */

// Importa la factory que genera APIs CRUD estándar
import { createAPI } from './apiFactory.js';

/**
 * Crea y exporta la API especializada para estudiantes.
 * El parámetro 'students' define:
 * - El endpoint base (/students)
 * - El módulo PHP que procesará las peticiones
 * 
 * @type {{
 *   fetchAll: function(): Promise<Array<Student>>,
 *   create: function(Student): Promise<Student>,
 *   update: function(Student): Promise<Student>,
 *   remove: function(id: string|number): Promise<void>
 * }}
 */
export const studentsAPI = createAPI('students');