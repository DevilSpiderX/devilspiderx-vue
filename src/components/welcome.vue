<template>
    <div id="main">
        <div>
            <i class="fas fa-spider"></i>
            <p id="logo">DevilSpiderX</p>
        </div>
    </div>
</template>

<script>
import {changeThemeColor, changeGlobalCss} from "@/js/global";
import router from "@/router";

export default {
    name: "welcome",
    methods: {
        verify() {
            jQuery.ajax("/api/user/status", {
                type: "POST", success: (resp) => {
                    console.log(resp);
                    let data = resp.data;
                    if (!data["login"] && data["status"] === 0) {
                        router.push({name: "login"});
                    } else {
                        router.push({name: "index"});
                    }
                }, error: () => {
                    router.push({name: "login"});
                }
            });
        }
    },
    mounted() {
        changeThemeColor("#FFFFFF");
        changeGlobalCss("./static/css/welcome_g.css");
        setTimeout(this.verify, 400);
    }

}
</script>

<style scoped>
#main {
    width: 100%;
    height: 100%;
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