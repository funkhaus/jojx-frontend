<template>
    <nuxt-link
        to="/"
        :class="classes"
    >
        <svg-logo class="svg" />
    </nuxt-link>
</template>

<script>
// Svgs
import SvgLogo from "~/assets/svg/logo-jojx"

export default {
    components: {
        SvgLogo
    },
    props: {
        introActive: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return ["global-logo", { "intor-active": this.introActive }]
        }
    }
}
</script>

<style lang="scss" scoped>
.global-logo {
    position: fixed;
    z-index: 900;
    bottom: var(--unit-gap);
    left: var(--unit-gap);
    mix-blend-mode: difference;

    transform: scale(0.2); // 145 / 716 = .2
    transform-origin: bottom left;
    transition: transform 0.4s var(--easing-authentic-motion);

    .svg path {
        fill: var(--color-white);
    }

    // Breakpoints
    @media #{$lt-phone} {
        transform: scale(0.15); // 112 / 716 = .2
    }
}
</style>
