declare module "lodash" {
  interface ILodash {
    // 1. 사용할 메소드 정의
    camelCase(str?: string): string;
    omit(data?: object, arr?: any): object;
    cloneDeep<T>(val: T, customizer?: (value: any) => any, thisArg?: any): T;
    uniq(data?: string[]): string[];
  }

  // 2. 타입(인터페이스)을 가지는 변수 선언
  const _: ILodash;

  // 3. 내보내기(CommonJS)
  export = _;
}
