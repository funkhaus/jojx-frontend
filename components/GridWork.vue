<template>
    <div :class="classes">
        <!-- foo -->

        <block-work
            v-for="item in items"
            :key="item.id"
            class="item"
            :image="item.image"
            :type="item.type"
            :to="item.to"
            :title="item.title"
            :text="item.text"
            :tags="item.tags"
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
            return ["grid-work"]
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.grid-work {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .item {
        width: 50%;
    }

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
