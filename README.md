# nunjucks-moment-timezone-filter
Provides moment timezone filter for Nunjucks template engine

> It has two main components dateFilter (date) and newUTCDate (newDate) filters.

##### usage #1:
> If date string is available, convert it into object first and then use it
* `{{ my_utc_date | newDate | date(format) }}`
 
##### usage #2:
> If date object is available pass it in and use it in various ways
* `{{ my_date_object | date('YYYY-MM-DD') }}` to get date in a format
    * Above method will return a string

* `{{ my_date_object | date('tz', 'Asia/Kolkata') | date('YYYY-MM-DD') }}`
    * Above method will use the date object
    * Convert date into desired timezone
    * Print in a following format

* As an example above, we can use any method available with package `moment-timezone` or `moment` and use it to fiddle around with dates
    * ``{{ my_date_object | date('add', 3, 'days') | date('YYYY-MM-DD') }}``
        * Above adds three days and finally prints it
    * `{{ my_date_object | date('tz', 'Asia/Kolkata') | date('add', 12, 'hours') | date('YYYY-MM-DD') }}`
        * Above converts the timzone and then adds 12 hours and finally prints it
