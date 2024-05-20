type CustomDataOrNull = CustomData | null;
type StringOrNull = string | null;
type NumberOrNull = number | null;

interface CustomData {
  value: NumberOrNull;
  currency: StringOrNull;
}

interface UserData {
  em: string[] | null;
  ph: string[] | null;
  client_user_agent: string | null;
  client_ip_address: string | null;
}

interface Event {
  event_time: number;
  event_name: string;
  event_source_url: string;
  action_source: string;
  custom_data: CustomDataOrNull;
  user_data: UserData;
  customer_id: string;
  pixel_id: string;
  lead_id: string;
  id: string;
  is_revisit: boolean;
}

export type { CustomDataOrNull, CustomData, UserData, Event };
