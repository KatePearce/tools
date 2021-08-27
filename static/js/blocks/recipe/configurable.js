const configurable = {
  template: `
  <div class="inline">
    <span v-if="settings.version == 'list'" @click="$emit('click')"><span v-if="!settings.prefill">a </span><strong>{{settings.prefill ? options[0].name : _.startCase(settings.subtype) + ' List'}}</strong><span v-if="settings.prefill"> ({{_.startCase(settings.subtype) + ' List'}})</span></span>
    <span v-if="settings.version == 'settings'"><strong>List {{_.toUpper(settings.sequence)}}</strong> ({{_.startCase(settings.subtype) + ' List'}})</span>
    <a href="javascript:void(0);" @click="$emit('click')" v-if="settings.version == 'results'">{{settings.name}} <i class="fas fa-info-circle"></i></a>
  </div>
  `,
  props: {
    lists: {
      type: Array,
      default: []
    },
    settings: {
      type: Object,
      default: function () {
        return {
          version: 'list',
          lists: [],
          prefill: false,
          subtype: null,
          sequence: 'a'
        }
      }
    }
  },
  computed: {
    options() {
      return this.settings.lists[this.settings.subtype]
    }
  }
}
