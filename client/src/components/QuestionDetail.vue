<template>
  <div class="question_detail">
    <router-link
      to="/home"
      class="ui item"
      active-class="active"
      exact
    >
      back
    </router-link>


    <h2>{{ question.title }}</h2>
    <div class="ui divider"></div>
    <p>
      {{ question.content }}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['id'],
    data () {
      return {
        question: {}
      }
    },
    methods: {
      getQuestionDetail () {
        let self = this;

        axios.get( `http://localhost:3000/questions/${this.id}` )
        .then ( response => {
          console.log("*** getQuestionDetail", response.data)
          self.question = response.data;
        })
        .catch ( err => {
          console.log(err);
        })
      }
    }, // end of methods
    created () {
      this.getQuestionDetail()
    }
  }
</script>

<style scoped>
.question_detail {
  margin-top: 20px;
}

</style>
