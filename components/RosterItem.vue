<template lang="html">
    <component
        :is="element"
        :class="classes"
    >
        <div
            v-for="text in parsedText"
            class="word"
            v-html="text"
        />
    </component>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        },

        element: {
            type: String,
            default: "span"
        }
    },

    computed: {
        classes() {
            return [
                "roster-item",
                { "is-one-word": this.parsedText?.length == 1 }
            ]
        },
        parsedText() {
            let split = this.text.split(" ")
            // return split
            return split.map((text) => {
                return (text += " ")
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.roster-item {
    position: relative;
    z-index: 100;
    margin: 0 0 20px 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    transition: all 0.4s var(--easing-authentic-motion);
    white-space: break-spaces;

    .word {
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        line-height: 1.2;
        white-space: break-spaces;

        &:nth-of-type(1) {
            font-style: italic;
        }
        &:nth-of-type(2) {
            text-transform: uppercase;
        }

        &:last-of-type {
            padding-right: 0;
        }
    }
    &.is-one-word {
        .word:nth-of-type(1) {
            font-style: normal;
            text-transform: uppercase;
        }
    }

    @media #{$lt-phone} {
    }

    @media #{$gt-cinema} {
    }
}
</style>
