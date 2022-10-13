<template lang="html">
    <div class="contact-team">
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
        margin: 85px 0 20px;
        font-size: 34px;
        font-style: italic;
    }

    .reps {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        max-width: 700px;
    }
    .rep {
        margin: 0 0 55px;
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
