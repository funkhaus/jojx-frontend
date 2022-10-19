<template>
    <div
        v-if="image.id"
        v-intersection-observer="{
            rootMargin: '-50px 0px -50px 0px'
        }"
        :class="classes"
        @has-intersected="onIntersected"
    >
        <div
            class="abstract mobile"
            v-html="abstract"
        />

        <div class="column social">
            <ul class="socials">
                <li
                    v-for="item in socials"
                    :key="item.to"
                    class="item"
                >
                    <span
                        class="platform"
                        v-text="item.platform"
                    />
                    <a
                        class="link"
                        :href="item.to"
                        v-html="item.title"
                    />
                </li>
            </ul>
        </div>

        <div class="column image-content">
            <div
                class="abstract desktop"
                v-html="abstract"
            />

            <wp-image
                class="image"
                :image="image"
                object-fit="contain"
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
        abstract: {
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
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    width: 100%;
    min-height: var(--unit-100vh);

    .column {
        position: relative;
        width: 33.33%;
    }

    .abstract {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        transform: translate(-50%, -75%);
        width: 100%;
        min-width: 600px;
        max-width: 600px;

        // TODO: show dave
        // mix-blend-mode: difference;
        font-size: 34px;
        font-weight: 300;
        color: var(--color-black);
        ::v-deep * {
            font-size: 30px;
            &:first-of-type {
                margin-top: 0;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .image {
        max-width: 350px;
        margin: 0 auto;
    }

    .socials {
        max-width: 150px;
        margin-left: auto;
        padding: 0;
        list-style: none;
        font-size: 16px;
    }
    .item {
        margin-bottom: 25px;
    }
    .platform {
        font-style: italic;
    }
    .link {
        text-decoration: underline;
    }

    .text {
        padding: 0 var(--unit-gap);
        box-sizing: border-box;
        font-size: 18px;
        line-height: 1.3;
        max-width: 350px;
        margin-right: auto;
        ::v-deep * {
            font-size: 18px;
            &:first-of-type {
                margin-top: 0;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }

    .mobile {
        display: none;
    }

    // Breakpoints
    @media #{$lt-tablet} {
        align-content: center;

        .column.social {
            width: 20%;
        }
        .column.image-content {
            width: 50%;
        }
        .column.text-content {
            width: 100%;
        }
        .text {
            max-width: 450px;
            margin: 0 auto;
        }

        .abstract {
            top: 0;
            left: 50%;
            transform: translate(-75%, -75%);
        }
    }

    @media #{$lt-phone} {
        padding: 0 var(--unit-gap);
        box-sizing: border-box;

        .column.social,
        .column.image-content,
        .column.text-content {
            width: 100%;
        }

        .image {
            width: 100%;
            max-width: 100%;
            margin-top: 50px;
            margin-bottom: 50px;
        }
        .socials {
            margin-left: unset;
            margin-right: auto;
        }

        .abstract {
            position: static;
            // top: 0;
            // left: 0;
            transform: translate(0);
            width: 100%;
            min-width: 100%;
            padding: 40px 0;
        }

        .text {
            max-width: 100%;
            padding: 0;
            font-size: 16px;
            ::v-deep * {
                font-size: 16px;
            }
        }

        .mobile {
            display: block;
        }
        .desktop {
            display: none;
        }
    }
}
</style>
