export function getUrlParams(search: string) {
  return search
    .substring(1)
    .split('&')
    .reduce(
      (sum, it) => {
        const [key, val = ''] = it.split('=');
        sum[key] = val;
        return sum;
      },
      {} as { [key: string]: string }
    );
}
