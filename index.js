/**
 * nunjucks-moment-timezone-filter
 *
 * Copyright (c) 2018 Hemantkumar Goswami
 * Licensed under the Apache 2.0 license.
 */

var moment = require('moment-timezone')
var nlib = require('nunjucks/src/lib')

// default format (ISO 8601)
var defaultDateFormat = false

// a date (moment-timezone) filter for Nunjucks
// usage #1: {{ my_date_object | date(format) }}
// usage #2: {{ my_utc_date | newDate | date(format) }}
// see: <http://momentjs.com/docs/>
function dateFilter (date, format) {
  var result
  var errs = []
  var args = []
  var obj
  Array.prototype.push.apply(args, arguments)
  try {
    obj = moment.tz(date, '', date.tz())
  } catch (err) {
    errs.push(err)
  }
  if (obj) {
    try {
      if (obj[format] && nlib.isFunction(obj[format])) {
        result = obj[format].apply(obj, args.slice(2))
      } else {
        result = obj.format(format || defaultDateFormat)
      }
    } catch (err) {
      errs.push(err)
    }
  }

  if (errs.length) {
    return errs.join('\n')
  }
  return result
}

function newUTCDate (date = '') {
  if (!date) {
    return new moment.tz('UTC')
  } else {
    return new moment.tz(date, '', 'UTC')
  }
}

// set default format for date
function setDefaultFormat (format) {
  defaultDateFormat = format
}

// install the filter to nunjucks environment
function install (env) {
  env.addFilter('date', dateFilter)
  env.addFilter('newUTCDate', newUTCDate)
}

module.exports = {dateFilter, newDate: newUTCDate, setDefaultFormat, install}
