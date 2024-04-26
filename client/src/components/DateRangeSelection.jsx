import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { FormatDate } from '../functions/dates';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';

export default function DateRangeSelection({
    onSelection = () => {},
    maxDate = moment(new Date()),
    startDate = null,
    endDate = null
}) {
    const [startDateValue, setStartDate] = useState(startDate?moment(startDate):null);
    const [endDateValue, setEndDate] = useState(endDate?moment(endDate):null);

    const selectedStartDate = startDateValue?.format()??null;
    const selectedEndDate = endDateValue?.format()??null;

    useEffect(() => {
        if (typeof onSelection === "function") {
            onSelection(FormatDate(selectedStartDate), FormatDate(selectedEndDate));
        }
    }, [startDateValue, endDateValue]);

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <DatePicker
                label="From"
                maxDate={maxDate}
                value={startDateValue}
                onChange={(startDateValue) => setStartDate(startDateValue)}
            />
            <div>
                –
            </div>
            <DatePicker
                label="To"
                minDate={startDateValue}
                maxDate={maxDate}
                value={endDateValue}
                onChange={(endDateValue) => setEndDate(endDateValue)}
            />
        </Stack>
    );
}