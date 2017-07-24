import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  loggedIn: false,
  loginStateChecked: false,
  userData: null,
  positions: [],
  nextPosition: null,
  previousPosition: null,
  quotes: [],
  resources: [],
  recentOrders: [],
  nextOrder: null,
  previousOrder: null,
  accounts: [],
  account: null
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  /*User state data*/
  setLoginState: function(state, loginState){
    state.loggedIn = loginState;
  },

  setLoginStateChecked: function(state, loginStateChecked){
    state.loginStateChecked = loginStateChecked;
  },

  setUserData: function(state, userData){
    state.userData = userData;
  },

  setPositions: function(state, positions){
    state.positions = positions;
  },

  setNextPosition: function(state, position){
    state.nextPosition = position;
  },

  setPrevousPosition: function(state, position){
    state.previousPosition = position;
  },

  setQuotes: function(state, quotes){
    state.quotes = quotes;
  },
  
  addQuote: function(state, quote){
    state.quotes.push(quote);
  },

  addResource: function(state, resource){
    let existingResource = state.resources.find(function(r){
      return r.url == resource.url;
    });

    if(typeof existingResource !== 'undefined'){
      return;
    }

    state.resources.push(resource);
  },

  setNextOrder: function(state, order){
    state.nextOrder = order;
  },

  setPreviousOrder: function(state, order){
    state.previousOrder = order;
  },

  setRecentOrders: function(state, recentOrders){
    state.recentOrders = recentOrders;
  },

  setAccount: function(state, account){
    state.account = account.account_number;
  },

  setAccounts: function(state, accounts){
    if(state.account === null && accounts.length > 0)
      state.account = accounts[0].account_number;

    state.accounts = accounts;
  }
}


// getters are functions
const getters = {
  loggedIn: function(){
    return state.loggedIn;
  },

  loginStateChecked: function(){
    return state.loginStateChecked;
  },

  userData: function(){
    return state.userData
  },

  positions: function(){
    return state.positions;
  },

  nextPosition: function(){
    return state.nextPosition;
  },

  previousPosition: function(){
    return state.previousPosition;
  },

  quotes: function(){
    return state.quotes;
  },

  quote: function(){
    return symbol => state.quotes.find(item => {
      return item.symbol == symbol;
    });
  },

  resource: function(){
    return url => state.resources.find(resource => {
      return resource.url == url;
    });
  },

  nextOrder: function(){
    return state.nextOrder;
  },

  previousOrder: function(){
    return state.previousOrder;
  },

  recentOrders: function(){
    return state.recentOrders;
  },

  accounts: function(){
    return state.accounts;
  },

  account: function(){
    return accountId => state.accounts.find(account => {
      return account.account_number == accountId;
    });
  },

  currentAccount: function(){
    return state.accounts.find(account => {
      return account.account_number == state.account;
    });
  }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  mutations
})