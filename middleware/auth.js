export default function ({ app, redirect, store }) {
  if (!app.$cookiz.get('user')) {
    return redirect('/')
  } else {
    store.commit('User/setUser', app.$cookiz.get('user'))
  }
}
