<template>
    <div class="main">
        <div>
            <i class="fas fa-spider"></i>
            <p id="logo">DevilSpiderX</p>
        </div>
    </div>
</template>

<script>
import {user_status} from "@/js/server-api";

export default {
    name: "WelcomeRoute",
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
    mounted() {
        setTimeout(this.verify, 400);
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

#logo {
    text-align: center;
    font-size: 3rem;
    font-weight: 900;
    margin: 2rem 0;
}
</style>