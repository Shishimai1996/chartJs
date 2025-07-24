import React, { useRef } from "react";
import * as Papa from "papaparse";
import { AggregatedData, ReportRow, TCourse } from "../types/types";
import { aggregateByAgeGroup, aggregateByCourse } from "../utils/aggregate";

export function useCsvParser(
  onParsed: (ageData: AggregatedData, courseData: TCourse) => void
) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<ReportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        console.log("result", results.data);
        const parsedData = results.data;
        const aggregated = aggregateByAgeGroup(parsedData);
        const aggregatedCourse = aggregateByCourse(parsedData);
        onParsed(aggregated, aggregatedCourse);
      },
      error(error) {
        console.error("CSV reading error", error);
      },
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  return {
    fileInputRef,
    handleFileChange,
    triggerFileSelect,
  };
}
