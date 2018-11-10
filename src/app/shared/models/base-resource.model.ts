export abstract class BaseResourceModel {
  id?: number;

  static fromJson<T>(this: { new(): T }, jsonData: any): T {
    return Object.assign(new this(), jsonData);
  }
}