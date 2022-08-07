const Question = require('../models/Question');

module.exports.details_question_get = async (req, res) => {
  const { isLoggedIn, user_name, id } = req.session.user;
  const { qid } = req.params;
  try {
    const question = await Question.findById(qid);
    res.render('details_question', { isLoggedIn, user_name, question, id });
  } catch (err) {
    res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
  }
};
