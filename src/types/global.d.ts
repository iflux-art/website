declare module 'lodash/throttle' {
  const throttle: <T extends (this: any, ...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean }
  ) => T & { cancel(): void; flush(): void };
  export default throttle;
}

declare module 'lodash/debounce' {
  const debounce: <T extends (this: any, ...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean; maxWait?: number }
  ) => T & { cancel(): void; flush(): void };
  export default debounce;
}
