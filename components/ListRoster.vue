<template>
    <ul
        v-intersection-observer
        :class="classes"
        @mouseenter="onHover"
        @mouseleave="onHoverOff"
    >
        <li
            v-for="(item, i) in items"
            :key="item.title"
            class="list-item"
        >
            <nuxt-link
                class="link"
                :to="item.to"
            >
                <roster-item :text="item.title" />

                <wp-image
                    :image="item.image"
                    class="image"
                />
            </nuxt-link>
            <!-- 
            <wp-image
                :image="item.image"
                class="image"
            /> -->
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            isHovered: false
        }
    },
    computed: {
        classes() {
            return ["list-roster", { "is-hovered": this.isHovered }]
        }
    },
    methods: {
        onHover() {
            console.log("hover on")
            this.isHovered = true
        },
        onHoverOff() {
            console.log("hover off")
            this.isHovered = false
        }
    }
}
</script>

<style lang="scss" scoped>
.list-roster {
    padding: 0 40px;
    margin: 0;
    height: 100%;
    width: 100%;
    position: relative;
    list-style: none;

    transition: opacity 0.6s var(--easing-authentic-motion),
        transform 0.6s var(--easing-authentic-motion);

    .list-item {
        padding: 0;
        position: relative;

        transition: opacity 0.4s var(--easing-authentic-motion),
            color 0.4s var(--easing-authentic-motion);
    }

    .link {
        position: relative;
        // z-index: 50;
        display: block;
        cursor: pointer;

        color: var(--color-white);
        // mix-blend-mode: difference;
        font-size: 26px;
        font-weight: 300;
        padding: 0 25px;
        text-align: right;
        transform: translate(-40%, 0);
        transition: transform 0.6s var(--easing-authentic-motion),
            color 0.4s var(--easing-authentic-motion),
            opacity 0.4s var(--easing-authentic-motion);
    }

    ::v-deep .image {
        position: absolute !important;
        top: 50%;
        left: 50%;
        // z-index: -1;
        pointer-events: none;
        width: 655px;

        // opacity: 0;
        transform: translate(100%, -50%);
        clip-path: inset(0 0 0 100%);

        transition: opacity 0.4s var(--easing-authentic-motion),
            transform 0.4s var(--easing-authentic-motion),
            clip-path 0.6s var(--easing-authentic-motion);
    }

    .list-item:nth-of-type(even) {
        .link {
            text-align: left;
            transform: translate(40%, 0);
        }
        .image {
            transform: translate(-200%, -50%);
            clip-path: inset(0% 100% 0% 0);
        }
    }

    &.has-intersected {
        .link {
            transform: translate(-50%, 0);
        }
        .list-item:nth-of-type(even) .link {
            text-align: left;
            transform: translate(50%, 0);
        }
    }

    /* Hover State */
    // &.is-hovered {
    //     .link {
    //         opacity: 0;
    //     }
    // }
    @media #{$has-hover} {
        ::v-deep .list-item:hover {
            .link {
                // position: relative;
                z-index: 200;
                opacity: 1;
            }
            .image {
                z-index: 10;
                opacity: 1;
                transform: translate(60%, -50%);
                clip-path: inset(0%);
            }
            &:nth-of-type(even) {
                .image {
                    transform: translate(-170%, -50%);
                }
            }
        }
    }

    /* Breakpoints */
    @media #{$gt-cinema} {
        ::v-deep .image {
            width: 930px;
            height: 530px;
        }
    }

    @media #{$lt-tablet} {
        width: 100%;
        margin: 60px 0;

        &.has-intersected .list-item:nth-of-type(n) .link,
        .list-item:nth-of-type(n) .link {
            text-align: left;
            transform: translate(0);
            padding: 12px 0;
        }

        ::v-deep .image {
            display: none;
        }

        @media #{$has-hover} {
            ::v-deep .list-item:hover .link {
                color: var(--color-gray);
            }
        }
    }
}
</style>
