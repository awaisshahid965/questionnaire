const Question = require('../models/Question');

module.exports.add_question_get = async (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  res.render('add_question', { isLoggedIn, user_name, error: '' });
};

module.exports.add_question_post = async (req, res) => {
  const { isLoggedIn, user_name } = req.session.user;
  const { question } = req.body;
  if (question.length < 20) {
    return res.render('add_question', { isLoggedIn, user_name, error: "Please fulfill Question Requirement!" });
  }
  try {
    const questionSave = new Question({ question });
    await questionSave.save();
    res.redirect('/');
  } catch (err) {
    res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
  }
};
