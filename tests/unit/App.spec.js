import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import http from '@/http'
import beers from '../mocking/beers.json'
import beersPopulated from '../mocking/beersPopulated.json'
import BeerListComponent from '@/components/BeerListComponent/BeerListComponent'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'

jest.mock('@/http/index.js')

describe('App.vue', () => {
  describe('-- With empty vals --', () => {
    let wrapper

    beforeEach(() => {
      http.get.mockImplementation(() => Promise.resolve({ data: [] }))
      wrapper = shallowMount(App)
    })

    it('renders component correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('shouldnt show paginator since showPaginator is false', () => {
      expect(wrapper.vm.showPaginator).toBeFalsy()
    })
  })

  describe('-- With populated vals --', () => {
    let wrapper

    beforeEach(() => {
      http.mockReset()
      http.get.mockReset()
      http.get.mockImplementation(() => Promise.resolve({ data: beers }))
      wrapper = shallowMount(App)
    })

    it('renders component correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should show paginator since showPaginator is true', () => {
      expect(wrapper.vm.showPaginator).toBeTruthy()
    })

    it('shouldnt show paginator since showFav is true & showPaginator is false', () => {
      wrapper.setData({ showFav: true })
      expect(wrapper.vm.showPaginator).toBeFalsy()
    })

    it('should show paginator since page is > 1 & showPaginator is true', () => {
      wrapper.setData({ page: 2 })
      expect(wrapper.vm.showPaginator).toBeTruthy()
    })

    it('should map correctly fav beers and set isFav prop properly', async () => {
      const favBeers = beers.slice(0, 5)
      wrapper.setData({ favBeers })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.beerListShow).toEqual(beersPopulated)
    })

    it('should return just fav list beers when showFav is true', async () => {
      const favBeers = beers.slice(0, 5)
      wrapper.setData({ favBeers, showFav: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.beerListShow).toEqual(favBeers.map(elem => ({ ...elem, isFav: true })))
    })

    it('should call correctly to the api and retrieve data when searchTerm name is properly defined', () => {
      wrapper.vm.searchTerms('lager')
      expect(http.get).toHaveBeenNthCalledWith(2, '/beers', { params: { beer_name: 'lager', page: 1 } })
      expect(wrapper.vm.params).toEqual({ beer_name: 'lager' })
    })

    it('should call correctly to the api and retrieve data when searchTerm name is properly defined', () => {
      wrapper.vm.searchTerms('lager 10-2010')
      expect(http.get).toHaveBeenNthCalledWith(2, '/beers', { params: { beer_name: 'lager', brewed_after: '10-2010', page: 1 } })
      expect(wrapper.vm.params).toEqual({ beer_name: 'lager', brewed_after: '10-2010' })
    })

    it('should throw error when term isnt valid', () => {
      http.get.mockReset()
      wrapper.vm.searchTerms('1s0-2fdf010')
      expect(wrapper.vm.errorSearch).toBeTruthy()
    })

    it('should call to raw page one when search terms are empty', () => {
      wrapper.vm.searchTerms('')
      expect(http.get).toHaveBeenNthCalledWith(2, '/beers', { params: { page: 1 } })
      expect(wrapper.vm.params).toEqual({})
    })

    it('should always reset to page 1 when terms are changed', () => {
      wrapper.setData({ page: 3 })
      wrapper.vm.searchTerms('sdf')
      expect(http.get).toHaveBeenNthCalledWith(2, '/beers', { params: { page: 1, beer_name: 'sdf' } })
      expect(wrapper.vm.page).toBe(1)
    })

    it('should trigger watcher when search data changes', async () => {
      const spyDebounce = jest.spyOn(wrapper.vm, 'debouncedSearchTerms')
      wrapper.setData({ search: 'lager' })
      await wrapper.vm.$nextTick()
      expect(spyDebounce).toHaveBeenCalled()
    })

    it('should change page and call to api when changePage method called', () => {
      wrapper.vm.changePage(1)
      expect(wrapper.vm.page).toBe(2)
      expect(http.get).toHaveBeenNthCalledWith(2, '/beers', { params: { page: 2 } })
    })

    it('shouldnt do anything when trying to navigate to page less than 1', () => {
      http.get.mockReset()
      wrapper.vm.changePage(-1)
      expect(wrapper.vm.page).toBe(1)
      expect(http.get).toHaveBeenCalledTimes(0)
    })

    it('list emitting events should trigger event functions', async () => {
      wrapper.setMethods({
        togglePaginator: jest.fn(),
        setFav: jest.fn(),
        triggerModal: jest.fn()
      })
      const list = wrapper.findComponent(BeerListComponent)

      await list.vm.$emit('hidePaginator')
      await list.vm.$emit('setFav')
      await list.vm.$emit('displayModal')

      expect(wrapper.vm.togglePaginator).toHaveBeenCalled()
      expect(wrapper.vm.setFav).toHaveBeenCalled()
      expect(wrapper.vm.triggerModal).toHaveBeenCalled()
    })
  })
})
