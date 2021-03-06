import {describe, beforeEach, it, sinon, expect} from 'test/lib/common'

import * as rangeUtil from 'app/core/utils/rangeutil';
import _ from 'lodash';
import moment from 'moment';

describe("rangeUtil", () => {

  describe("Can get range grouped list of ranges", () => {
    it('when custom settings should return default range list', () => {
      var groups = rangeUtil.getRelativeTimesList({time_options: []}, '最近5分钟');
      expect(_.keys(groups).length).to.be(4)
      expect(groups[3][0].active).to.be(true)
    });

    // it('should add custom options to right section', () => {
    //   var groups = rangeUtil.getRelativeTimesList({
    //     time_options: ['12m', '15d']
    //   }, '');
    //   var value = _.findWhere(groups["3"], {display: 'Last 12 minutes'});
    //   expect(value).to.not.be(undefined)
    // });
  });

  describe("Can get range text described", () => {
    it('should handle simple old expression with only amount and unit', () => {
      var info = rangeUtil.describeTextRange('5m');
      expect(info.display).to.be('最近5分钟')
    });

    it('should have singular when amount is 1', () => {
      var info = rangeUtil.describeTextRange('1h');
      expect(info.display).to.be('最近1小时')
    });

    it('should handle non default amount', () => {
      var info = rangeUtil.describeTextRange('13h');
      expect(info.display).to.be('最近13小时')
      expect(info.from).to.be('now-13h')
    });

    it('should handle now/d', () => {
      var info = rangeUtil.describeTextRange('now/d');
      expect(info.display).to.be('凌晨至今');
    });

    it('should handle now/w', () => {
      var info = rangeUtil.describeTextRange('now/w');
      expect(info.display).to.be('周一至今');
    });
  });

  describe("Can get date range described", () => {
    it('Date range with simple ranges', () => {
      var text = rangeUtil.describeTimeRange({from: 'now-1h', to: 'now'});
      expect(text).to.be('最近1小时')
    });

    it('Date range with rounding ranges', () => {
      var text = rangeUtil.describeTimeRange({from: 'now/d+6h', to: 'now'});
      expect(text).to.be('now/d+6h to now')
    });

    it('Date range with absolute to now', () => {
      var text = rangeUtil.describeTimeRange({from: moment([2014,10,10,2,3,4]), to: 'now'});
      expect(text).to.be('11月 10, 2014 02:03:04 to 几秒前')
    });

    it('Date range with absolute to relative', () => {
      var text = rangeUtil.describeTimeRange({from: moment([2014,10,10,2,3,4]), to: 'now-1d'});
      expect(text).to.be('11月 10, 2014 02:03:04 to 1 天前')
    });

    it('Date range with relative to absolute', () => {
      var text = rangeUtil.describeTimeRange({from: 'now-7d', to: moment([2014,10,10,2,3,4])});
      expect(text).to.be('7 天前 to 11月 10, 2014 02:03:04')
    });

    it('Date range with non matching default ranges', () => {
      var text = rangeUtil.describeTimeRange({from: 'now-13h', to: 'now'});
      expect(text).to.be('最近13小时')
    });

    it('Date range with from and to both are in now-* format', () => {
      var text = rangeUtil.describeTimeRange({from: 'now-6h', to: 'now-3h'});
      expect(text).to.be('now-6h to now-3h')
    });

    it('Date range with from and to both are either in now-* or now/* format', () => {
      var text = rangeUtil.describeTimeRange({from: 'now/d+6h', to: 'now-3h'});
      expect(text).to.be('now/d+6h to now-3h')
    });

    it('Date range with from and to both are either in now-* or now+* format', () => {
      var text = rangeUtil.describeTimeRange({from: 'now-6h', to: 'now+1h'});
      expect(text).to.be('now-6h to now+1h')
    });

  });

});
