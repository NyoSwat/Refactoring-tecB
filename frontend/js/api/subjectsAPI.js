/**
 * Módulo API para la gestión de materias (subjects).
 * Proporciona métodos CRUD estándar para interactuar con el backend.
 * 
 * Este archivo es una capa delgada que utiliza apiFactory.js
 * para generar automáticamente los endpoints básicos de una API RESTful.
 * 
 * Dependencias:
 * - apiFactory.js: Factoría que implementa las operaciones CRUD básicas
 */

// Importa la factoría de APIs que contiene la lógica CRUD básica
import { createAPI } from './apiFactory.js';

/**
 * Crea y exporta un objeto API específico para materias (subjects)
 * con los siguientes métodos automáticos:
 * - fetchAll(): Obtiene todas las materias (GET /subjects)
 * - fetch(id): Obtiene una materia específica (GET /subjects/:id)
 * - create(data): Crea una nueva materia (POST /subjects)
 * - update(data): Actualiza una materia existente (PUT /subjects/:id)
 * - remove(id): Elimina una materia (DELETE /subjects/:id)
 * 
 * El parámetro 'subjects' define el endpoint base (/subjects)
 * que será utilizado para todas las peticiones.
 */
export const subjectsAPI = createAPI('subjects');