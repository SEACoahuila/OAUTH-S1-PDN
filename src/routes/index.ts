import { Router } from 'express';
import auth from './auth';

const routes = Router();

routes.use('/oauth', auth);

export default routes;