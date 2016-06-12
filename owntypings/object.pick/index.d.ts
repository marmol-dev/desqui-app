declare module 'object.pick' {
  function pick<Source>(source: Source, props: string[]) : Source;
  export = pick;
}
