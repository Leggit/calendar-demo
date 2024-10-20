"use client";

import React, { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

function Calendar() {
  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
  const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
  const [monthCalendar, setMonthCalendar] = useState<
    { date: Temporal.PlainDate; isInMonth: boolean }[]
  >([]);

  const next = () => {
    const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).add({ months: 1 });
    setMonth(nextMonth);
    setYear(nextYear);
  };

  const previous = () => {
    const { month: prevMonth, year: prevYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).subtract({ months: 1 });
    setMonth(prevMonth);
    setYear(prevYear);
  };

  // useEffect means the calendar will update when input parameters change
  useEffect(() => {
    const fiveWeeks = 5 * 7;
    const sixWeeks = 6 * 7;
    const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek - 1;
    // Calculate the overall length including days from the previous and next months to be shown
    const length =
      dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

    // Create blank array
    const calendar = new Array(length)
      .fill({})
      // Populate each day in the array
      .map((_, index) => {
        const date = startOfMonth.add({
          days: index - dayOfWeekMonthStartedOn,
        });
        return {
          isInMonth: !(
            index < dayOfWeekMonthStartedOn ||
            index - dayOfWeekMonthStartedOn >= monthLength
          ),
          date,
        };
      });

    setMonthCalendar(calendar);
  }, [year, month]);

  return (
    <div className="flex-grow flex flex-col max-h-screen">
      <div className="flex justify-start mb-4">
        <button className="btn btn-blue w-[120px] me-2" onClick={previous}>
          &lt; Previous
        </button>
        <button className="btn btn-blue w-[120px]" onClick={next}>
          Next &gt;
        </button>
      </div>
      <h2 className="text-lg font-semibold">
        {Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("en", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <div className="grid grid-cols-7">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (name, index) => (
            <div key={index}>{name}</div>
          )
        )}
      </div>
      <div className="grid grid-cols-7 flex-grow">
        {monthCalendar.map((day, index) => (
          <div
            key={index}
            className={`border border-slate-700 p-2 ${
              day.isInMonth
                ? "bg-black hover:bg-gray-800"
                : "bg-slate-500 hover:bg-slate-600 font-light text-slate-400"
            }`}
          >
            {day.date.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
