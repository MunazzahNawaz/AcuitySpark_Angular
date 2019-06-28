import { AppConfig } from 'src/app/app-config';

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
  public static getFilterQuery(fieldName, value) {
    let filterQuery =
      `{"query": {
        "match": {
          "`+ fieldName +`": "`+ value+`"
        }
      }
    }`;
    console.log('filter query', filterQuery);
    return filterQuery;
  }
}
