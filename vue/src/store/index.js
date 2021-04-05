import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router/index.js"

Vue.use(Vuex);

const apiBaseUrl = 'http://localhost:8080';

const getDefaultState = () => {
  return {
    token: '',
    user: {}
  };
};

export default new Vuex.Store({
  state: {
    mobiles: [],
    reviews: [],
    token: '',
    user: {},
    username: {}
  },

  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    }
  },

  mutations: {
    set_token: (state, token) => {
      state.token = token;
    },
    set_user: (state, user) => {
      state.user = user;
      console.log(state.user);
    },
    set_username: (state, username) => {
      state.username = username;
    },
    reset: state => {
      state.token = '';
      state.user = {};
      state.username = {}
    },

    set_mobiles: function (state, mobiles) {
      state.mobiles = mobiles;
    },

    set_reviews: function (state, reviews) {
      state.reviews = reviews;
    },

    add_mobile: function (state, mobile) {
      state.mobiles.push(mobile);
    },

    add_review: function (state, review) {
      state.reviews.push(review);
    },

    remove_mobile: function (state, id) {
      for (let m = 0; m < state.mobiles.length; m++) {
        if (state.mobiles[m].id === id) {
          state.mobiles.splice(m, 1);
          break;
        }
      }
    },

    update_mobile: function (state, payload) {
      for (let m = 0; m < state.mobiles.length; m++) {
        if (state.mobiles[m].id === parseInt(payload.id)) {
          state.mobiles[m].model = payload.mob.model;
          state.mobiles[m].producer = payload.mob.producer;
          break;
        }
      }
    },

    update_review: function (state, payload) {
      for (let m = 0; m < state.reviews.length; m++) {
        if (state.reviews[m].id === parseInt(payload.id)) {
          state.reviews[m].model = payload.review.ocena;
          break;
        }
      }
    }
  },

  actions: {
    login_user: function({ commit }, user) {
      fetch(apiBaseUrl + '/api/users/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('set_user', jsonData.id);
        commit('set_username', jsonData.username);
        commit('set_token', jsonData.token);
        router.push('/');
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    
    signup_user: function({ commit }, user) {
      
      fetch(apiBaseUrl + '/api/users/sign-up', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: user
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('set_user', jsonData.username);
        commit('set_token', jsonData.token);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    logout: function({ commit, state }) {
      const body =  JSON.stringify({
        token: state.token
      });
      
      fetch(apiBaseUrl + '/api/users/logout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('reset','');
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });      
    },

    load_mobiles: function ({ commit, state}) {
      fetch(apiBaseUrl + '/api/telefon', {
         method: 'get',
         headers: {
          'Authorization': state.token
        }
      }).then((response) => {
        if (!response.ok)
          throw response;
        
        return response.json()
      }).then((jsonData) => {
        commit('set_mobiles', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    load_reviews: function ({ commit, state }, idTelefona) {
      
      fetch(apiBaseUrl + `/api/ocena/${idTelefona}`, {
         method: 'get',
         headers: {
          'Authorization': state.token
        }
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('set_reviews', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_mobile: function({ commit, state }, id) {
      fetch(apiBaseUrl + `/api/telefon/${id}`, { 
        method: 'delete',
        headers: {
          'Authorization': state.token
        } 
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_mobile', jsonData.id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_mobile: function({ commit, state }, mobile) {
      console.log('new');
      console.log(state.token);
      console.log(state.user);
      fetch(apiBaseUrl + '/api/telefon', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': state.token
        },
        body: mobile
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_mobile', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_review: function({ commit, state }, review) {
      
      fetch(apiBaseUrl + '/api/ocena', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': state.token
        },
        body: review
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_review', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_mobile: function({ commit, state }, payload) {
      console.log('change');
      fetch(apiBaseUrl + `/api/telefon/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': state.token
        },
        body: payload.mob
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_mobile', {id: payload.id, mob:jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_review: function({ commit, state }, payload) {
      fetch(apiBaseUrl + `/api/ocena/${payload.id}/${payload.idTelefona}/${payload.user_id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': state.token
        },
        body: payload.ocena
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_review', {id: payload.id, review:jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }


  }
})
