import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './config/swagger';
import authRoutes from './modules/auth/auth.routes';
import characterRoutes from './modules/character/character.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import gameRoutes from './modules/game/game.routes';
import gameCharacterRoutes from './modules/game-character/gameCharacter.routes';
import userRoutes from './modules/users/user.routes';
import { errorHandler } from './shared/middleware/error-handler';
import { notFoundHandler } from './shared/middleware/not-found-handler';

const app: Application = express();

app.use(express.json());

const corsOrigins = (process.env.CORS_ORIGIN ?? '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.header('Origin');
  const allowAll = corsOrigins.includes('*');

  if (allowAll) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/game-characters', gameCharacterRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/characters', characterRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
