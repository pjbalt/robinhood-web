import state from '@/state';

export default {
   getPositions(){
      $.post('/api/getPositions?nonzero=true', function(data){
         state.commit('setNextPosition', data.result.next);
         state.commit('setPrevousPosition', data.result.previous);
         state.commit('setPositions', data.result.results);
      });
   },

   getQuote(symbol, cb){
      $.post('/api/getQuote', {symbol: symbol}, function(data){
         return cb(data);
      });
   },

   getResource(url, cb){
      $.post('/api/getResource', {url: url}, function(data){
         return cb(data);
      });
   }
}