<template>
    <div :class="classes">
        <template v-for="(item, i) in items">
            <block-work
                :key="item.id"
                class="item"
                :image="item.image"
                :index="i"
                :image-secondary="item.imageSecondary"
                :type="item.type"
                :to="item.to"
                :title="item.title"
                :text="item.text"
                :talent="item.talent"
                :category="item.category"
                :publication="item.publication"
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

    // Breakpoints
    @media #{$lt-phone} {
        .item {
            width: 100%;
        }
    }
}
</style>
