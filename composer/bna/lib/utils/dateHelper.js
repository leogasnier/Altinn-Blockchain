var DateHelper = function () {
};

DateHelper.prototype._MS_PER_DAY = 1000 * 60 * 60 * 24;

DateHelper.prototype.getDateDifferenceInDays = function (date1, date2) {
  return Math.floor((date1.getTime() - date2.getTime()) / this._MS_PER_DAY);
};