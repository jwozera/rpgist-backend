import { config as loadEnv } from 'dotenv';

import app from './app';
import { sequelize } from './database';

loadEnv();

const port = Number(process.env.PORT || 3000);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
      return;
    }

    console.log('Vercel environment detected; skipping app.listen');
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

void start();
