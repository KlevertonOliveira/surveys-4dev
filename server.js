
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsonServer from 'json-server';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(express.json());

/**
 * Read db.json
 */
async function readDatabase() {
  const content = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(content);
}

/**
 * Write db.json
 */
async function writeDatabase(data) {
  await fs.writeFile(
    dbPath,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

/**
 * POST /api/login
 */
app.post('/api/login', (req, res) => {
  const auth = router.db.get('auth').value();
  return res.json(auth);
});

/**
 * POST /api/signup
 */
app.post('/api/signup', (req, res) => {
  const auth = router.db.get('auth').value();
  return res.json(auth);
});

/**
 * GET /api/surveys/:id/results
 */
app.get('/api/surveys/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDatabase();

    const result = db.surveyResults.find(
      (item) => item.surveyId === id
    );

    if (!result) {
      return res.status(404).json({
        message: `Results for survey ${id} not found`
      });
    }

    return res.json(result);
  } catch (error) {
    console.error('Error reading survey results:', error);

    return res.status(500).json({
      message: 'Failed to read survey results'
    });
  }
});

/**
 * PUT /api/surveys/:id/results
 */
app.put('/api/surveys/:id/results', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    // Read the latest database contents
    const db = await readDatabase();

    // Find the survey result
    const result = db.surveyResults.find(
      (item) => item.surveyId === id
    );

    if (!result) {
      return res.status(404).json({
        message: `Results for survey ${id} not found`
      });
    }

    // Update the answer flags
    const updatedAnswers = result.answers.map((currentAnswer) => ({
      ...currentAnswer,
      isCurrentAccountAnswer: currentAnswer.answer === answer
    }));

    // Update the result in memory
    result.answers = updatedAnswers;

    // Persist the changes to db.json
    await writeDatabase(db);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating survey results:', error);

    return res.status(500).json({
      message: 'Failed to update survey results'
    });
  }
});

/**
 * JSON Server routes
 */
app.use('/api', router);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
