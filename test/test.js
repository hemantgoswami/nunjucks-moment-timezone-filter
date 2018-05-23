const should = require('chai').should()
const expect = require('chai').expect
const dateFilters = require('../index')
const dateFilter = dateFilters.dateFilter
const newDateFilter = dateFilters.newDate
const nunjucks = require('nunjucks')
const moment = require('moment-timezone')

suite('Testing nunjucks-moment-timezone-filte', () => {
  setup(() => {
    this.testDate = '1955-03-29 12:55:55'
    this.dateFormat = 'YYYY-MM-DD HH:mm:ss'
    this.timeZone = 'Europe/London'
    this.testMoment = moment.tz(this.testDate, this.dateFormat, this.timeZone)
    this.testMomentPlus = moment.tz(this.testDate, this.dateFormat, this.timeZone).add(7, 'days')
    this.env = new nunjucks.Environment()
    this.renderNunjucks = function (filter, str) {
      if (str === undefined) {
        str = '{{ my_date | ' + (filter || 'date') + ' }}'
      }
      return this.env.renderString(str, {'my_date': this.testMoment})
    }
  })

  suite('Testing various Date Methods', () => {
    test('Should test the original date with date filter method ', () => {
      dateFilter(this.testMoment).should.equal(this.testMoment.format())
    })

    test('Should test original date with newDate filter', () => {
      newDateFilter(this.testDate).format(this.dateFormat).should.equal(this.testMoment.format(this.dateFormat))
    })

    test('Should test null date with newDate filter', () => {
      const newDate = newDateFilter(null).format(this.dateFormat)
      newDate.should.not.equal('Invalid date')
    })

    test('Should test string null date with newDate filter', () => {
      const newDate = newDateFilter('null').format(this.dateFormat)
      newDate.should.equal('Invalid date')
    })

    test('Should test old old date with newDate filter', () => {
      const newDate = newDateFilter('0001-01-01').format(this.dateFormat)
      newDate.should.equal('0001-01-01 00:00:00')
    })

    test('Should test the original date with timezone ', () => {
      const dateObj = dateFilter(this.testMoment, 'tz', 'Asia/Kolkata')
      const timeZoneDate = dateObj.format(this.dateFormat)
      timeZoneDate.should.equal('1955-03-29 18:25:55')
    })

    test('Should test the original date with date modifications', () => {
      const dateObj = dateFilter(this.testMoment, 'add', 7, 'days')
      const newDate = dateObj.format(this.dateFormat)
      newDate.should.equal(this.testMomentPlus.format(this.dateFormat))
    })

    test('Should test the original date with date modifications using datefilter date format', () => {
      const dateObj = dateFilter(this.testMoment, 'add', 7, 'days')
      const newDate = dateFilter(dateObj, this.dateFormat)
      newDate.should.equal(this.testMomentPlus.format(this.dateFormat))
    })

    test('Should test the original date with date modifications using datefilter defaultDateFormat', () => {
      const newDateFormat = 'YYYY-MM-DD'
      dateFilters.setDefaultFormat(newDateFormat)
      const dateObj = dateFilter(this.testMoment, 'add', 7, 'days')
      const newDate = dateFilter(dateObj)
      newDate.should.equal(this.testMomentPlus.format(newDateFormat))
    })

    test('Should test dateFilter install method', () => {
      dateFilters.setDefaultFormat(false)
      dateFilters.install(this.env)
      expect(this.renderNunjucks('date')).to.be.a('string').and.equal(this.testMoment.format())
    })
  })
})
