<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'GoAdminGit',
  data() {
    return {
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
