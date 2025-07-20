// backend/src/routes/sugerencias.routes.js
"use strict";
import { verificarMuteo } from "../middlewares/verificarMuteo.middleware.js";

import { Router } from "express";
import {
  crearSugerencia,
  obtenerSugerencias,
  obtenerSugerenciaPorId,
  actualizarSugerencia,
  eliminarSugerencia,
  responderSugerencia,
  obtenerSugerenciasReportadas,
  obtenerMisSugerencias,
  actualizarRespuestaAdmin,
  eliminarRespuestaAdmin,
  cambiarEstadoSugerencia
} from "../controllers/sugerencias.controller.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import {
  validarCrearSugerencia,
  validarActualizarSugerencia,
  validarResponderSugerencia,
  validarIdSugerencia,
  validarPaginacion,
  validarFiltrosAdmin,
  validarActualizarRespuesta,
  validarCambiarEstado
} from "../validations/sugerencias.validation.js";

const router = Router();

// Rutas públicas (requieren autenticación pero no roles específicos)

// Crear una nueva sugerencia
router.post(
  "/",
  authenticateJwt,
  validarCrearSugerencia,
  verificarMuteo, // Verifica si el usuario está muteado antes de permitir crear sugerencias
  crearSugerencia
  
);

// Obtener todas las sugerencias (público, con paginación y filtros)
router.get(
  "/",
  authenticateJwt,
  validarPaginacion,
  obtenerSugerencias
);

// Obtener una sugerencia específica por ID
router.get(
  "/:id",
  authenticateJwt,
  validarIdSugerencia,
  obtenerSugerenciaPorId
);

// Actualizar una sugerencia (solo el autor o admin)
router.patch(
  "/:id",
  authenticateJwt,
  validarActualizarSugerencia,
  verificarMuteo, // Verifica si el usuario está muteado antes de permitir actualizar sugerencias
  actualizarSugerencia
);

// Eliminar una sugerencia (solo el autor o admin)
router.delete(
  "/:id",
  authenticateJwt,
  validarIdSugerencia,
  eliminarSugerencia
);


// Obtener mis sugerencias
router.get(
  "/usuario/mis-sugerencias",
  authenticateJwt,
  validarPaginacion,
  obtenerMisSugerencias
);

// Rutas para administradores

// Responder a una sugerencia (solo admin)
router.post(
  "/:id/responder",
  authenticateJwt,
  isAdmin,
  validarResponderSugerencia,
  responderSugerencia
);

// Obtener sugerencias reportadas (solo admin)
router.get(
  "/admin/reportadas",
  authenticateJwt,
  isAdmin,
  validarFiltrosAdmin,
  obtenerSugerenciasReportadas
);

// Actualizar respuesta de administrador
router.put(
  "/:id/respuesta",
  authenticateJwt,
  isAdmin,
  validarActualizarRespuesta,
  actualizarRespuestaAdmin
);

// Eliminar respuesta de administrador
router.delete(
  "/:id/respuesta",
  authenticateJwt,
  isAdmin,
  validarIdSugerencia,
  eliminarRespuestaAdmin
);

// Cambiar estado de sugerencia
router.patch(
  "/:id/estado",
  authenticateJwt,
  isAdmin,
  validarCambiarEstado,
  cambiarEstadoSugerencia
);

export default router;