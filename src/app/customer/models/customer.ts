import { GoldenFieldValueType } from './rule';
import { FieldType, Editors } from 'angular-slickgrid';

export enum TargetFields {
  // MergeID = 'MergeID',
  // CustomerNo = 'CustomerNo',
  // FirstName = 'FirstName',
  // LastName = 'LastName',
  // Email = 'Email',
  // Phone = 'Phone',
  // ShippingAddress = 'ShippingAddress',
  // City = 'City',
  // State = 'State',
  // Zip = 'Zip',
  // Country = 'Country'

  CustomerNo = 'CustomerNo',
  FirstName = 'FirstName',
  MiddleName = 'MiddleName',
  LastName = 'LastName',
  Email = 'Email',
  Phone = 'Phone',
  Address = 'Address',
  ZipCode = 'ZipCode',
  City = 'City',
  State = 'State',
  Country = 'Country',
  CellPhone = 'CellPhone',
  HouseholdNum = 'HouseholdNum',
  BirthdayMonth = 'BirthdayMonth',
  Income = 'Income',
  Race = 'Race',
  Ethnicity = 'Ethnicity',
  MaritalStatus = 'MaritalStatus',
  Gender = 'Gender',
  NumOfChildren = 'NumOfChildren',
  CountryOfOrigin = 'CountryOfOrigin',
  Education = 'Education',
  LanguagePreference = 'LanguagePreference',
  PhoneType = 'PhoneType',
  FaxNo = 'FaxNo',
  OkToEmailInd = 'OkToEmailInd',
  OkToMailInd = 'OkToMailInd',
  OkToPhoneInd = 'OkToPhoneInd',
  DoNotPromoteInd = 'DoNotPromoteInd',
  AddressReliableInd = 'AddressReliableInd',
  SMSInd = 'SMSInd',
  ActiveInd = 'ActiveInd',
  OrganizationName = 'OrganizationName',
  CustomerType = 'CustomerType',
  SourceSystem = 'SourceSystem',
  RegularInd = 'RegularInd',
  MailOrderBuyerInd = 'MailOrderBuyerInd',
  MailOrderResponderInd = 'MailOrderResponderInd',
  MobPurchasingInd = 'MobPurchasingInd',
  EcomCustomerInd = 'EcomCustomerInd',
  GoldPremiumInd = 'GoldPremiumInd',
  CallIndDateOfBirth = 'CallIndDateOfBirth',
  GuestCustomerInd = 'GuestCustomerInd',
  PromoTableInd = 'PromoTableInd',
  LoyaltyCardName = 'LoyaltyCardName',
  LoyaltyCardType = 'LoyaltyCardType',
  LoyaltyCardSignUpDate = 'LoyaltyCardSignUpDate',
  CustomerBillingName = 'CustomerBillingName',
  CustBillAddressLine1 = 'CustBillAddressLine1',
  CustBillAddressLine2 = 'CustBillAddressLine2',
  CustBillZipCode = 'CustBillZipCode',
  CustBillCity = 'CustBillCity',
  CustBillState = 'CustBillState',
  CustBillCountry = 'CustBillCountry',
  CustBillPhoneType = 'CustBillPhoneType',
  CustBillPhoneNumber = 'CustBillPhoneNumber',
  CustBillCellNumber = 'CustBillCellNumber',
  CustBillEmailInd = 'CustBillEmailInd',
  CustBillEmailAddress = 'CustBillEmailAddress',
  CustBillFaxNo = 'CustBillFaxNo',
  CustBillLongitude = 'CustBillLongitude',
  CustBillLatitude = 'CustBillLatitude',
  HomeAssessedValue = 'HomeAssessedValue',
  HomeMarketValue = 'HomeMarketValue',
  HomeOwnerValue = 'HomeOwnerValue',
  HomeValuePremier = 'HomeValuePremier',
  SrcCreatedDate = 'SrcCreatedDate',
  SrcModifiedDate = 'SrcModifiedDate',
  LoadDate = 'LoadDate',
  EffectiveDate = 'EffectiveDate',
  TerminationDate = 'TerminationDate'
}
export enum GoldenCustomerFields {
  FirstName = 'FirstName',
  LastName = 'LastName',
  Email = 'Email',
  Phone = 'Phone',
  Address = 'Address'
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
  public Country: string;
  public City: string;
  public StateCode: string;
  public CountryCode: string;

  constructor() {}
  public static getCustomerFields(): Array<string> {
    let targetFields = [];
    //    console.log('Object.keys(TargetFields)', Object.keys(TargetFields));
    for (const key of Object.keys(TargetFields)) {
      targetFields.push(TargetFields[key]);
    }
    // console.log('targetFields', targetFields);
    return targetFields;
  }
  public static getGoldenCustomerFields(): Array<string> {
    let targetFields = [];
    for (const key of Object.keys(GoldenCustomerFields)) {
      targetFields.push(GoldenCustomerFields[key]);
    }
    return targetFields;
  }

  public static getGoldenFieldValueType(): Array<string> {
    let fields = [];
    console.log('GoldenFieldValueType', Object.keys(GoldenFieldValueType));
    for (const key of Object.keys(GoldenFieldValueType)) {
      if (!Number.isNaN(parseInt(key, 10))) {
        // key of enum cannot be number
        fields.push(GoldenFieldValueType[key]);
      }
    }
    return fields;
  }
  public static getColumns() {
    let colDef = [];
    let targetFields = this.getCustomerFields();
    targetFields.forEach(col => {
      colDef.push({
        id: col,
        name: col,
        field: col,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
        minWidth: 150
      });
    });

    // colDef.push({
    //   id: targetFields[0],
    //   name: 'Customer No',
    //   field: targetFields[0],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 105
    // });
    // colDef.push({
    //   id: targetFields[1],
    //   name: 'First Name',
    //   field: targetFields[1],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 110
    // });
    // colDef.push({
    //   id: targetFields[2],
    //   name: 'Last Name',
    //   field: targetFields[2],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 110
    // });
    // colDef.push({
    //   id: targetFields[3],
    //   name: 'Email',
    //   field: targetFields[3],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 190
    // });
    // colDef.push({
    //   id: targetFields[4],
    //   name: 'Phone',
    //   field: targetFields[4],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 100
    // });
    // colDef.push({
    //   id: targetFields[5],
    //   name: 'Shipping Address',
    //   field: targetFields[5],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 180
    // });
    // colDef.push({
    //   id: targetFields[6],
    //   name: 'City',
    //   field: targetFields[6],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 120
    // });
    // colDef.push({
    //   id: targetFields[7],
    //   name: 'State',
    //   field: targetFields[7],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 80
    // });
    // colDef.push({
    //   id: targetFields[8],
    //   name: 'Zip',
    //   field: targetFields[8],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 60
    // });
    // colDef.push({
    //   id: targetFields[9],
    //   name: 'Country',
    //   field: targetFields[9],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 80
    // });
    return colDef;
  }
}

export interface CustomerSource {
  _source: Customer;
}
