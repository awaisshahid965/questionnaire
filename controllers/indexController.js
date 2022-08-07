require('dotenv').config();
const Question = require('../models/Question');
const User = require('../models/User');

module.exports.index = async (req, res) => {
  const { isLoggedIn, user_name, id } = req.session.user;
  let { page = 1 } = req.query;
  page = parseInt(page);
  if (page <= 0) page = 1;
  const limitResults = parseInt(process.env.LIMIT_RESULTS) || 5;
  let user;
  try {
    const questionCount = await Question.countDocuments();
    if (page > questionCount) page = questionCount;
    const questions = await Question.find()
                                    .limit(limitResults)
                                    .skip((page - 1) * limitResults)
                                    .sort({ $natural: -1 })
                                    .select("question count");
    if (id === "") {
      user = [];
    } else {
      user = await User.findById(id).select("attempts");
    }
    res.render('home', { isLoggedIn, user_name, id, user, questions, page, questionCount, limitResults });
  } catch (err) {
    res.render('error', { isLoggedIn, user_name, error_code: "500", error_msg: "Query Error, Either from Database or Incorrect Query Parameters." });
  }
};
