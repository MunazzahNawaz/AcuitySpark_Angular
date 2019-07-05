export enum TargetFields {
 // MergeID = 'MergeID',
  CustomerNo = 'CustomerNo',
  FirstName = 'FirstName',
  LastName = 'LastName',
  Email = 'Email',
  ShippingAddress = 'ShippingAddress',
  Phone = 'Phone',
  Zip = 'Zip',
  Country = 'Country',
  City = 'City',
  State = 'State'
}
export class Customer {
  private static targetFields = [];
  public MergeID: number;
  public CustomerNo: number;
  public FirstName: string;
  public LastName: string;
  public Email: string;
  public AddressLine1: string;
  public Phone: string;
  public Zip: string;
  public County: string;
  public City: string;
  public StateCode: string;
  public CountryCode: string;

  constructor() {}
  public static getCustomerFields(): Array<string> {
    this.targetFields = [];
    console.log('Object.keys(TargetFields)', Object.keys(TargetFields));
    for (const key of Object.keys(TargetFields)) {
      this.targetFields.push(TargetFields[key]);
    }
    console.log('targetFields', this.targetFields);
    return this.targetFields;
  }
}


export interface CustomerSource {
  _source: Customer;
}
