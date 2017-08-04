module.exports = {
  async getPositions(req, res){
    try{
      let resource = req.param('resource', null);

      let rh = new RobinHood(req.session.user.user_id);
      await rh.connect();

      return res.json({err: null, result: await rh.getPositions(resource)});
    }catch(e){
      return res.json({err: e.toString(), result: null});
    }
  },

  async getRecentOrders(req, res){
    try{
      let resource = req.param('resource', null);

      let rh = new RobinHood(req.session.user.user_id);
      await rh.connect();

      return res.json({err: null, result: await rh.getRecentOrders(resource)});
    }catch(e){
      return res.json({err: e.toString(), result: null});
    }
  },

  async getAccounts(req, res){
    try{
      let rh = new RobinHood(req.session.user.user_id);
      await rh.connect();

      return res.json({err: null, result: await rh.getAccounts()})
    }catch(e){
      return res.json({err: e.toString(), result: null});
    }
  },

  async getResource(req, res){
    try{
      let rh = new RobinHood(req.session.user.user_id);
      await rh.connect();

      return res.json({err: null, result: await rh.getResource(req.param('resource'))});
    }catch(e){
      return res.json({err: e.toString(), result: null});
    }
  }
}
