import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}

export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("/user/menu").then(resp=> {
    if (resp && resp.status == 200) {
      var fmtRoutes = formatRoutes(resp.data.data);
      router.addRoutes(fmtRoutes);
      store.commit('initMenu', fmtRoutes);
    }
  })
}

export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=>{
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
        }else if (component.startsWith("Role")) {
          require(['../components/role/' + component + '.vue'], resolve)
        }else if (component.startsWith("User")) {
          require(['../components/user/' + component + '.vue'], resolve)
        }else if (component.startsWith("Invoic")) {
          require(['../components/invoic/' + component + '.vue'], resolve)
        } else if (component.startsWith("Proxy")) {
          require(['../components/proxy/' + component + '.vue'], resolve)
        }else if (component.startsWith("Voucher")) {
          require(['../components/voucher/' + component + '.vue'], resolve)
        }else if (component.startsWith("Channel")) {
          require(['../components/channel/' + component + '.vue'], resolve)
        }else if (component.startsWith("Item")) {
          require(['../components/item/' + component + '.vue'], resolve)
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
