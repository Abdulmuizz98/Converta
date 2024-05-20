import { FC } from "react";
import { Event } from "../types";

// interface EventCardProps {
//   name: string;
//   time: number;
// }

// interface Event {
//   event_time: number;
//   event_name: string;
//   event_source_url: string;
//   action_source: string;
//   custom_data: CustomDataOrNull;
//   user_data: UserData;
//   customer_id: string;
//   pixel_id: string;
//   lead_id: string;
//   id: string;
//   is_revisit: boolean;
// }
const formatDate = (time: number) => {
  const date = new Date(time * 1000);
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
};

const EventCard: FC<Event> = (event) => {
  return (
    <div
      className="hs-accordion active bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg dark:bg-gray-800 dark:border-gray-700"
      id="hs-bordered-heading-one"
    >
      <button
        className="hs-accordion-toggle hs-accordion-active:text-blue-600 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 py-4 px-5 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-blue-500 dark:text-gray-200 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:text-gray-400"
        aria-controls="hs-basic-bordered-collapse-one"
      >
        <svg
          className="hs-accordion-active:hidden block size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        <svg
          className="hs-accordion-active:block hidden size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
        </svg>
        <span className="flex justify-between gap-5">
          <span>{event.event_name}</span>
          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
            {formatDate(event.event_time)}
          </span>
        </span>
      </button>
      <div
        id="hs-basic-bordered-collapse-one"
        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
        aria-labelledby="hs-bordered-heading-one"
      >
        <div className="pb-4 px-5">
          <div className="text-gray-800 dark:text-gray-200">
            <ul className="text-sm text-gray-600">
              <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600">
                Source Url: {event.event_source_url}
              </li>
              {event.event_name === "Purchase" && (
                <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600">
                  Purchase Value: {event.custom_data?.value}
                  {event.custom_data?.currency}
                </li>
              )}
              {event.customer_id && (
                <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600">
                  Customer ID: {event.customer_id}
                </li>
              )}
              <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-gray-400 dark:before:bg-gray-600">
                Revisit: {event.is_revisit.toString()}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// {
//     "data": [
//         {
//             "event_name": "ViewContent",
//             "event_time": 1710766457,
//             "action_source": "website",
//             "user_data": {
//                 "em": [
//                     "ad8260b1af4edb273240beb0d11bc566cff25084bc12ed21fc88728eecb62605"
//                 ]
//             },
//             "custom_data": {
//                 "currency": "USD",
//                 "value": 10
//             }
//         }
//     ]
// }
export default EventCard;
