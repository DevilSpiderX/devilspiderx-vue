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
import router from "../router.js";
import http from "/src/scripts/server-api";

export default {
    name: "WelcomeRoute",
    data() {
        return {
            logo: ""
        }
    },
    methods: {
        async verify() {
            let pushName;
            try {
                let resp = await http.user_status();
                console.log("user_status:", resp);
                let data = resp.data;
                if (data["login"] && data["status"] === 1) {
                    pushName = "index";
                } else {
                    pushName = "login";
                }
            } catch (error) {
                console.error("verify:", error);
                pushName = "login";
            }
            await this.router_push(pushName);
        },
        async router_push(name) {
            await this.sleep(400);
            await router.push({name});
        }
    },
    beforeMount() {
        this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
    },
    mounted() {
        let hour = new Date().getHours();
        if (7 <= hour && hour < 12) {
            this.logo = "Morning";
        } else if (12 <= hour && hour < 19) {
            this.logo = "Afternoon";
        } else {
            this.logo = "Evening";
        }
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