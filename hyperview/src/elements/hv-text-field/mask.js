// NOTE(adam): Code originally taken from https://github.com/benhurott/tinymask

export default function TinyMask(pattern, options) {
	var defaultOptions = {
		translation: {
			'9': function (val) {
				return val.replace(/[^0-9]+/g, '');
			},
			'A': function (val) {
				return val.replace(/[^a-zA-Z]+/g, '');
			},
			'S': function (val) {
				return val.replace(/[^a-zA-Z0-9]+/g, '');
			},
			'*': function (val) {
				return val;
			}
		},
		invalidValues: [null, undefined, '']
	};

	var opt = options || {};
	this._options = {
		translation: Object.assign(defaultOptions.translation, opt.translation),
		invalidValues: Object.assign(defaultOptions.invalidValues, opt.invalidValues),
		pattern: pattern
	};

	this._handlers = [];

	for (var i = 0; i < pattern.length; i++) {
		var element = pattern[i];

		var result = this._options.translation[element] || element;
		this._handlers.push(result);
	}
};

TinyMask.prototype._isString = function(value) {
	return typeof value === "string";
};

TinyMask.prototype.mask = function (value) {
	var result = '';

	var val = String(value);

	if (val.length === 0) return;

	var maskSize = this._handlers.length;
	var maskResolved = 0;

	var valueSize = val.length;
	var valueResolved = 0;

	while (maskResolved < maskSize) {
		var hand = this._handlers[maskResolved];
		var char = val[valueResolved];

		if (char === undefined) {
			break;
		}

		if (char === hand) {
			result += char;
			maskResolved++;
			valueResolved++
			continue;
		}

		if (this._isString(hand)) {
			result += hand;
			maskResolved++;
			continue;
		}

		var parsed = hand(char);

		if (this._options.invalidValues.indexOf(parsed) < 0) {
			result += parsed;
			valueResolved++;
		}
		else {
			break;
		}

		maskResolved++;
	}

	return result;
};
