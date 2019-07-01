import { AppConfigService } from 'src/app/app-config.service';

export class Query {
  public static getAllDocsQuery(threshHoldValue) {
    let queryalldocs = {
      query: {
        match_all: {}
      },
      from: 0,
      size: threshHoldValue,
      sort: [
        {
          CustomerNo: {
            order: 'asc'
          }
        }
      ]
    };
    return queryalldocs;
  }
  public static getSortQuery(fieldName, direction, threshHoldValue) {
    let sortQuery =
      `{
      "query": {
        "match_all": {}
      },
      "from": 0,
      "size": ` +
      threshHoldValue+
      `,
      "sort": [
        {
          "` +
      fieldName +
      `": {
            "order": "` +
      direction +
      `"
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
          "` +
      fieldName +
      `": "` +
      value +
      `"
        }
      }
    }`;
    console.log('filter query', filterQuery);
    return filterQuery;
  }
}
