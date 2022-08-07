const Question = require('../models/Question');
const User = require('../models/User');

module.exports.submit_question_get = async (req, res) => {
  const { isLoggedIn, user_name, id } = req.session.user;
  const { qid } = req.params;
  const { error = "" } = req.query;
  try {
    // If User Already Submit Question, and Try to bypass, then
    const { attempts } = await User.findById(id).select("attempts");
    if (attempts.includes(qid)) {
      return res.redirect('/');
    }
    const { question } = await Question.findById(qid).select("question");
    return res.render('submit_question', { isLoggedIn, user_name, question, qid, error });
  } catch (err) {
    res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
  }
};

module.exports.submit_question_post = async (req, res) => {
  const { isLoggedIn, user_name, id } = req.session.user;
  const { qid } = req.params;
  const { answer } = req.body;

  if (answer.length === 0) { return res.redirect('/submit/' +qid+ '?error=ok'); }

  try {
    const quesSaveObj = {
      answer,
      uname: user_name,
      uid: id
    };
    await Question.findOneAndUpdate({ _id: qid }, { $push: { answers: quesSaveObj }, $inc: { count: 1 } });
    await User.findOneAndUpdate({ _id: id }, { $push: { attempts: qid } });
    res.redirect('/');
  } catch (err) {
    res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
  }
};
