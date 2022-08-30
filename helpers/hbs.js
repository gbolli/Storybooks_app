const moment = require('moment')

module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    truncate: (str, len) => {
        if (str.length > len) {
            return str.substr(0, len) + '...'
        } else {
            return str
        }
    },
    stripTags: (input) => {
        // let regex = /(<([^>]+)>)/ig   // TODO: decide which regex is best
        return input.replace(/<(?:.|\n)*?>/gm, '')   // regex to replace any html tags with ''
    }
}
