import RxComponentMixin from './rx-component-mixin'
export default {
  mixins: [RxComponentMixin],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  },
  computed: {
    computedElOptions () {
      return this.$attrs
    },
    computedElListeners () {
      return this.$listeners
    }
  }
}