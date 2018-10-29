const { define, get, fetch } = require('./errorApi')();
const errorApi = {
    defineError: define,
    getError: get,
    fetchErrors: fetch
};

/**
 * @param {Object} param
 * @param {Object} param.busConfig - mocked external methods
 * @param {Function} param.errors - error initialization function
 * @param {Object} param.mainLib - methods to be tested
 * @param {Function} param.config - instance config, initialized errors will be passed as argument
 */
module.exports = ({busConfig, errors, mainLib, config}) => {
    const busConfigGlobal = busConfig;
    const errorsGlobal = errors && errors(errorApi);
    const configGlobal = config && config({errors: errorsGlobal});

    const init = ({busConfig, config, errors}) => Object.assign(
        {[`_id_${Math.random()}`]: 'id'},
        mainLib,
        {config},
        {
            errors: {
                ...errors,
                ...errorApi
            },
            bus: {
                importMethod: (method) => (msg) => Promise.resolve((busConfig[method] || (() => ('Method not found')))(msg)),
                config: ((busConfig && busConfig.config) || {})
            },
            log: {error: () => {}, log: () => {}}
        }
    );
    return {
        init: ({busConfig, errors, config} = {}) => {
            let initParams = {
                busConfig: ((busConfig && Object.assign({}, busConfigGlobal, {config: busConfig})) || busConfigGlobal),
                errors: ((errors && Object.assign({}, errorsGlobal, errors(errorApi))) || errorsGlobal)
            };
            initParams.config = ((config && Object.assign({}, configGlobal, config({errors: initParams.errors}))) || configGlobal);

            let inst = init(initParams);
            inst.start && inst.start();

            return inst;
        }
    };
};
