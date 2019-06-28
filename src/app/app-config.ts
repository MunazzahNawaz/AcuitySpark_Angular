import { environment } from '../environments/environment';

export class AppConfig {
    // CommerceLink EndPoints
    public static elastricSearchUrl = environment.elasticSearchBaseUrl;
    public static elasticSearchIndex = 'custdata-10k';
    public static elasticSearchType = 'cust';
    public static threshHold = 1000;
    public static defaultSortColumn = 'CustomerNo';
    public static defaultUsername = 'admin';
    public static defaultPswd = 'admin';
}
