<template lang="html">
    <div
        :class="classes"
        @click="onClick"
    >
        <wp-menu
            name="Main Menu"
            class="main-menu"
            @click.native="onClick"
        />
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
            return ["panel-menu", { "is-open": this.isOpen }]
        }
    },
    methods: {
        onClick() {
            this.$emit("interacted", !this.isOpen)
        }
    }
}
</script>

<style lang="scss" scoped>
.panel-menu {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 800;
    box-sizing: border-box;
    padding: 0 40px;
    overflow: auto;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    // justify-content: center;
    align-items: flex-end;
    // align-content: center;

    background-color: #000000e6;
    transform: translate(0, -100%);
    transition: transform 0.5s var(--easing-authentic-motion);

    ::v-deep .main-menu {
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: right;
        margin-top: 100px;
        .menu-item {
            font-size: 56px;
            padding: 12px 0;
            line-height: 1;
            color: var(--color-white);
        }
    }

    /* Hover States */
    @media #{$has-hover} {
    }

    /* Breakpoints */
    @media #{$gt-cinema} {
    }

    @media #{$lt-phone} {
        &.is-open {
            transform: translate(0%);
            transition: transform 0.4s var(--easing-authentic-motion);
        }
    }
}
</style>
