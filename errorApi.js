module.exports = () => {
    let errors = {};
    const define = (type, parent, msg) => {
        let errorType = [parent && parent.type, type]
            .filter(v => v)
            .join('.');
        const error = () => {
            let error = new Error();
            error.type = errorType;
            error.message = msg;

            return error;
        };
        error.type = errorType;
        errors[errorType] = error;

        return error;
    };
    const get = (type) => {
        return errors[type];
    };
    const fetch = (type) => {
        let result = {};
        Object.keys(errors)
            .filter(e => e.startsWith(type))
            .forEach(e => {
                result[e] = errors[e];
            });

        return result;
    };

    return {
        define,
        get,
        fetch
    };
};
