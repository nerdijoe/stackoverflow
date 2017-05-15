var Question = require('../models/question')
var User = require('../models/user')
require('dotenv').config()

exports.create = (req, res, next) => {
  // using decoded data from token
  var user_id = req.decoded._id

  User.findById(user_id, (err, user) => {
    if (err) res.send(err)

    if (user) {
      // create question
      var newQuestion = Question({
        title: req.body.title,
        content: req.body.content,
        answers: [],
        author: user_id,
        votes: []
      })

      newQuestion.save((err, question) => {
        if (err) res.send(err)

        // need to return question object with populated data
        Question.findById(question.id)
        .populate('author')
        .populate('answers.author')
        .populate('votes.author')
        .exec((err, q) => {
          if (err) res.send(err)
          console.log("*********q", q)
          res.send(q)
        })

        // res.send(question)
      })
    } // end if(user)
  }) // end User.findById

}

exports.get_all = (req, res, next) => {
  Question
    .find()
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, questions) => {
      if (err) res.send(err)

      res.send(questions)
    })
}

exports.get_one = (req, res, next) => {
  Question.findById(req.params.id)
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, question) => {
      if (err) res.send(err)

      res.send(question)
    })
}


exports.update = (req, res, next) => {
  // Question.findById(req.params.id, (err, question) => {

  // })

  Question.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {
      new: true
    })
    .exec((error, question) => {
        if (error) {
            res.json({
                error
            })
        } else {

          // return the populated question object
          Question.findById(question.id)
          .populate('author')
          .populate('answers.author')
          .populate('votes.author')
          .exec((err, q) => {
            if (err) res.send(err)
            console.log("*********q", q)
            res.send(q)
          })
            
        }
    })
}


exports.delete = (req, res, next) => {
  Question.findByIdAndRemove(req.params.id, (err, question) => {
    if (err) res.send(err)
    else {
      if(question){

        var message = {
          message: `Question '${question.title}' has been deleted.`,
          id: question._id
        }

        res.send(message);
      } else {
        console.log("here")
        var message = {
          message: ``,
          error: 'Question cannot be deleted'
        }
        res.send(message)
      }
    }

  })
}

exports.add_answer = (req, res, next) => {
  var user_id = req.decoded._id

  Question.findById(req.params.id, (err, question) => {
    if (err) res.send(err)

    if (question) {
      let newAnswer = {
        title: req.body.title,
        content: req.body.content,
        author: user_id,
        votes: []
      }

      question.answers.push(newAnswer)

      question.save((err, q) => {
        if (err) res.send(err)

        Question.findById(req.params.id)
          .populate('author')
          .populate('answers.author')
          .exec((err, que) => {
            if (err) res.send(err)

            res.send(que)
          })

      })
    } // end of if(question)
  })
}

exports.del_answer = (req, res, next) => {
  var user_id = req.decoded._id
  var answer_id = req.body.answer_id

  Question.findById(req.params.id, (err, question) => {
    if (err) res.send(err)

    if (question) {
      let index = question.answers.findIndex( a => a._id == answer_id )

      if(index != -1) {
        question.answers.splice(index,1)

        // don't forget to save
        question.save( (err, q) => {
          if(err) res.send(err)
          res.send(q);
        })


      }
      else {
        var message = {
          message: ``,
          error: 'Answer cannot be deleted'
        }
        res.send(message)


      }


    } // end of if(question)
  })


}


exports.upvote = (req, res, next) => {
  var user_id = req.decoded._id
  // console.log(`req.params.id=${req.params.id}`)

  Question.findById(req.params.id)
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, question) => {
      if (err) res.send(err)

      // console.log('found question', question)

      let index = -1
      if (question.votes.length)
        index = question.votes.findIndex((vote) => vote.author._id == user_id)
      if (index == -1) {
        let upvote = {
          author: user_id,
          vote: 1
        }
        question.votes.push(upvote)

        question.save((err, q) => {
          if (err) res.send(err)
          res.send(q)
        })
      }else {
        let error = {
          message: 'User has voted, so he cannot vote again.'
        }
        res.send(error)
      }
    })
}

exports.downvote = (req, res, next) => {
  var user_id = req.decoded._id

  Question.findById(req.params.id)
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, question) => {
      if (err) res.send(err)

      let index = -1
      if (question.votes.length)
        index = question.votes.findIndex((vote) => vote.author._id == user_id)

      if (index == -1) {
        let downvote = {
          author: user_id,
          vote: -1
        }
        question.votes.push(downvote)

        question.save((err, q) => {
          if (err) res.send(err)
          res.send(q)
        })
      }else {
        let error = {
          message: 'User has voted, so he cannot vote again.'
        }
        res.send(error)
      }
    })
}

exports.answerUpvote = (req, res, next) => {
  var user_id = req.decoded._id
  var answer_id = req.body.answer_id

  Question.findById(req.params.id)
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, question) => {
      if (err) res.send(err)
      console.log('question', question)
      console.log('question.answers', question.answers)
      // find answer in the question.answers array
      let index_answer = question.answers.findIndex((ans) => ans._id == answer_id)
      // if found
      if (index_answer != -1) {
        let index_vote = question.answers[index_answer].votes.findIndex(vote => vote.author == user_id)
        if (index_vote == -1) {
          let newvote = {
            author: user_id,
            vote: 1
          }
          question.answers[index_answer].votes.push(newvote)

          question.save((err, q) => {
            if (err) res.send(err)
            res.send(q)
          })
        }else {
          let error = {
            message: 'User has voted, so he cannot vote again.'
          }
          res.send(error)
        }
      } // if (index_answer != -1)

    })
}

exports.answerDownvote = (req, res, next) => {
  var user_id = req.decoded._id
  var answer_id = req.body.answer_id

  Question.findById(req.params.id)
    .populate('author')
    .populate('answers.author')
    .populate('votes.author')
    .exec((err, question) => {
      if (err) res.send(err)
      console.log('question', question)
      console.log('question.answers', question.answers)
      // find answer in the question.answers array
      let index_answer = question.answers.findIndex((ans) => ans._id == answer_id)
      // if found
      if (index_answer != -1) {
        let index_vote = question.answers[index_answer].votes.findIndex(vote => vote.author == user_id)
        if (index_vote == -1) {
          let newvote = {
            author: user_id,
            vote: -1
          }
          question.answers[index_answer].votes.push(newvote)

          question.save((err, q) => {
            if (err) res.send(err)
            res.send(q)
          })
        }else {
          let error = {
            message: 'User has voted, so he cannot vote again.'
          }
          res.send(error)
        }
      } // if (index_answer != -1)

    })
}
