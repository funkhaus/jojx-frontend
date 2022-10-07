<template>
    <div
        :class="classes"
        @click="toggleMenu()"
    >
        <div class="line line-1" />
        <div class="line line-2" />
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            return ["global-hamburger", { "is-open": this.isOpen }]
        }
    },
    methods: {
        toggleMenu() {
            // Toggle menu state
            this.$emit("menu-opened", !this.isOpen)
        }
    }
}
</script>

<style lang="scss" scoped>
.global-hamburger {
    display: none;

    padding: 20px;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;

    .line {
        height: 2px;
        width: 20px;
        background-color: var(--color-black);
        &:first-of-type {
            margin: 0 0 6px 0;
        }
        &:last-of-type {
            margin: 6px 0 0 0;
        }
    }
    .line-1,
    .line-2 {
        transition-duration: 0.4s;
        transition-property: rotate, translate;
        transition-timing-function: var(--easing-authentic-motion);
    }

    // Open Styles
    &.is-open {
        .line-1 {
            rotate: 45deg;
            translate: 0 3px;
        }
        .line-2 {
            rotate: -45deg;
            translate: 0 -4.5px;
        }
    }

    // Breakpoints
    @media #{$lt-phone} {
        display: block;
    }
}
</style>
