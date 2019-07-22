export class Helper {
  // function for dynamic sorting
  public static compareValues(key, order = 'asc') {
    return (a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == 'desc' ? comparison * -1 : comparison;
    };
  }
  public static formatPhoneNumber_withBrackets(phoneNumberString) {
    let newPh = '';
    const index = phoneNumberString.indexOf('+1');
    if (index >= 0) {
      phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
    }
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '').replace('/(/g','').replace('/)/g','').replace('/+/g','').replace('/-/g','');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
    if (match) {
      newPh = '(' + match[1] + ') ' + match[2] + ' ' + match[3];
    }
    return newPh;
  }
  public static formatPhoneNumber_withHyphen(phoneNumberString) {
    const index = phoneNumberString.indexOf('+1');
    if (index >= 0) {
      phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
    }
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '').replace('/(/g','').replace('/)/g','').replace('/+/g','').replace('/-/g','');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return null;
  }
  public static formatPhoneNumber_withSpace(phoneNumberString) {
    const index = phoneNumberString.indexOf('+1');
    if (index >= 0) {
      phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
    }
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '').replace('/(/g','').replace('/)/g','').replace('/+/g','').replace('/-/g','');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
    if (match) {
      return match[1] + ' ' + match[2] + match[3];
    }
    return null;
  }
  public static getRandomNumber(min, max) {
    return Math.floor((Math.random() * max) + min);
  }
}
