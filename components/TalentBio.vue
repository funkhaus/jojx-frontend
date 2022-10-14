<template>
    <div
        v-intersection-observer="{
            rootMargin: '-50px 0px -50px 0px'
        }"
        :class="classes"
        @has-intersected="onIntersected"
    >
        <!-- TODO: add content and style properly -->

        <div class="column socials">
            <ul class="socials">
                <li v-for="item in socials">
                    <span v-text="item.title" />
                    <a
                        :href="item.to"
                        :item="item.platform"
                    />
                </li>
            </ul>
        </div>

        <div class="column image">
            <wp-image
                class="image"
                :image="image"
                object-fit="contain"
            />

            <div
                class="excerpt"
                v-html="excerpt"
            />
        </div>

        <div class="column text-content">
            <div
                class="text"
                v-html="text"
            />
        </div>
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

    .column {
        position: relative;
        width: 33.33%;
    }

    .excerpt {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        transform: translate(-75%, -75%);
        width: 100%;
        min-width: 600px;

        color: var(--color-white);
        mix-blend-mode: difference;
        font-size: 52px;
        font-weight: 300;
    }

    .text {
        padding: 0 var(--unit-gap);
        box-sizing: border-box;
        font-size: 18px;
        line-height: 1.3;
    }

    .image {
        max-width: 350px;
    }

    // Breakpoints
    @media #{$lt-phone} {
    }
}
</style>
