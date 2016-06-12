declare module 'array-findindex' {
  function find<E>(source: E[], it : (e: E, i: number, arr: E[]) => any) : number;
  export = find;
}
