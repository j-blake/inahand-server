import fs from 'fs';
import path from 'path';
import express from 'express';
const authMiddleware = require('../middleware/authentication');

const filterRoutesInDirectory = (dir: string) =>
  fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.js' && !file.startsWith('index'))
    .map((file) => require(path.join(dir, path.basename(file, '.js'))));

const router = express.Router();
const publicDirectory = path.join(__dirname, './public');
const publicRoutes = filterRoutesInDirectory(publicDirectory);
const protectedDirectory = path.join(__dirname, './');
const protectedRoutes = filterRoutesInDirectory(protectedDirectory);

router.use([...publicRoutes, authMiddleware, ...protectedRoutes]);

export default router;
