<template lang="html">
    <div
        v-intersection-observer
        class="contact-reps"
    >
        <h2 class="section-title">
            Representation
        </h2>
        <div
            v-for="region in regions"
            :key="region.location"
            class="region"
        >
            <h3
                class="location"
                v-html="`${region.location} ${region.company}`"
            />
            <div class="reps">
                <block-rep
                    v-for="rep in region.reps"
                    :key="rep.name"
                    class="rep"
                    :name="rep.name"
                    :email="rep.email"
                    :telephone="rep.telephone"
                    :position="rep.position"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        regions: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style lang="scss" scoped>
.contact-reps {
    padding: 0 0 0 385px;
    .section-title {
        margin: 30px 0 20px;
        font-size: 34px;
        font-style: italic;
    }
    .location {
        font-size: 18px;
        font-style: italic;
        font-weight: 300;
    }
    .section-title,
    .location {
        transform: translate(0%, 100%);
        opacity: 0;
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }
    .reps {
        max-width: 700px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .rep {
        margin: 25px 0;
    }

    &.has-intersected {
        .section-title,
        .location {
            transform: translate(0%);
            opacity: 1;
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        padding: 0 0 0 465px;

        .section-title {
            margin: 90px 0 17px;
        }
    }
    @media #{$lt-tablet} {
        padding: 0 0 0 320px;
    }
    @media #{$lt-phone} {
        padding: 0 40px;

        .location {
            margin: 0;
        }

        .reps {
            flex-direction: column;
        }
        .rep {
            margin: 0 0 40px 0;
            &:first-child {
                margin-top: 20px;
            }
        }
    }
}
</style>
