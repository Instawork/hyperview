// NOTE(adam): Code originally taken from https://github.com/benhurott/tinymask

export default function TinyMask(pattern: any, options: any) {
  const defaultOptions = {
    translation: {
      9(val) {
        return val.replace(/[^0-9]+/g, '');
      },
      A(val) {
        return val.replace(/[^a-zA-Z]+/g, '');
      },
      S(val) {
        return val.replace(/[^a-zA-Z0-9]+/g, '');
      },
      '*': function (val) {
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

  for (let i = 0; i < pattern.length; i++) {
    const element = pattern[i];

    const result = this._options.translation[element] || element;
    this._handlers.push(result);
  }
}

TinyMask.prototype._isString = function (value: any) {
  return typeof value === 'string';
};

TinyMask.prototype.mask = function (value: any) {
  let result = '';

  const val = String(value);

  if (val.length === 0) {
    return;
  }

  const maskSize = this._handlers.length;
  let maskResolved = 0;

  const valueSize = val.length;
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
};
