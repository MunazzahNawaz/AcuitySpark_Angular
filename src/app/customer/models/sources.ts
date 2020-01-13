export class Source {
  public Icon: string;
  public Title: string;
  public Name: string;
  public Type: SourceTypes;
}
export enum SourceTypes {
  File = 1,
  Database = 2,
  OnlineServices = 3,
  Others = 4
}
export class ImportSources {
  public static sources: Array<Source> = [
    {
      Icon: '../../../assets/images/source-icons/Excel.svg',
      Title: 'Excel',
      Name: 'Excel',
      Type: SourceTypes.File
    },
    {
      Icon: '../../../assets/images/csv-src.svg',
      Title: 'TSV/CSV',
      Name: 'CSV',
      Type: SourceTypes.File
    },
    {
      Icon: '../../../assets/images/xml.svg',
      Title: 'XML',
      Name: 'XML',
      Type: SourceTypes.File
    },
    {
      Icon: '../../../assets/images/json.svg',
      Title: 'JSON',
      Name: 'JSON',
      Type: SourceTypes.File
    },
    {
      Icon: '../../../assets/images/source-icons/Dynamic365.svg',
      Title: 'Dynamics 365',
      Name: 'Dynamics',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/source-icons/Salesforce.svg',
      Title: 'Salesforce',
      Name: 'SalesForce',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/sql-server.svg',
      Title: 'Azure SQL Database',
      Name: 'AzureSQLDatabase',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/source-icons/Azure-SQL-Database.svg',
      Title: 'Azure SQL Data Warehouse',
      Name: 'AzureSQLDataWarehouse',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/source-icons/Azure-Data-Lake.svg',
      Title: 'Azure Data Lake Store',
      Name: 'AzureDataLake',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/source-icons/hdinsight.svg',
      Title: 'Azure HDInsight',
      Name: 'AzureHDInsight',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/sharepoint.svg',
      Title: 'SharePoint List',
      Name: 'SharePoint',
      Type: SourceTypes.OnlineServices
    },
    {
      Icon: '../../../assets/images/sql-server.svg',
      Title: 'SQL Server Database',
      Name: 'SqlServer',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/MSAccess.svg',
      Title: 'Access Database',
      Name: 'Access',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/sql-server.svg',
      Title: 'SQL Sever Analysis Services Database',
      Name: 'SSAS',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/Oracle.svg',
      Title: 'Oracle Database',
      Name: 'Oracle',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/IBM-DB2.svg',
      Title: 'IBM DB2 Database',
      Name: 'IBMDB2',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/sybase.svg',
      Title: 'Sybase Database',
      Name: 'Sybase',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/MariaDB.svg',
      Title: 'MariaDB Database',
      Name: 'MariaDB',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/sybase.svg',
      Title: 'MySQL Database',
      Name: 'MySQL',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/Teradata-database.svg',
      Title: 'Teradata Database',
      Name: 'Teradata',
      Type: SourceTypes.Database
    },
    {
      Icon: '../../../assets/images/source-icons/SAP.svg',
      Title: 'SAP HANA Database',
      Name: 'SAPHANA',
      Type: SourceTypes.Database
    },

    {
      Icon: '../../../assets/images/source-icons/odata.svg',
      Title: 'OData Feed',
      Name: 'OData',
      Type: SourceTypes.Others
    },
    {
      Icon: '../../../assets/images/source-icons/hdfs.svg',
      Title: 'HDFS',
      Name: 'HDFS',
      Type: SourceTypes.Others
    },
    {
      Icon: '../../../assets/images/source-icons/apache-spark.svg',
      Title: 'Spark',
      Name: 'Spark',
      Type: SourceTypes.Others
    },
    {
      Icon: '../../../assets/images/source-icons/active-directory.svg',
      Title: 'Active Directory',
      Name: 'AD',
      Type: SourceTypes.Others
    },
    {
      Icon: '../../../assets/images/source-icons/odbc.svg',
      Title: 'ODBC',
      Name: 'ODBC',
      Type: SourceTypes.Others
    }
  ];

  public static getSources() {
    return this.sources;
  }
}
