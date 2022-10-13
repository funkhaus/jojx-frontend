<template>
    <div :class="classes">
        <template v-for="(item, i) in items">
            <block-work
                :key="item.id"
                class="item"
                :image="item.image"
                :type="item.type"
                :to="item.to"
                :title="item.title"
                :text="item.text"
                :tags="item.tags"
            />
            <template v-if="i == 3">
                <slot />
            </template>
        </template>
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
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .item {
        width: 50%;
    }

    // Breakpoints
    @media #{$lt-phone} {
        .item {
            width: 100%;
        }
    }
}
</style>
