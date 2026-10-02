import express from 'express';
import jsonServer from 'json-server';

const app = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 3001;

app.use(middlewares);
app.use(express.json());

/**
 * POST /login
 */
app.post('/login', (req, res) => {
  const auth = router.db.get('auth').value();

  res.json(auth);
});

/**
 * POST /signup
 */
app.post('/signup', (req, res) => {
  const auth = router.db.get('auth').value();

  res.json(auth);
});

/**
 * GET /surveys/:id/results
 */
app.get('/surveys/:id/results', (req, res) => {
  const { id } = req.params;

  const result = router.db
    .get('surveyResults')
    .find({ surveyId: id })
    .value();

  if (!result) {
    return res.status(404).json({
      message: `Results for survey ${id} not found`
    });
  }

  res.json(result);
});

/**
 * JSON Server routes
 */
app.use(router);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
