import { Router } from "express";
import votacionesRoutes from "./votaciones.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import authRoutes from "./auth.routes.js";

import eventosRouter from "./eventos.routes.js";

import sugerenciasRoutes from "./sugerencias.routes.js";
import usuarioMuteadoRoutes from "./usuarioMuteado.routes.js";
import reporteRoutes from "./reporte.routes.js";

import { NoticiasController } from "../controllers/noticias.controller.js";

const router = Router();

router.use("/votacion", votacionesRoutes);
router.use("/auth", authRoutes);
// router .use("/usuario", usuarioRoutes) // Rutas de usuario

//router.use("/auth", authRoutes);
//router.use("/usuarios", usuariosRoutes);

router.use("/eventos", eventosRouter);

router.get("/noticias", NoticiasController);
router.use("/sugerencias", sugerenciasRoutes);
router.use("/muteo", usuarioMuteadoRoutes);
router.use("/reportes", reporteRoutes);

export default router;

