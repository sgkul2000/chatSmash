<template>
  <div class="home">
    <div class="container-fluid">
      <div class="row text-center">
        <div class="col-sm-5 mx-auto loginDialog">
          <h1>Login</h1>
          <b-form @submit.prevent="redirect">
            <div class="goLeft">
              <b-form-group
                id="input-group-1"
                label="Username:"
                label-for="input-1"
                description="Enter a username of your choice"
              >
                <b-form-input
                  id="input-1"
                  v-model="form.username"
                  type="text"
                  required
                  placeholder="Enter your Username"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-2"
                label="Name:"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="form.nickname"
                  type="text"
                  required
                  placeholder="Enter name"
                ></b-form-input>
              </b-form-group>
            </div>
            <b-button
              type="submit"
              variant="primary"
            >Submit</b-button>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";
import getRoom from "../getRoom";

export default {
  name: "Home",
  data() {
    return {
      form: {
        username: "",
        nickname: ""
      }
    };
  },
  methods: {
    ...mapActions(["loginUser"]),
    async redirect() {
      try {
        await getRoom.userLogin(this.form.username, this.form.nickname)
        const payload = {
          username: this.form.username,
          nickname: this.form.nickname
        };
        this.loginUser(payload);
        this.form = {
          username: "",
          nickname: ""
        };
        this.$router.push("chat/");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style>
.home {
  display: flex;
  position: fixed;
  top: 50;
  left: 50;
  /* justify-content: ; */
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.loginDialog {
  background-color: rgba(red, green, blue, alpha);
  padding: 5rem 4rem;
  /* text-align: left; */
  /* overflow-y: hidden; */
}
.goLeft {
  text-align: left;
}
</style>