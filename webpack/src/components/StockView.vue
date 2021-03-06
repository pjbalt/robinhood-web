<template>
  <div class='stock-view-container container-fluid'>
    <div v-if="quoteError" class="text-center">
      <h1 class="display-3 text-center text-danger">Oh Noes!</h1>
      <p class="lead text-center text-danger">Our robots could not find any data about {{symbol}} :(</p>
    </div>
    <div v-if="loaded" class='stock-view'>
      <div class="row">
        <div class="col-md-9">
          <h3 v-if="quote">{{instrument.name}}</h3>
        </div>
        <div class="col-md-3">
          <div class="pull-right" v-if="quote">
            <button v-if="currentPosition && !isBuying" v-on:click="isBuying = true; buySide = 'buy'" class="btn btn-green">Buy More</button>
            <button v-if="currentPosition && !isBuying" v-on:click="isBuying = true;  buySide = 'sell'" class="btn btn-warning">Sell</button>
            <button v-if="!currentPosition && !isBuying" v-on:click="isBuying = true; buySide = 'buy'" class="btn btn-green">Buy</button>
            <!--<button class="btn btn-primary">Watch</button>-->
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <new-order v-if="isBuying" v-on:orderComplete="orderComplete" v-on:cancelOrder="isBuying = false" :symbol="symbol" :buySide="buySide"></new-order>
      <div id="tv-medium-widget" v-if="!quoteError">Loading....</div>
      <div v-if="currentPosition" class="table-responsive">
        <div class='clear'>&nbsp;</div>
        <h3>Current Position</h3>
        <position-table>
          <position slot="position-table-body" :row="currentPosition"></position>
        </position-table>
      </div>
      <div v-if="hasNews" class="table-responsive">
        <h3 v-if="quote">Recent news for {{instrument.name}}</h3>
        <table class="table table-condensed">
          <thead>
          </thead>
          <tbody>
            <tr v-for="item in news.results">
              <td><a v-bind:href="item.url" target="_blank">{{item.title}}</a></td>
              <td v-from-now="item.published_at"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import NewOrder from '@/components/NewOrder';
import Position from '@/components/Positions/Position';
import PositionTable from '@/components/Positions/PositionTable';
import state from '@/state';
import '@/assets/js/tv.js'; //TradingView

export default {
  created() {
    var self = this;

    (async () => {
      try{
        await state.dispatch('robinhood/getQuote', this.symbol);
      }catch(e){
        self.quoteError = true;
      }
    })();


    state.dispatch('robinhood/getNews', this.symbol);
    state.dispatch('robinhood/getPositions');
  },
  data() {
    return {
      loaded: false,
      hasNews: true,
      isBuying: false,
      buySide: 'buy',
      quoteError: false
    }
  },
  computed: {
    symbol() {
      return this.$route.params.symbol;
    },
    quote() {
      return state.getters['robinhood/quote'](this.symbol);
    },
    news() {
      return state.getters['robinhood/news'](this.symbol);
    },
    positions() {
      return state.getters['robinhood/positions'];
    },
    currentPosition() {
      var self = this;

      return this.positions.find(position => {
        let instrument = state.getters['robinhood/instrument'](position.instrument);

        return instrument.symbol == this.symbol
      });
    },
    instrument(){
      if(!this.quote){
        return;
      }

      return state.getters['robinhood/instrument'](this.quote.instrument);
    }
  },
  watch: {
    symbol(){
      var self = this;

      self.quoteError = false;

      (async () => {
        try{
          await state.dispatch('robinhood/getQuote', this.symbol);
        }catch(e){
          self.quoteError = true;
        }
      })();

      this.isBuying = false;

      state.dispatch('robinhood/getNews', this.symbol);
      state.dispatch('robinhood/getPositions');
    },
    quote() {
      this.loaded = true;
    },
    news(newsItem) {
      if(typeof newsItem === 'undefined'){
        this.hasNews = false;

        return;
      }

      if ('results' in newsItem && newsItem.results.length > 0) {
        this.hasNews = true;
      } else {
        this.hasNews = false;
      }
    }
  },
  methods: {
    orderComplete(){
      setTimeout(() => this.isBuying = false, 5000);
    }
  },
  updated() {
    var self = this;

    if(!this.quote)
      return;

    $(document).ready(function() {
      if ($("#tv-medium-widget").is(":visible")) {
        new TradingView.MediumWidget({
          "container_id": "tv-medium-widget",
          "symbols": [
            self.symbol
          ],
          "gridLineColor": "#e9e9ea",
          "fontColor": "#83888D",
          "theme": "Black",
          "style": 1,
          "toolbar_bg": "#000000",
          "underLineColor": "#21ce99",
          "trendLineColor": "#4bafe9",
          "width": "100%",
          "height": 400,
          "locale": "en"
        });
      }
    });
  },

  components: {
    'position': Position,
    'position-table': PositionTable,
    'new-order': NewOrder
  }
}
</script>
