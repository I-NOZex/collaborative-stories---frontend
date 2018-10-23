function _wait(ms) {
    return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

export default {
    wait: _wait
}