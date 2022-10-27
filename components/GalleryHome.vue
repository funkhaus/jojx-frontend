<template>
    <div
        v-intersection-observer="{
            rootMargin: '300px 0px 300px 0px'
        }"
        :class="classes"
        @has-entered="onEnter"
        @has-exited="onExit"
        @mouseleave="resetSkew"
    >
        <gallery-item
            v-for="(item, i) in items"
            :key="item.id"
            :image="item.image"
            :to="item.to"
            :index="i"
            :pause="pause"
            :skew="skew"
        />
    </div>
</template>

<script>
import _throttle from "lodash/throttle"

export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
        introIsComplete: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pause: false,
            skew: 1
        }
    },
    computed: {
        classes() {
            return [
                "gallery-home",
                { "intro-is-complete": this.introIsComplete }
            ]
        }
    },
    mounted() {
        document.addEventListener(
            "visibilitychange",
            _throttle(this.onVisibilitychange, 10)
        )
        if (this.$store.state.breakpoint !== "mobile") {
            document.addEventListener(
                "mousemove",
                _throttle(this.onMouseEvent, 10)
            )
        }
    },
    destroyed() {
        document.removeEventListener(
            "visibilitychange",
            this.onVisibilitychange
        )
        document.removeEventListener("mousemove", this.onMouseEvent)
    },
    methods: {
        onEnter() {
            this.pause = false
        },
        onExit() {
            this.pause = true
        },
        onVisibilitychange(e) {
            this.pause = !this.pause
        },
        onMouseEvent(e) {
            const clientY = e.clientY || e.touches[0].clientY

            this.skew = -1 * (clientY - this.$store.state.winHeight / 2)
        },
        resetSkew() {
            this.skew = 1
        }
    }
}
</script>

<style lang="scss" scoped>
.gallery-home {
    width: 100%;
    height: var(--unit-100vh);
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(100%, 0);
    z-index: 100;
    background-color: var(--theme-color-background);

    overflow: hidden;
    white-space: nowrap;
    padding-left: 200px;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;

    transition: background-color 0.8s var(--easing-authentic-motion),
        transform 1.25s var(--easing-authentic-motion);

    // Hide scrollbars
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }

    &.intro-is-complete {
        transform: translate(0, 0);
    }

    // Breakpoints
    @media #{$lt-phone} {
        height: 100vh;
    }
}
</style>
