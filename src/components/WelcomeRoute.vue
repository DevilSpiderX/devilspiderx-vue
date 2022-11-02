<template>
    <div class="main">
        <div>
            <i class="fas fa-spider"></i>
            <p class="logo">
                Good<br/>
                {{ logo }}
            </p>
        </div>
    </div>
</template>

<script>
import {user_status} from "/src/scripts/server-api.js";

export default {
    name: "WelcomeRoute",
    data() {
        return {
            logo: ""
        }
    },
    methods: {
        verify() {
            user_status(function (resp) {
                console.log(resp);
                let data = resp.data;
                if (!data["login"] && data["status"] === 0) {
                    this.$router.push({name: "login"});
                } else {
                    this.$router.push({name: "index"});
                }
            }.bind(this), function () {
                this.$router.push({name: "login"});
            }.bind(this))
        }
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    async mounted() {
        let hour = new Date().getHours();
        if (7 <= hour && hour < 12) {
            this.logo = "Morning";
        } else if (12 <= hour && hour < 19) {
            this.logo = "Afternoon";
        } else {
            this.logo = "Evening";
        }
        await this.sleep(400);
        this.verify();
    }

}
</script>

<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fa-spider {
    font-size: 20rem;
}

.logo {
    text-align: center;
    font-size: 3rem;
    font-weight: 900;
    font-family: system-ui;
    margin: 2rem 0;
}

body[arco-theme='dark'] .main {
    color: #fcfcfc;
}
</style>