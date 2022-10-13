<template>
    <div :class="classes">
        <wp-menu
            name="Social Menu"
            class="menu"
            :is-footer="true"
        />
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        classes() {
            return ["global-footer"]
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.global-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: var(--unit-gap);
    margin-bottom: var(--unit-gap);

    .menu ::v-deep {
        list-style: none;
        padding: 0;
        margin: 0;

        .menu-item {
            display: inline;
            font-size: 18px;
            line-height: 1.3;
            font-weight: 300;
            padding: 0 16px;
        }
    }

    // Breakpoints
    @media #{$lt-phone} {
        justify-content: flex-end;
        margin-bottom: 16px;

        .menu ::v-deep .menu-item {
            display: block;
            padding: 0 20px;
        }
    }
}
</style>
