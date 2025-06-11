/**
 * Factory (Fábrica) para la creación de APIs CRUD genéricas.
 * Centraliza la lógica de comunicación con el backend para evitar código repetitivo.
 * 
 * Características principales:
 * - Genera automáticamente endpoints RESTful
 * - Maneja métodos HTTP estándar (GET, POST, PUT, DELETE)
 * - Proporciona una interfaz consistente para todos los módulos
 */

/**
 * Crea un objeto API con operaciones CRUD básicas para un módulo específico.
 * @param {string} moduleName - Nombre del módulo (ej: 'subjects', 'students')
 * @param {Object} config - Configuración opcional:
 *        - urlOverride: Permite especificar una URL personalizada
 * @returns {Object} API con métodos CRUD
 */
export function createAPI(moduleName, config = {}) 
{
    // Define la URL base para las peticiones:
    // - Usa urlOverride si está especificado
    // - Por defecto usa la ruta al backend PHP con parámetro module
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;

    /**
     * Función interna para enviar datos JSON al servidor.
     * @param {string} method - Método HTTP (POST, PUT, DELETE)
     * @param {Object} data - Datos a enviar
     * @returns {Promise} Respuesta del servidor parseada como JSON
     * @throws {Error} Si la respuesta no es exitosa
     */
    async function sendJSON(method, data) 
    {
        const res = await fetch(API_URL,
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`Error en ${method}`);
        return await res.json();
    }

    // Retorna el objeto API con 4 métodos CRUD:
    return {
        /**
         * Obtiene todos los registros del módulo (GET)
         * @returns {Promise<Array>} Lista de registros
         * @throws {Error} Si falla la petición
         */
        async fetchAll()
        {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("No se pudieron obtener los datos");
            return await res.json();
        },

        /**
         * Crea un nuevo registro (POST)
         * @param {Object} data - Datos del nuevo registro
         * @returns {Promise<Object>} Registro creado
         */
        async create(data)
        {
            return await sendJSON('POST', data);
        },

        /**
         * Actualiza un registro existente (PUT)
         * @param {Object} data - Debe incluir el ID del registro
         * @returns {Promise<Object>} Registro actualizado
         */
        async update(data)
        {
            return await sendJSON('PUT', data);
        },

        /**
         * Elimina un registro (DELETE)
         * @param {string|number} id - ID del registro a eliminar
         * @returns {Promise<Object>} Respuesta del servidor
         */
        async remove(id)
        {
            return await sendJSON('DELETE', { id });
        }
    };
}