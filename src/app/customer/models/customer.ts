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

  customerNo = 'customerNo',
  firstName = 'firstName',
  middleName = 'middleName',
  lastName = 'lastName',
  email = 'email',
  phone = 'phone',
  address = 'address',
  zipCode = 'zipCode',
  city = 'city',
  state = 'state',
  country = 'country',
  cellPhone = 'cellPhone',
  householdNum = 'householdNum',
  birthdayMonth = 'birthdayMonth',
  income = 'income',
  race = 'race',
  ethnicity = 'ethnicity',
  maritalStatus = 'maritalStatus',
  gender = 'gender',
  numOfChildren = 'numOfChildren',
  countryOfOrigin = 'countryOfOrigin',
  education = 'education',
  languagePreference = 'languagePreference',
  phoneType = 'phoneType',
  faxNo = 'faxNo',
  okToEmailInd = 'okToEmailInd',
  okToMailInd = 'okToMailInd',
  okToPhoneInd = 'okToPhoneInd',
  doNotPromoteInd = 'doNotPromoteInd',
  addressReliableInd = 'addressReliableInd',
  sMSInd = 'sMSInd',
  activeInd = 'activeInd',
  organizationName = 'organizationName',
  customerType = 'customerType',
  sourceSystem = 'sourceSystem',
  regularInd = 'regularInd',
  mailOrderBuyerInd = 'mailOrderBuyerInd',
  mailOrderResponderInd = 'mailOrderResponderInd',
  mobPurchasingInd = 'mobPurchasingInd',
  ecomCustomerInd = 'ecomCustomerInd',
  goldPremiumInd = 'goldPremiumInd',
  callIndDateOfBirth = 'callIndDateOfBirth',
  guestCustomerInd = 'guestCustomerInd',
  promoTableInd = 'promoTableInd',
  loyaltyCardName = 'loyaltyCardName',
  loyaltyCardType = 'loyaltyCardType',
  loyaltyCardSignUpDate = 'loyaltyCardSignUpDate',
  customerBillingName = 'customerBillingName',
  custBillAddressLine1 = 'custBillAddressLine1',
  custBillAddressLine2 = 'custBillAddressLine2',
  custBillZipCode = 'custBillZipCode',
  custBillCity = 'custBillCity',
  custBillState = 'custBillState',
  custBillCountry = 'custBillCountry',
  custBillPhoneType = 'custBillPhoneType',
  custBillPhoneNumber = 'custBillPhoneNumber',
  custBillCellNumber = 'custBillCellNumber',
  custBillEmailInd = 'custBillEmailInd',
  custBillEmailAddress = 'custBillEmailAddress',
  custBillFaxNo = 'custBillFaxNo',
  custBillLongitude = 'custBillLongitude',
  custBillLatitude = 'custBillLatitude',
  homeAssessedValue = 'homeAssessedValue',
  homeMarketValue = 'homeMarketValue',
  homeOwnerValue = 'homeOwnerValue',
  homeValuePremier = 'homeValuePremier',
  srcCreatedDate = 'srcCreatedDate',
  srcModifiedDate = 'srcModifiedDate',
  loadDate = 'loadDate',
  effectiveDate = 'effectiveDate',
  terminationDate = 'terminationDate'
}
export enum GoldenCustomerFields {
  FirstName = 'FirstName',
  LastName = 'LastName',
  Email = 'Email',
  Phone = 'Phone',
  Address = 'Address'
}
export enum GoldenCustomerDetailFields {
  FirstName = 'FirstName',
  MiddleName = 'MiddleName',
  LastName = 'LastName',
  Email = 'Email',
  Phone = 'Phone',
  Address = 'Address ',
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
  OrganizationName = 'OrganizationName',
  CustomerType = 'CustomerType',
  SourceSystem = 'SourceSystem',
  EcomCustomerInd = 'EcomCustomerInd',
  GoldPremiumInd = 'GoldPremiumInd'
}
export enum PersonalInfoFields {
  FirstName = 'FirstName',
  MiddleName = 'MiddleName',
  LastName = 'LastName',
  Gender = 'Gender',
  MaritalStatus = 'MaritalStatus',
  BirthdayMonth = 'BirthdayMonth',
  Education = 'Education',
  OrganizationName = 'OrganizationName',
  MonthlyIncome = 'Monthly Income',
  Race = 'Race',
  Ethnicity = 'Ethnicity',
  NumOfChildren = 'NumOfChildren'
}
export enum ContactInfoFields {
  Email = 'Email',
  Phone = 'Phone',
  Address = 'Address ',
  CountryOfOrigin = 'CountryOfOrigin',
  PhoneType = 'PhoneType',
  FaxNo = 'FaxNo',
  OkToEmailInd = 'OkToEmailInd',
  OkToMailInd = 'OkToMailInd',
  OkToPhoneInd = 'OkToPhoneInd',
  AddressReliableInd = 'AddressReliableInd',
  SMSInd = 'SMSInd'
}
export enum OtherFields {
  DoNotPromoteInd = 'DoNotPromoteInd',
  CustomerType = 'CustomerType',
  SourceSystem = 'SourceSystem',
  EcomCustomerInd = 'EcomCustomerInd',
  GoldPremiumInd = 'GoldPremiumInd'
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
  public static getEnumFields(enumType: Object): Array<string> {
    let targetFields = [];
    for (const key of Object.keys(enumType)) {
      targetFields.push(enumType[key]);
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
  // public static getGoldenCustomerFields(): Array<string> {
  //   let targetFields = [];
  //   for (const key of Object.keys(GoldenCustomerFields)) {
  //     targetFields.push(GoldenCustomerFields[key]);
  //   }
  //   return targetFields;
  // }
  // public static getGoldenCustomerFields(): Array<string> {
  //   let targetFields = [];
  //   for (const key of Object.keys(GoldenCustomerFields)) {
  //     targetFields.push(GoldenCustomerFields[key]);
  //   }
  //   return targetFields;
  // }
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
  public static getGoldenCustomerDetailFields(): Array<string> {
    let targetFields = [];
    for (const key of Object.keys(GoldenCustomerDetailFields)) {
      targetFields.push(GoldenCustomerDetailFields[key]);
    }
    return targetFields;
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
