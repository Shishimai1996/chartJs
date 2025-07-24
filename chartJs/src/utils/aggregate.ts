import { AggregatedData, ReportRow, TCourse } from "../types/types";

export const aggregateByAgeGroup = (rows: ReportRow[]): AggregatedData => {
  const result: AggregatedData = {
    "1950's": 0,
    "1960's": 0,
    "1970's": 0,
    "1980's": 0,
    "1990's": 0,
    "2000's": 0,
  };
  for (const row of rows) {
    const birthYear = Number(row.year);

    if (birthYear >= 1950 && birthYear < 1960) result["1950's"] += 1;
    else if (birthYear >= 1960 && birthYear < 1970) result["1960's"] += 1;
    else if (birthYear >= 1970 && birthYear < 1980) result["1970's"] += 1;
    else if (birthYear >= 1980 && birthYear < 1990) result["1980's"] += 1;
    else if (birthYear >= 1990 && birthYear < 2000) result["1990's"] += 1;
    else if (birthYear >= 2000) result["2000's"] += 1;
  }
  return result;
};

export const aggregateByCourse = (rows: ReportRow[]): TCourse => {
  const result: TCourse = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
  for (const row of rows) {
    const courseNumber = Number(row.course);

    if (courseNumber === 1) result[1] += 1;
    else if (courseNumber === 2) result[2] += 1;
    else if (courseNumber === 3) result[3] += 1;
    else if (courseNumber === 4) result[4] += 1;
  }
  return result;
};
