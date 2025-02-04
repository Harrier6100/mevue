const moment = require('moment');

const formatDate = (timestamp, format = 'YYYY-MM-DD') => {
    return moment(timestamp).format(format);
};

const formatTime = (timestamp, format = 'HH:mm:ss') => {
    return moment(timestamp).format(format);
};

const formatAt = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(timestamp).format(format);
};

export {
    formatDate,
    formatTime,
    formatAt,
};