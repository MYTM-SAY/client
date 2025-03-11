import React from "react";
import { ContributionGraphProps } from "../../types/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Drops {
  value: string;
  label: string;
}
const years: Drops[] = [
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
];
const ContributionGraph = ({ contributions }: ContributionGraphProps) => {
  const colors: string[] = ["#ebedf0", "#8bb4f7", "#5a9cf7", "#3a85f5"];
  const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthShortNames: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let cnt = 1000;
  return (
    <div className="mb-8">
      <div className="flex-between pb-4">
        <p className="h4 ">Activity</p>
        <Select>
          <SelectTrigger className="w-[180px] p-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="custom-dropdown-content">
            {years.map(({ value, label }, idx) => (
              <SelectItem
                key={idx}
                className="custom-dropdown-item p-lg"
                value={value}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto w-full flex gap-5 dark-gray-shadow border-2 rounded-lg py-4 px-6">
        {monthDays.map((month, i) => {
          return (
            <div key={i}>
              <div className="gap-1 flex flex-col items-center flex-wrap w-[56px] h-[90px]">
                {Array.from({ length: month }, (_, index) => {
                  return (
                    <div
                      title={`Number of contributions: ${
                        contributions[index + month]
                      }`}
                      key={cnt++}
                      className="w-2 h-2 rounded-[2px]"
                      style={{
                        backgroundColor:
                          colors[Math.min(contributions[index + month], 3)],
                      }}
                    ></div>
                  );
                })}
              </div>
              <p className="">{monthShortNames[i]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContributionGraph;
