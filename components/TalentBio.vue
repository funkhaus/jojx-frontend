<template>
    <div
        v-intersection-observer="{
            rootMargin: '-50px 0px -50px 0px'
        }"
        :class="classes"
        @has-intersected="onIntersected"
    >
        <!-- TODO: add content and style properly -->
        <div
            class="excerpt"
            v-html="excerpt"
        />

        <ul class="socials">
            <li v-for="item in socials">
                <span v-text="item.title" />
                <a
                    :href="item.to"
                    :item="item.platform"
                />
            </li>
        </ul>

        <wp-image
            class="image"
            :image="image"
        />
        <div
            class="text"
            v-html="text"
        />
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        },
        excerpt: {
            type: String,
            default: ""
        },
        image: {
            type: Object,
            default: () => {}
        },
        socials: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        classes() {
            return ["talent-bio"]
        }
    },
    methods: {
        onIntersected(event) {
            console.log("onIntersected", event.detail.isIntersecting)
            if (event.detail.isIntersecting) {
                this.$store.commit("SET_THEME", "gray")
            } else {
                this.$store.commit("SET_THEME", "white")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.talent-bio {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;
    min-height: 80vh;

    .image {
        max-width: 350px;
    }

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
