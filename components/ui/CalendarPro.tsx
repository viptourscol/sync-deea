'use client';

import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  tipo?: 'reunion' | 'vencimiento' | 'hito';
  color?: string;
}

interface CalendarProProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

const eventStyleGetter = (event: CalendarEvent) => {
  let backgroundColor = '#3b82f6'; // default blue

  if (event.tipo === 'reunion') {
    backgroundColor = '#3b82f6'; // blue
  } else if (event.tipo === 'vencimiento') {
    backgroundColor = '#dc2626'; // red
  } else if (event.tipo === 'hito') {
    backgroundColor = '#10b981'; // green
  }

  return {
    style: {
      backgroundColor,
      borderRadius: '0.375rem',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
    },
  };
};

export default function CalendarPro({ events, onSelectEvent, onSelectSlot }: CalendarProProps) {
  const defaultDate = useMemo(() => new Date(2026, 0, 1), []);

  return (
    <div className="h-[600px] bg-white rounded-lg border border-gray-200">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultDate={defaultDate}
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        toolbar={true}
        popup={true}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          allDay: 'Todo el día',
          work_week: 'Semana laboral',
          noEventsInRange: 'No hay eventos en este rango',
          showMore: (total) => `+${total} más`,
        }}
      />
    </div>
  );
}
