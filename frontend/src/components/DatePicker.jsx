import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './DatePicker.css';

const DatePicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const formattedDate = newDate.toISOString().split('T')[0];
        onChange(formattedDate);
        setIsOpen(false);
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Actual days
        for (let day = 1; day <= totalDays; day++) {
            const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value);
        setViewDate(new Date(year, viewDate.getMonth(), 1));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
        years.push(y);
    }

    return (
        <div className="custom-datepicker" ref={containerRef}>
            <label className="datepicker-label">{label}</label>
            <div className="datepicker-input" onClick={() => setIsOpen(!isOpen)}>
                <CalendarIcon size={18} className="calendar-icon" />
                <span className="selected-value">{value || 'Select Date'}</span>
            </div>

            {isOpen && (
                <div className="calendar-popup">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={20} /></button>
                        <div className="month-year-select">
                            <span className="current-month-name">{monthNames[viewDate.getMonth()]}</span>
                            <select
                                value={viewDate.getFullYear()}
                                onChange={handleYearChange}
                                className="year-selector"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={20} /></button>
                    </div>

                    <div className="calendar-weekdays">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>

                    <div className="calendar-grid">
                        {renderDays()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
