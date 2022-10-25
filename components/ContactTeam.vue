<template lang="html">
    <div
        v-intersection-observer
        class="contact-team"
    >
        <h3 class="section-title">
            Team
        </h3>
        <div class="reps">
            <block-rep
                v-for="item in items"
                :key="item.name"
                class="rep"
                :name="item.name"
                :email="item.email"
                :position="item.position"
            />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style lang="scss" scoped>
.contact-team {
    padding: 0 0 0 385px;

    .section-title {
        // margin: 85px 0 20px;
        margin: 0 0 20px 0;
        font-size: 34px;
        font-weight: 300;
        font-style: italic;
        transform: translate(0%, 100%);
        opacity: 0;
        transition: transform 0.6s var(--easing-authentic-motion),
            opacity 0.6s var(--easing-authentic-motion);
    }

    .reps {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        max-width: 700px;
    }
    .rep {
        margin: 0 0 50px;
    }

    &.has-intersected {
        .section-title {
            transform: translate(0%);
            opacity: 1;
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        padding: 0 0 0 465px;
    }
    @media #{$lt-tablet} {
        padding: 0 0 0 320px;
    }
    @media #{$lt-phone} {
        padding: 0 40px;

        .reps {
            flex-direction: column;
        }
    }
}
</style>
