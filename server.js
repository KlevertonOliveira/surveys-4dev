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
app.post('/api/login', (req, res) => {
  const auth = router.db.get('auth').value();

  res.json(auth);
});

/**
 * POST /signup
 */
app.post('/api/signup', (req, res) => {
  const auth = router.db.get('auth').value();

  res.json(auth);
});

/**
 * GET /surveys/:id/results
 */
app.get('/api/surveys/:id/results', (req, res) => {
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

app.put('/api/surveys/:id/results', (req, res) => {
  console.log('PUT received:', req.method, req.originalUrl);

  const { id } = req.params;
  const updatedData = req.body;

  const result = router.db
    .get('surveyResults')
    .find({ surveyId: id });

  if (!result.value()) {
    return res.status(404).json({
      message: `Results for survey ${id} not found`
    });
  }

  const updatedAnswers = result.value().answers.map(currentAnswer => {
    return {
      ...currentAnswer,
      isCurrentAccountAnswer: currentAnswer.answer === updatedData.answer,
    };
  });

  const updatedResult = {
    ...result.value(),
    answers: updatedAnswers
  };

  result.assign({ answers: updatedAnswers }).write();

  return res.status(200).json(updatedResult);
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
