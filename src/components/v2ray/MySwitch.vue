<template>
    <div class="switch" tabindex="0" :data-status="status" :style="style">
        <div class="switch-container">
            <div class="switch-lever-0">
                <span><slot name="ON">ON</slot></span>
            </div>
            <div class="switch-lever-1"></div>
            <div class="switch-lever-2">
                <span><slot name="OFF">OFF</slot></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MySwitch",
    data() {
        return {
            status: "off",
            style: ""
        }
    },
    props: [
        "width", "height", "font-size"
    ],
    methods: {
        switch_modal() {
            if (this.is_on()) {
                this.switch_off();
            } else {
                this.switch_on();
            }
        },
        switch_on() {
            this.status = "on";
        },
        switch_off() {
            this.status = "off";
        },
        is_on() {
            return this.status === "on";
        }
    }, mounted() {
        if (this.width !== undefined) {
            this.style += `--width:${this.width};`;
        }
        if (this.height !== undefined) {
            this.style += `--height:${this.height};`;
        }
        if (this.fontSize !== undefined) {
            this.style += `--font-size:${this.fontSize};`;
        }
    }
}
</script>

<style scoped>
.switch {
    --width: 10rem;
    --height: 4rem;
    --font-size: 20px;
}

.switch {
    width: var(--width);
    height: var(--height);
    padding: 0;
    background: linear-gradient(to right, #28a745 33.3%, white 33.3%, white 66.6%, #eee 66.6%);
    background-size: 150%;
    border: 1px solid #ccc;
    border-radius: .7rem;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
    direction: ltr;
    text-align: center;
    box-sizing: border-box;
    font-size: var(--font-size);
    font-weight: 500;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out,
    background-position .4s ease-in-out;
    user-select: none;
}

.switch:focus, .switch:active {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    outline: 0;
}

.switch[data-status="off"] {
    background-position: right;
}

.switch-container {
    width: 150%;
    height: 100%;
    padding: 0;
    display: flex;
    transition: transform .4s ease-in-out .05s;
}

.switch[data-status="off"] > .switch-container {
    --X: calc(-1 * var(--width) / 2);
    transform: translateX(var(--X));
}

.switch-lever-0,
.switch-lever-1,
.switch-lever-2 {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.switch-lever-0 {
    color: white;
}

.switch-lever-2 {
    color: rgba(0, 0, 0, 0.87);
}

</style>