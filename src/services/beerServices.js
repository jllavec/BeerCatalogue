import http from '../http'

export default class BeerService {
  static getBeerList (params = {}) {
    return http.get('/beers', {
      params
    })
  }
}
