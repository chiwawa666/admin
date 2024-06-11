import { login, logout, getInfo, reLogin } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, removeUserId } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'

const CryptoJS = require('@/vendor/crypto-js.js')
import { sm2Encrypt } from '@/vendor/sm2.js'




const pubKeyHex =
  "3059301306072a8648ce3d020106082a811ccf5501822d034200044f6cf54df3602a58fd277aa173505b55fab753466e0a85dddd601ba32e1c2d0487ebfae0d20ded1edebc443094291bc060d75e822f0369b71727743aa80c6104";


const state = {
  token: getToken(),
  userid: 0,
  name: '',
  avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password, grant_type, captchaVerification } = userInfo
    return new Promise((resolve, reject) => {
      const newpassword = sm2Encrypt(password, pubKeyHex, 0);
      login({
        name: username.trim(),
        password: newpassword, grant_type: grant_type, captchaVerification: captchaVerification
      }).then(async response => {

        const { token } = JSON.parse(response.result)
        const { id, userName, role_name } = JSON.parse(response.result).user

        // const { data } = response
        // 设置 Cookie ，对页面刷新可能丢失的数据进行保存
        Cookies.set('roles', JSON.stringify(role_name));
        Cookies.set('userid', id);
        Cookies.set('token', token);
        Cookies.set('username', userName);

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', role_name, { root: true })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        commit('SET_USERID', id)
        commit('SET_NAME', userName)
        commit('SET_ROLES', role_name)
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      // const { data } = response

      // if (!data) {
      //   reject('Verification failed, please Login again.')
      // }

      // const { roles, name, avatar, introduction } = data
      const roles = Cookies.get('roles')
      const name = Cookies.get('username')
      const token = Cookies.get('token')
      const userid = Cookies.get('userid')


      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_TOKEN', token)
      commit('SET_USERID', userid)
      const data = {
        roles: roles,
        name: name,
        token: token,
        userid: userid
      }
      resolve(data)
    }).catch(error => {
      reject(error)
    })
    // })
  },
  reLogin({ commit, state }) {
    // const { token, grant_type, } = userInfo
    return new Promise((resolve, reject) => {
      reLogin({
        grant_type: 'refrsh_token',
        token: state.token
      }).then(response => {
        console.log('response', response);
        const { token } = JSON.parse(response.result)
        commit('SET_TOKEN', token)
        setToken(token)
        console.log('登陆成功');
        resolve()
      }).catch(error => {
        console.log('需要重新登陆');
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        // commit('SET_TOKEN', false
        Message({
          message: '登录时间过长，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        removeToken()
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },


  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
