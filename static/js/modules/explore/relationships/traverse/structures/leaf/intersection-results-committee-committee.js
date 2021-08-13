const intersection_results_committee_committee = {
  template: `
    <div>
      <matches :mentity="mentity" index="0" :has="has" :numbranches="numbranches" :interactions="interactions" :api="matches[0]" :qs="qs[0]" :selected="selected" @onselect="onselect" @investigate="investigate" class="mb-10">
        <template v-slot:header>Matches</template>
        <template v-slot:intro>These are the {{settings.entity2}}s common to {{_.toUpper(settings.term)}} and {{_.toUpper(settings.term2)}} through direct contributions.</template>
        <template v-slot:none>No matches found</template>
      </matches>
      <matches :mentity="mentity" index="1" :has="has" :numbranches="numbranches" :interactions="interactions" :api="matches[0]" :qs="qs[1]" :selected="selected" @onselect="onselect" @investigate="investigate">
        <template v-slot:header>Matches</template>
        <template v-slot:intro>These are the {{settings.entity2}}s common to {{_.toUpper(settings.term)}} and {{_.toUpper(settings.term2)}} through independent expenditures targeting the same candidates.</template>
        <template v-slot:none>No matches found</template>
      </matches>
      <actions :mentity="mentity" :next="next" :selected="selected" @action="action">
        <template v-slot:header>Actions</template>
        <template v-slot:intro>Choose an analytical action to perform on the selected matches.</template>
      </actions>
    </div>
  `,
  props: {
    settings: Object,
    numbranches: Number
  },
  computed: {
    mentity() {
      return this.settings.entity2
    },
    has() {
      return {
        intermediaries: !_.isNil(this.$store.state.explore.intermediaries[this.settings.entity][this.mentity]),
        expansions: _.includes(this.$store.state.explore.expansions, this.settings.mentity),
        search: _.includes(this.$store.state.explore.search, this.mentity)
      }
    },
    next() {
      return {
        associations: !_.isNil(this.$store.state.explore.associations[this.mentity]),
        intersection: _.includes(this.$store.state.explore.intersections, this.mentity),
        intersection2: false
      }
    }
  },
  data() {
    return {
      interactions: {
        selectable: true
      },
      matches: [{
        endpoint: '/api/traverse/intersection/',
        payload: {
          'ids': this.settings.ids,
          'ids2': this.settings.ids2,
          'entity': this.settings.entity,
          'entity2': this.settings.entity2
        }
      }],
      qs: [{'intermediaries': 'contribution'}, {'intermediaries': 'expenditure'}],
      selected: []
    }
  },
  methods: {
    pluralize(value) {
      return this.$options.filters.plural(value);
    },
    onselect(payload) {
      this.selected = payload
    },
    investigate(payload) {
      if (payload.type == 'intermediate') {
        this.$emit('add', {template: 'intersection-details', entity: this.settings.entity, entity2: this.mentity, term: this.settings.term, term2: this.settings.term2, term3: payload.term, ids: this.settings.ids, ids2: this.settings.ids2, ids3: payload.ids, qs: payload.qs, index: payload.index})
      } else if (payload.type == 'expand') {
        this.$emit('add', {template: this.mentity, entity: this.mentity, term: payload.term, ids: payload.ids})
      } else if (payload.type == 'search') {
        this.$emit('add', {template: 'overview', entity: payload.entity, term: payload.term})
      }
    },
    action(payload) {
      let term = this.settings.term + ' X ' + this.settings.term2 + ' (' + this.pluralize(this.mentity) + ')'
      if (payload.type == 'associations') {
        this.$emit('add', {template: 'associations-results', entity: this.mentity, term: term, ids: this.selected, entity2: payload.setting})
      } else if (payload.type == 'intersection') {
        this.$emit('add', {template: 'intersection-settings', entity: this.mentity, term: term, ids: this.selected, term2: payload.setting})
      }
    }
  }
}
