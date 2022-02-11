export default function ({ app, redirect }) {
  if (app.$cookiz.get('user')) {
    return redirect('/ExamsManager')
  }
}
