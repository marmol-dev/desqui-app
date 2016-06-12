declare module 'array-find' {
  function find<E>(source: E[], it : (e: E, i: number, arr: E[]) => any) : E;
  export = find;
}
