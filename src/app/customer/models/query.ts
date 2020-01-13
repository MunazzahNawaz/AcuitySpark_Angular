import { AppConfigService } from 'src/app/app-config.service';

export class Query {
  public static getAllDocsQuery(threshHoldValue) {
    const queryalldocs = {
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
    const sortQuery =
      `{
      "query": {
        "match_all": {}
      },
      "from": 0,
      "size": ` +
      threshHoldValue +
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
    return sortQuery;
  }
  public static getFilterQuery(fieldName, value) {
    const filterQuery =
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
    return filterQuery;
  }
}
