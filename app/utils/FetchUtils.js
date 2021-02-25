export class FetchUtils {

    static isValidElement(element) {
        return element.name && element.value;
    };

    static isValidValue(element) {
        return (!['checkbox', 'radio'].includes(element.type) || element.checked);
    };

    static isCheckbox(element) {
        return element.type === 'checkbox';
    }

    static isMultiSelect(element) {
        return element.options && element.multiple;
    }

    static getSelectValues(options) {
        return [].reduce.call(options, (values, option) => {
            return option.selected ? values.concat(option.value) : values;
        }, []);
    }

    static formToJSON(form, propValueCallback) {
        return [].reduce.call(form.elements, (data, element) => {
            if (FetchUtils.isValidElement(element) && FetchUtils.isValidValue(element)) {
                let value;

                if (FetchUtils.isCheckbox(element)) {
                    value = (data[element.name] || []).concat(element.value);
                } else if (FetchUtils.isMultiSelect(element)) {
                    value = FetchUtils.getSelectValues(element);
                } else {
                    value = element.value;
                }

                if (typeof value === 'string')
                    value = value.trim();

                if (data[element.name]) {
                    const currentValue = data[element.name];

                    if (Array.isArray(currentValue))
                        value = [...currentValue, value];
                    else
                        value = [currentValue, value];
                }

                if (propValueCallback)
                    data[element.name] = propValueCallback(element.name, value);
                else
                    data[element.name] = value;
            }

            return data;
        }, {});
    }

    static getLocationSearchParams() {
        const str = window.location.hash ? window.location.hash.slice(1) : '';
        const objURL = {};

        str.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function ($0, $1, $2, $3) {
                objURL[$1] = $3;
            }
        );

        return objURL;
    }

    static getPagerData() {
        const searchParams = FetchUtils.getLocationSearchParams();

        const page = parseInt(searchParams.page);
        const limit = parseInt(searchParams.limit);

        return {
            page: isNaN(page) || page < 0 ? 0 : page,
            limit: isNaN(limit) ? 10 : limit
        };
    }

    static getPageSearch(page) {
        const searchParams = FetchUtils.getLocationSearchParams();

        searchParams.page = page;

        return FetchUtils.getSearch(searchParams, false, true);
    }

    static getSearch(searchParams, isAppendParams, isHash) {
        const searchParamsArr = [];

        Object.keys(searchParams).forEach(
            (searchParam) => {
                if (Array.isArray(searchParams[searchParam])) {
                    searchParams[searchParam].forEach((paramItem) => {
                        searchParamsArr.push(`${searchParam}=${paramItem}`);
                    });
                } else if (searchParams[searchParam] != null) {
                    searchParamsArr.push(`${searchParam}=${searchParams[searchParam]}`);
                }
            }
        );

        if (isHash)
            return searchParamsArr.join('&');
        else
            return `${isAppendParams ? '&' : '?'}${searchParamsArr.join('&')}`;
    }
}
