export async function checkLogin() {
  return fetch('/api/checkLogin', {
    method: 'GET',
  }).then((res) => res.json());
}
