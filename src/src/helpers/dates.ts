
export namespace Months {
  export type January = 'January';
  export type February = 'February';
  export type March = 'March';
  export type April = 'April';
  export type May = 'May';
  export type June = 'June';
  export type July = 'July';
  export type August = 'August';
  export type September = 'September';
  export type October = 'October';
  export type November = 'November';
  export type December = 'December';
  export type Month = January | February | March | April
                      | May | June | July | August
                      | September | October | November | December;
  export const January: January = 'January';
  export const February: February = 'February';
  export const March: March = 'March';
  export const April: April = 'April';
  export const May: May = 'May';
  export const June: June = 'June';
  export const July: July = 'July';
  export const August: August = 'August';
  export const September: September = 'September';
  export const October: October = 'October';
  export const November: November = 'November';
  export const December: December = 'December';
  export const Months: Month[] = [January, February, March, April,
                                  May, June, July, August,
                                  September, October, November, December];
}

type DayOfMonth =  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10
                | 11 | 12 | 13 | 14 | 16 | 16 | 17 | 18 | 19 | 20
                | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
                | 31;


export interface AbsoluteDate {
  month: Months.Month;
  day?: DayOfMonth;
  year: number;
}

export namespace AbsoluteDate {
  export function toDate(date: AbsoluteDate, end?: AbsoluteDate) {
    if (date == null) return new Date();
    var month = Months.Months.indexOf(date.month)
    return new Date(date.year, month + (end?1:0), 1);
  }
}

function shouldNever(n: never): never {
  return n;
}

export namespace Numbers {
  interface ExactLocalizationRule {
    type: 'exact';
    match: number;
    format: (n: number) => string;
  }
  interface BetweenLocalizationRule {
    type: 'between';
    start: number;
    end: number;
    format: (n: number) => string;
  }
  interface ElseLocalizationRule {
    type: 'else';
    format: (n: number) => string;
  }
  export type LocalizationRule = ExactLocalizationRule | BetweenLocalizationRule | ElseLocalizationRule;

  export namespace Rule {
    export function between(start: number, end: number, fmt: (n: number) => string): BetweenLocalizationRule {
      return {
        type: 'between',
        start: start,
        end: end,
        format: fmt,
      };
    }
    export function exact(match: number, fmt: (n: number) => string): ExactLocalizationRule {
      return {
        type: 'exact',
        match: match,
        format: fmt,
      };
    }
    export function otherwise(fmt: (n: number) => string): ElseLocalizationRule {
      return {
        type: 'else',
        format: fmt
      };
    }
  }

  export function localize(n: number, rules: LocalizationRule[]): string {
    for (const rule of rules) {
      if (rule.type === 'exact') {
        if (rule.match === n) {
          return rule.format(n);
        }
      } else if (rule.type === 'between') {
        if (rule.start <= n && n < rule.end) {
          return rule.format(n);
        }
      } else if (rule.type === 'else') {
        return rule.format(n);
      }
    }
    throw 'Incomplete ruleset';
  }
}

namespace Language {
  export type Russian = 'russian';
  export type English = 'english';
  export type Language = Russian | English;
}

namespace Localization {
  // TODO: This should allow for a language to be omitted.
  type LocalizedNumber = {[key in Language.Language]: Numbers.LocalizationRule[]}

  const LocalizedYears: LocalizedNumber = {
    'english': [
      Numbers.Rule.exact(1, (n) => [String(n), 'year'].join(' ')),
      Numbers.Rule.otherwise((n) => [String(n), 'years'].join(' ')),
    ],
    'russian': [
      Numbers.Rule.exact(1, (n) => [String(n), 'год'].join(' ')),
      Numbers.Rule.between(1, 5, (n) => [String(n), 'года'].join(' ')),
      Numbers.Rule.otherwise((n) => [String(n), 'лет'].join(' ')),
    ],
  }

  const LocalizedMonths: LocalizedNumber = {
    'english': [
      Numbers.Rule.exact(1, (n) => [String(n), 'month'].join(' ')),
      Numbers.Rule.otherwise((n) => [String(n), 'months'].join(' ')),
    ],
    'russian': [
      Numbers.Rule.exact(1, (n) => [String(n), 'месяц'].join(' ')),
      Numbers.Rule.between(1, 5, (n) => [String(n), 'месяца'].join(' ')),
      Numbers.Rule.otherwise((n) => [String(n), 'месяцев'].join(' ')),
    ]
  }

  export function months(n: number, language: Language.Language): string {
    return Numbers.localize(n, LocalizedMonths[language]);
  }
  export function years(n: number, language: Language.Language): string {
    return Numbers.localize(n, LocalizedYears[language]);
  }
}

export namespace Duration {
  export type Years = 'years';
  export type Months = 'months';
  export type Unit = Years | Months;

  const monthsSingular = 'month';
  const monthsPlural = 'months';
  const yearsSingular = 'year';
  const yearsPlural = 'year';

  export function localize(number: number, unit: Unit, language?: Language.Language): string {
    const lang: Language.Language = language || 'english';
    if (unit === 'years') {
      return Localization.years(number, lang);
    } else if (unit === 'months') {
      return Localization.months(number, lang);
    }
    return shouldNever(unit);
  }
}

export namespace DateMath {
  export function dateFromComponents(date: AbsoluteDate|null, end?: boolean) {
    if (date == null) return new Date();
    var month = Months.Months.indexOf(date.month)
    return new Date(date.year, month + (end?1:0), 1);
  };

  export function monthsDuration(start: AbsoluteDate, end: AbsoluteDate|null): number {
    var endDate = dateFromComponents(end, true);
    var startDate = dateFromComponents(start);
    var months = 0;
    while (endDate.getFullYear() > startDate.getFullYear() || endDate.getMonth() > startDate.getMonth()) {
      endDate.setMonth(endDate.getMonth() - 1);
      months++;
    }
    return months;
  }

  export function yearsDuration(start: AbsoluteDate, end: AbsoluteDate|null) {
    return monthsDuration(start, end) / 12;
  };

  export function durationString(start: AbsoluteDate, end: AbsoluteDate|null): string {
    var months = monthsDuration(start, end);
    var remainingMonths = months % 12;
    var years = (months - remainingMonths) / 12;
    var output = [];
    if (years > 0) {
      output.push(Duration.localize(years, 'years'));
    }
    if (remainingMonths > 0) {
      output.push(Duration.localize(remainingMonths, 'months'));
    }
    return output.join(' ');
  };
}