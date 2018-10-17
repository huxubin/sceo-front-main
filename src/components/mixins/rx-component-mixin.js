export default {
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    isEditing: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isStatic: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {},
  computed: {
    computedDisabled () {
      if (this.disabled === true) return true
      if (this.computedIsLoading) return true
      return false
    },
    computedIsLoading () {
      return this.isLoading
    }
  }
}