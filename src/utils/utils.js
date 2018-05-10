export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }
 var menus = [{
   id: 2,
   path: "/home",
   component: "Home",
   name: "门店信息",
   iconCls: "el-icon-location-outline",
   children: [
     {
       id: null,
       path: "/shop/list",
       component: "Shop",
       name: "门店管理",
       iconCls: null,
       children: [],
       meta: {
         keepAlive: false,
         requireAuth: true
       }
     }
   ],
   meta: {
     keepAlive: false,
     requireAuth: true
   }
 }];
  var fmtRoutes = formatRoutes(menus);
  router.addRoutes(fmtRoutes);
  store.commit('initMenu', fmtRoutes);
}

export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Shop")) {
          require(['../components/shop/' + component + '.vue'], resolve)
        }
      },
      name: name,
      meta: meta,
      iconCls: iconCls,
      children:children
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}
