<template>
  <div class="app">
    <Header />
    <div class="container">
      <div
        v-if="!showFav"
        class="search"
      >
        <label for="Name">Search your beer</label>
        <input
          id="Name"
          v-model="search"
          type="text"
          name="Name"
          placeholder="Search by name / brew date (mm-yyyy)"
        >
        <p v-if="errorSearch">
          Invalid search params. Type any valid name or date in format (mm-yyyy)
        </p>
      </div>
      <ListComponent
        :beer-list="beerListShow"
        @displayModal="triggerModal"
        @setFav="setFav"
        @hidePaginator="togglePaginator"
      />
      <div
        v-if="showPaginator"
        class="pages"
      >
        <ButtonComponent
          label="Previous page"
          :disabled="page === 1"
          @click.native="changePage(-1)"
        />
        <ButtonComponent
          label="Next Page"
          :disabled="beerList.length < 25"
          @click.native="changePage(+1)"
        />
      </div>
    </div>
    <transition name="modal">
      <ModalComponent
        v-if="showModal"
        :beer="beerSelected"
        @closeModal="triggerModal"
      />
    </transition>
  </div>
</template>

<script>
import BeerService from './services/beerServices'

import debounce from 'lodash.debounce'
import { lockScroll, unlockScroll } from './helpers'

import Header from './components/HeaderComponent/HeaderComponent'
import ListComponent from './components/BeerListComponent/BeerListComponent'
import ModalComponent from './components/ModalComponent/ModalComponent'
import ButtonComponent from './components/ButtonComponent/ButtonComponent'

export default {
  name: 'BeerCatalogue',

  components: {
    Header,
    ListComponent,
    ModalComponent,
    ButtonComponent
  },

  data () {
    return {
      beerList: [],
      search: '',
      errorSearch: false,
      page: 1,
      params: {},
      showModal: false,
      beerSelected: {},
      favBeers: [],
      showFav: false
    }
  },

  computed: {
    showPaginator () {
      return !this.showFav && (this.page === 1 ? this.beerList.length >= 25 : true)
    },
    beerListShow () {
      const beersToShow = this.showFav ? this.favBeers : this.beerList
      return beersToShow.map(elem => {
        const isFav = this.favBeers.find(fav => fav.id === elem.id)

        return {
          ...elem,
          isFav: Boolean(isFav)
        }
      })
    }
  },

  watch: {
    search: function (newVal, oldVal) {
      this.debouncedSearchTerms(newVal, oldVal)
    }
  },

  created () {
    this.debouncedSearchTerms = debounce(this.searchTerms, 500)
  },

  async mounted () {
    const { data } = await BeerService.getBeerList()

    this.beerList = data
  },

  methods: {
    async searchTerms (newVal, oldVal) {
      const newValue = newVal.trim()
      this.errorSearch = false
      this.page = 1
      if (newValue === '') {
        const { data } = await BeerService.getBeerList({ page: this.page })
        this.beerList = data
        this.params = {}
      } else {
        const newValueArr = newValue.split(' ')
        const params = {}

        newValueArr.forEach(elem => {
          const regName = new RegExp(/^[A-Za-z\s]+$/g)
          const regDate = new RegExp(/[0-9]{2}-[0-9]{4}/g)

          if (regName.test(elem)) params.beer_name = params.beer_name ? `${params.beer_name} ${elem}` : elem
          else if (regDate.test(elem)) params.brewed_after = elem
        })

        if (Object.keys(params).length) {
          this.params = params
          const { data } = await BeerService.getBeerList({
            ...params,
            page: this.page
          })
          this.beerList = data
        } else {
          this.errorSearch = true
        }
      }
    },
    async changePage (index) {
      if (this.page + index < 1) return
      const params = {
        ...this.params,
        page: this.page + index
      }

      this.page = this.page + index

      const { data } = await BeerService.getBeerList(params)

      this.beerList = data
    },

    triggerModal (data) {
      this.showModal = !this.showModal
      if (this.showModal) {
        this.beerSelected = data
        lockScroll()
      } else {
        this.beerSelected = {}
        unlockScroll()
      }
    },

    setFav (data) {
      const indexFav = this.favBeers.findIndex(fav => fav.id === data.id)
      if (indexFav < 0) this.favBeers.push(data)
      else this.favBeers.splice(indexFav, 1)
    },

    togglePaginator () {
      this.showFav = !this.showFav
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" src="./styles/index.scss" />
