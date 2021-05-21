import fs from 'fs';
import path from 'path';
import express from 'express';
import authMiddleware from '../middleware/authentication';

const filterRoutesInDirectory = (dir: string) =>
  fs
    .readdirSync(dir)
    .filter((file) => {
      return /js|ts/.test(path.extname(file)) && !file.startsWith('index');
    })
    .map((file) => {
      const router = require(path.join(dir, path.basename(file, '.js')));
      if (router.default) {
        return router.default;
      }
      return router;
    });

const router = express.Router();
const publicDirectory = path.join(__dirname, './public');
const publicRoutes = filterRoutesInDirectory(publicDirectory);
const protectedDirectory = path.join(__dirname, './');
const protectedRoutes = filterRoutesInDirectory(protectedDirectory);

router.use([...publicRoutes, authMiddleware, ...protectedRoutes]);

export default router;
