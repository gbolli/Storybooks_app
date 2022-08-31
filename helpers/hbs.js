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
    },
    editIcon: (storyUser, loggedUser, storyId, floating = true) => {
        if (storyUser._id.toString() === loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
            }
        } else {
            return ''
        }
    }
}
