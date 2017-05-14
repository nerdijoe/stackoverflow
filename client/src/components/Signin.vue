<template>
  <div class="signin-container">

    <div class="ui one column stackable center aligned page grid">
       <div class="column twelve wide">
         <h3> Sign in</h3>
         <form class="ui huge form" v-on:submit="onSubmitSignin" >
             <div class="field">
               <input type="text" name="username" v-model="user_form.username" placeholder="Username">
             </div>



             <div class="field">
               <input type="password" name="last-name" v-model="user_form.password" placeholder="Password">
             </div>
             <div class="field">
               <button id="btnSubmitLogin" class="ui button green center floated" type="submit">Sign in</button>
             </div>

         </form>
       </div>
    </div>


  </div> <!-- column -->


</template>


<script>
export default {
	data() {
		return {
			user_form: {
				username: '',
				password: ''
			}
		}
	},
	methods: {
		 	onSubmitSignin(e) {
	      e.preventDefault();
	      console.log("here")

	      // alert(this.user_form.username)

	      let self = this;
	      axios.post('http://localhost:3000/users/signin', {
	        username: this.user_form.username,
	        password: this.user_form.password
	      })
	      .then(function (response) {
	        // get the token, save in local storage
	        console.log(response);
	        localStorage.setItem('token', response.data);
	        console.log(localStorage.token);

          self.$emit('signInSuccess')

	        self.$router.push('/')

	      })
	      .catch(function (error) {
	        console.log("**** Error signin")
	        console.log(error);


	      });


	    } // end of onSubmitForm

	}
}
</script>

<style scoped>
.signin-container {
  margin: auto;
  width: 100%;
  margin-top: 20px;
  background: #E0E3DA;
  border-radius: 10px;
}


</style>
