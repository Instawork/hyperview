// NOTE(adam): Code originally taken from https://github.com/benhurott/tinymask

export default class TinyMask {

  private _options: any;
  private _handlers: any[];
  constructor(pattern: string | undefined | null, options?: any) {

    const defaultOptions = {
      translation: {
        9(val: string) {
          return val.replace(/[^0-9]+/g, '');
        },
        A(val: string) {
          return val.replace(/[^a-zA-Z]+/g, '');
        },
        S(val: string) {
          return val.replace(/[^a-zA-Z0-9]+/g, '');
        },
        '*': function (val: string) {
          return val;
        },
      },
      invalidValues: [null, undefined, ''],
    };

    const opt = options || {};
    this._options = {
      translation: Object.assign(defaultOptions.translation, opt.translation),
      invalidValues: Object.assign(
        defaultOptions.invalidValues,
        opt.invalidValues,
      ),
      pattern,
    };

    this._handlers = [];

    if (pattern !== null && pattern !== undefined) {
      for (let i = 0; i < pattern.length; i++) {
        const element = pattern[i];

        const result = this._options.translation[element] || element;
        this._handlers.push(result);
      }
    }
  }

  public mask(value: string): string | undefined {

    let result = '';

    const val = String(value);

    if (val.length === 0) {
      return undefined;
    }

    const maskSize = this._handlers.length;
    let maskResolved = 0;

    let valueResolved = 0;

    while (maskResolved < maskSize) {
      const hand = this._handlers[maskResolved];
      const char = val[valueResolved];

      if (char === undefined) {
        break;
      }

      if (char === hand) {
        result += char;
        maskResolved++;
        valueResolved++;
        continue;
      }

      if (this._isString(hand)) {
        result += hand;
        maskResolved++;
        continue;
      }

      const parsed = hand(char);

      if (this._options.invalidValues.indexOf(parsed) < 0) {
        result += parsed;
        valueResolved++;
      } else {
        break;
      }

      maskResolved++;
    }

    return result;
  }

  private _isString(value: any) {
    return typeof value === 'string';
  }
}
