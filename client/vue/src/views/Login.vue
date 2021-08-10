<template>
<page-wrapper>
    <form @submit.prevent="onSubmit(email)" class="login-form">
        <input
            id="email"
            type="email"
            placeholder="Email"
            class="email-input"
            required
            v-model="email"
        />
        <button type="submit" class="login-button">Log In</button>
    </form>
    <div class="user-list">
        <h3>Users</h3>
        <h4>ceo@demoapp-inc.com - Super Admin</h4>
        <h4>jane@demoapp-inc.com - Super Admin</h4>
        <h4>tony@starkindustries.com - Store Owner</h4>
        <h4>michael.scott@dundermifflin.com - Store Owner</h4>
        <h4>johndoe@gmail.com - Shopper</h4>
    </div>
</page-wrapper>
</template>

<script>
import Axios from "axios";
import PageWrapper from '../components/PageWrapper.vue';

export default {
    components: { PageWrapper },
    name: "login",
    data() {
        return {
            email: null,
        };
    },
    methods: {
        async onSubmit(email) {
            try {
                const response = await Axios.post("http://localhost:5000/api/login", {
                    email,
                });

                this.$warrant.setSessionToken(response.data.warrantSessionToken);

                this.$router.push({ path: "/stores" });
            } catch (e) {
                console.log("Error while logging in", e);
            }
        }
    }
};
</script>

<style>
.login-form {
    max-width: 250px;
    margin: auto;
    margin-top: 15%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.email-input {
    width: 243px;
    height: 28px;
    padding: 0;
    padding-left: 5px;

    font-size: 16px;
    line-height: 20px;
    border: 1px solid gray;
    border-radius: 4px;
}

.login-button {
    width: 100%;

    cursor: pointer;

    margin-top: 8px;
    padding: 8px;
    color: white;
    background-color: green;
    border-radius: 4px;
    border: none;
}

.login-button:hover {
    background-color: darkgreen;
}

.user-list {
    margin: 35px auto;
    text-align: center;
}
</style>
