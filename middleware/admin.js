export default function ({ redirect, store }) {
  if (
    !store.getters['User/permissions'].admin.includes(
      store.getters['User/user'].type
    )
  ) {
    return redirect('/logout')
  }
}
