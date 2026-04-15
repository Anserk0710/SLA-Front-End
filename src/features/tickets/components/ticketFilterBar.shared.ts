export type TicketFilterBarValue = {
  status: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  technicianId: string;
};

export const emptyTicketFilterBarValue: TicketFilterBarValue = {
  status: "",
  category: "",
  dateFrom: "",
  dateTo: "",
  technicianId: "",
};
