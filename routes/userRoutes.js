const { Router } = require('express');
const { isLogin } = require('../controllers/loginChecks');

// Controllers
const addController = require('../controllers/addController');
const submitController = require('../controllers/submitController');
const detailsController = require('../controllers/detailsController');
const indexController = require('../controllers/indexController');

const router = Router();

// Index
router.get('/', indexController.index);

// Add Question
router.get('/add', isLogin, addController.add_question_get);
router.post('/add', isLogin, addController.add_question_post);

// Submit Question
router.get('/submit/:qid', isLogin, submitController.submit_question_get);
router.post('/submit/:qid', isLogin, submitController.submit_question_post);

// View Details
router.get('/details/:qid', detailsController.details_question_get);

module.exports = router;
