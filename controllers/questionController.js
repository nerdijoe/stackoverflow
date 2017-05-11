var Question = require('../models/question');
var User = require('../models/user')
require('dotenv').config();



exports.create = (req, res, next) => {
  //using decoded data from token
  var user_id = req.decoded._id;

  User.findById( user_id, (err, user) => {
    if(err) res.send(err);

    if(user) {
      // create question
      var newQuestion = Question({
        title: req.body.title,
        content: req.body.content,
        answers: [],
        user_id: user_id
      })

      newQuestion.save( (err, question) => {
        if(err) res.send(err);

        res.send(question);
      })

    } // end if(user)
  }) // end User.findById

}


exports.get_all = (req, res, next) => {
  Question
    .find()
    .populate('user_id', 'answers')
    .exec( (err, questions) => {
      if(err) res.send(err);

      res.send(questions);
    })
}


exports.add_answer = (req, res, next) => {
  Question.findById(req.params.id, (err, question) => {
    if(err) res.send(err);

    if(question) {
      let newAnswer = {
        title: req.body.title,
        content: req.body.content
      }

      question.answers.push(newAnswer);

      question.save( (err, q ) => {
        if(err) res.send(err)

        res.send(q);
      })
    }

  })
}
