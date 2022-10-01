<template>
    <div id="main">
        <div>
            <i class="fas fa-spider"></i>
            <p id="logo">DevilSpiderX</p>
        </div>
    </div>
</template>

<script>
import {user_status} from "@/js/server-api";
import router from "@/router";

export default {
    name: "WelcomeRoute",
    methods: {
        verify() {
            user_status((resp) => {
                console.log(resp);
                let data = resp.data;
                if (!data["login"] && data["status"] === 0) {
                    router.push({name: "login"});
                } else {
                    router.push({name: "index"});
                }
            }, () => {
                router.push({name: "login"});
            })
        }
    },
    beforeMount() {
        this.setThemeColor();
    },
    mounted() {
        setTimeout(this.verify, 400);
    }

}
</script>

<style scoped>
#main {
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