import { AppConfig } from './appConfig';

export class Query {
  public static queryalldocs = {
    query: {
      match_all: {}
    },
    from: 0,
    size: AppConfig.threshHold,
    sort: [
      {
        "CustomerNo": {
          "order": "asc"
        }
      }
    ]
  };
  public static getSortQuery(fieldName, direction) {
    // direction = 'desc';
    let sortQuery =
      `{
      "query": {
        "match_all": {}
      },
      "from": 0,
      "size": ` +
      AppConfig.threshHold +
      `,
      "sort": [
        {
          "` +
      fieldName +
      `": {
            "order": "`+ direction +`"
          }
        }
      ]
    }`;
    console.log('query', sortQuery);
    return sortQuery;
  }
}
