export interface ICountKeys {
    [id: string] : IKeys
}
export interface IKeys {
    countRowsEffected: number;
    keys: Array<string>;
}